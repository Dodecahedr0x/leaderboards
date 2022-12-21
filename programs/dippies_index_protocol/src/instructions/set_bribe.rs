use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{self, transfer, Mint, Token, TokenAccount, Transfer};

use crate::constants::{BRIBE_SEED, ENTRY_SEED, LEADERBOARD_AUTHORITY_SEED, LEADERBOARD_SEED};
use crate::events::UpdatedBribe;
use crate::state::{Bribe, Entry, Leaderboard};

pub fn set_bribe(ctx: Context<SetBribe>, amount: u64) -> Result<()> {
    msg!("Setting a bribe");

    // Updating accumulated stake
    // TODO: Handle wrapping
    let entry = &mut ctx.accounts.entry;
    let current_time = Clock::get()?.unix_timestamp;
    let elapsed_time = (current_time - entry.last_update) as u64;
    entry.last_update = current_time;
    entry.accumulated_stake += entry.stake * elapsed_time;

    let bribe = &mut ctx.accounts.bribe;
    bribe.entry = entry.key();
    bribe.bribe_mint = ctx.accounts.bribe_mint.key();
    bribe.amount += amount;
    bribe.accumulated_stake = entry.accumulated_stake;
    bribe.last_update = Clock::get()?.unix_timestamp;

    transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.briber_account.to_account_info(),
                to: ctx.accounts.bribe_account.to_account_info(),
                authority: ctx.accounts.briber.to_account_info(),
            },
        ),
        amount,
    )?;

    emit!(UpdatedBribe {
        leaderboard: ctx.accounts.leaderboard.key(),
        entry: ctx.accounts.entry.key(),
        bribe_mint: bribe.bribe_mint,
        amount: bribe.amount,
    });

    Ok(())
}

#[derive(Accounts)]
pub struct SetBribe<'info> {
    #[account(mut)]
    pub briber: Signer<'info>,

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
        seeds = [
            LEADERBOARD_SEED.as_bytes(),
            &leaderboard.id.to_bytes(),
        ],
        bump,
    )]
    pub leaderboard: Box<Account<'info, Leaderboard>>,

    /// The entry
    #[account(
        seeds = [
            ENTRY_SEED.as_bytes(),
            &leaderboard.key().to_bytes(),
            &entry.entry_mint.to_bytes(),
        ],
        bump,
    )]
    pub entry: Box<Account<'info, Entry>>,

    /// The bribe
    #[account(
        init_if_needed,
        payer = briber,
        space = Bribe::LEN,
        seeds = [
            BRIBE_SEED.as_bytes(),
            &entry.key().to_bytes(),
            &bribe_mint.key().to_bytes()
        ],
        bump,
    )]
    pub bribe: Account<'info, Bribe>,

    /// The token used to bribe
    #[account(owner = token::ID)]
    pub bribe_mint: Account<'info, Mint>,

    /// The account paying the bribe
    #[account(
        init_if_needed,
        payer = briber,
        associated_token::mint = bribe_mint,
        associated_token::authority = briber,
    )]
    pub briber_account: Account<'info, TokenAccount>,

    /// The account storing the bribe
    #[account(
        init_if_needed,
        payer = briber,
        associated_token::mint = bribe_mint,
        associated_token::authority = leaderboard_authority,
    )]
    pub bribe_account: Account<'info, TokenAccount>,

    /// Common Solana programs
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
