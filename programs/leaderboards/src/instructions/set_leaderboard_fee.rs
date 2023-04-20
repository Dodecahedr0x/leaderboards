use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

use crate::constants::LEADERBOARD_SEED;
use crate::errors::*;
use crate::state::Leaderboard;

pub fn set_leaderboard_fee(ctx: Context<SetLeaderboardFee>, entry_creation_fee: u64) -> Result<()> {
    msg!("Setting the leaderboard fee");

    let leaderboard = &mut ctx.accounts.leaderboard;
    leaderboard.entry_creation_fee = entry_creation_fee;

    Ok(())
}

#[derive(Accounts)]
#[instruction(admin: Pubkey)]
pub struct SetLeaderboardFee<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    /// The token representing the leaderboard
    /// Its holder has admin authority over the leaderboard
    #[account(owner = token::ID)]
    pub admin_mint: Account<'info, Mint>,

    #[account(
        associated_token::mint = admin_mint,
        associated_token::authority = admin,
        constraint = admin_mint_account.amount == 1 @ DipErrors::NotAdmin,
    )]
    pub admin_mint_account: Box<Account<'info, TokenAccount>>,

    /// The forest
    #[account(
        seeds = [
            LEADERBOARD_SEED.as_bytes(),
            &leaderboard.id.to_bytes(),
        ],
        bump,
        has_one = admin_mint,
    )]
    pub leaderboard: Account<'info, Leaderboard>,

    /// Common Solana programs
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
