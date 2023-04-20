use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

use crate::constants::{LEADERBOARD_AUTHORITY_SEED, LEADERBOARD_SEED};
use crate::errors::*;
use crate::state::Leaderboard;

pub fn create_leaderboard(
    ctx: Context<CreateLeaderboard>,
    id: Pubkey,
    entry_creation_fee: u64,
) -> Result<()> {
    msg!("Creating a leaderboard");

    let leaderboard = &mut ctx.accounts.leaderboard;

    leaderboard.id = id;
    leaderboard.vote_mint = ctx.accounts.vote_mint.key();
    leaderboard.admin_mint = ctx.accounts.admin_mint.key();
    leaderboard.entry_creation_fee = entry_creation_fee;

    Ok(())
}

#[derive(Accounts)]
#[instruction(id: Pubkey)]
pub struct CreateLeaderboard<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    /// CHECK: Can be anyone
    pub admin: UncheckedAccount<'info>,

    /// The account that manages tokens
    /// CHECK: Safe because this read-only account only gets used as a constraint
    #[account(
        seeds = [
            LEADERBOARD_AUTHORITY_SEED.as_bytes(),
            &id.to_bytes()
        ],
        bump,
    )]
    pub leaderboard_authority: UncheckedAccount<'info>,

    /// The leaderboard
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

    /// The token representing the leaderboard
    /// Its holder has admin authority over the leaderboard
    #[account(
        constraint = admin_mint.supply == 1 @ DipErrors::InvalidAdminMint,
        constraint = admin_mint.decimals == 0 @ DipErrors::InvalidAdminMint,
    )]
    pub admin_mint: Account<'info, Mint>,

    /// The token used to vote on the leaderboard
    #[account(owner = token::ID)]
    pub vote_mint: Account<'info, Mint>,

    /// The account storing vote tokens
    #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = vote_mint,
        associated_token::authority = leaderboard_authority,
    )]
    pub vote_account: Account<'info, TokenAccount>,

    /// Common Solana programs
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
