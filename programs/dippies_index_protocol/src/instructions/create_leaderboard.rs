use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

use crate::constants::{LEADERBOARD_AUTHORITY_SEED, LEADERBOARD_SEED};
use crate::state::Leaderboard;

pub fn create_forest(
    ctx: Context<CreateLeaderboard>,
    id: Pubkey,
    admin: Pubkey,
    tree_creation_fee: u64,
) -> Result<()> {
    msg!("Creating a leaderboard");

    let forest = &mut ctx.accounts.leaderboard;

    forest.id = id;
    forest.vote_mint = ctx.accounts.vote_mint.key();
    forest.admin_mint = ctx.accounts.admin_mint.key();
    forest.entry_creation_fee = tree_creation_fee;

    Ok(())
}

#[derive(Accounts)]
#[instruction(id: Pubkey)]
pub struct CreateLeaderboard<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    pub admin: UncheckedAccount<'info>,

    /// The account that manages tokens
    /// CHECK: Safe because this read-only account only gets used as a constraint
    #[account(
        seeds = [
            LEADERBOARD_AUTHORITY_SEED.as_bytes(),
            &leaderboard.key().to_bytes()
        ],
        bump,
    )]
    pub forest_authority: UncheckedAccount<'info>,

    /// The forest
    #[account(
        init,
        payer = payer,
        space = Leaderboard::LEN,
        seeds = [
            LEADERBOARD_SEED.as_bytes(),
            &id.to_bytes(),
        ],
        bump,
    )]
    pub leaderboard: Account<'info, Leaderboard>,

    /// The token used to vote for nodes and tags
    #[account(
        init_if_needed,
        payer = payer,
        mint::authority = admin,
        mint::decimals = 9
    )]
    pub admin_mint: Account<'info, Mint>,

    /// The token used to vote for nodes and tags
    #[account(owner = token::ID)]
    pub vote_mint: Account<'info, Mint>,

    /// The account storing vote tokens
    #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = vote_mint,
        associated_token::authority = forest_authority,
    )]
    pub vote_account: Account<'info, TokenAccount>,

    /// Common Solana programs
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
