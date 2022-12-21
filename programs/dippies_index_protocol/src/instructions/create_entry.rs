use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{self, transfer, Mint, Token, TokenAccount, Transfer};

use crate::constants::{
    ENTRY_CONTENT_SEED, ENTRY_SEED, LEADERBOARD_AUTHORITY_SEED, LEADERBOARD_SEED,
};
use crate::errors::DipErrors;
use crate::events;
use crate::state::{Entry, EntryContent, Leaderboard};

pub fn create_entry(ctx: Context<CreateEntry>) -> Result<()> {
    msg!("Creating the entry");

    let fee = ctx.accounts.leaderboard.entry_creation_fee;
    if fee > 0 {
        transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.creator_account.to_account_info(),
                    to: ctx.accounts.admin_vote_account.to_account_info(),
                    authority: ctx.accounts.payer.to_account_info(),
                },
            ),
            fee,
        )?;
    }

    let leaderboard = &mut ctx.accounts.leaderboard;

    let entry = &mut ctx.accounts.entry;
    entry.leaderboard = leaderboard.key();
    entry.rank = leaderboard.entries;

    let content = &mut ctx.accounts.content;
    content.content_mint = ctx.accounts.content_mint.key();
    content.entry = entry.key();

    leaderboard.entries += 1;

    emit!(events::NewEntry {
        leaderboard: ctx.accounts.leaderboard.key(),
        entry: ctx.accounts.entry.key(),
    });

    Ok(())
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct CreateEntry<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    /// CHECK: Check against leaderboard
    pub admin: AccountInfo<'info>,

    /// The token representing the leaderboard
    /// Its holder has admin authority over the leaderboard
    #[account(owner = token::ID)]
    pub admin_mint: Account<'info, Mint>,

    #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = admin_mint,
        associated_token::authority = admin,
        constraint = admin_mint_account.amount == 1 @ DipErrors::NotAdmin,
    )]
    pub admin_mint_account: Box<Account<'info, TokenAccount>>,

    /// The account that manages tokens
    /// CHECK: Safe because this read-only account only gets used as a constraint
    #[account(
        seeds = [
            LEADERBOARD_AUTHORITY_SEED.as_bytes(),
            &leaderboard.id.to_bytes()
        ],
        bump,
    )]
    pub leaderboard_authority: UncheckedAccount<'info>,

    /// The leaderboard
    #[account(
        mut,
        seeds = [
            LEADERBOARD_SEED.as_bytes(),
            &leaderboard.id.to_bytes(),
        ],
        bump,
        has_one = admin_mint,
        has_one = vote_mint,
    )]
    pub leaderboard: Account<'info, Leaderboard>,

    /// Mint of the token used to stake
    pub vote_mint: Account<'info, Mint>,

    #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = vote_mint,
        associated_token::authority = payer,
    )]
    pub creator_account: Box<Account<'info, TokenAccount>>,

    #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = vote_mint,
        associated_token::authority = admin,
    )]
    pub admin_vote_account: Box<Account<'info, TokenAccount>>,

    #[account(
        init,
        payer = payer,
        space = Entry::LEN,
        seeds = [
            ENTRY_SEED.as_bytes(),
            &leaderboard.id.to_bytes(),
            &leaderboard.entries.to_le_bytes(),
        ],
        bump,
    )]
    pub entry: Box<Account<'info, Entry>>,

    /// The token representing the entry
    #[account(
        init_if_needed,
        payer = payer,
        mint::authority = payer,
        mint::decimals = 0
    )]
    pub content_mint: Account<'info, Mint>,

    #[account(
        init,
        payer = payer,
        space = EntryContent::LEN,
        seeds = [
            ENTRY_CONTENT_SEED.as_bytes(),
            &leaderboard.id.to_bytes(),
            &content_mint.key().to_bytes(),
        ],
        bump,
    )]
    pub content: Box<Account<'info, EntryContent>>,

    /// Common Solana programs
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
