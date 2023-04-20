use anchor_lang::prelude::*;

use crate::constants::{ENTRY_SEED, LEADERBOARD_SEED};
use crate::errors::DipErrors;
use crate::state::{Entry, Leaderboard};

pub fn swap_entries(ctx: Context<SwapEntries>) -> Result<()> {
    msg!("Swapping entries");

    let climbing_entry = &mut ctx.accounts.climbing_entry;
    let falling_entry = &mut ctx.accounts.falling_entry;

    // Entries keep the same rank but their content are swapped
    // This is done to have easily accessible entries using their rank
    let tmp_content = climbing_entry.content;
    climbing_entry.content = falling_entry.content;
    falling_entry.content = tmp_content;

    Ok(())
}

#[derive(Accounts)]
pub struct SwapEntries<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    /// The leaderboard
    #[account(
        seeds = [
            LEADERBOARD_SEED.as_bytes(),
            &leaderboard.id.to_bytes(),
        ],
        bump,
    )]
    pub leaderboard: Account<'info, Leaderboard>,

    /// The incomming entry
    #[account(
        mut,
        seeds = [
            ENTRY_SEED.as_bytes(),
            &leaderboard.id.to_bytes(),
            &climbing_entry.rank.to_le_bytes(),
        ],
        bump,
        constraint = climbing_entry.content.stake > falling_entry.content.stake @ DipErrors::NotEnoughStake,
        constraint = climbing_entry.rank > falling_entry.rank @ DipErrors::InvalidReplacement,
    )]
    pub climbing_entry: Account<'info, Entry>,

    /// The outgoing entry
    /// It has to already be on the leaderboard
    #[account(
        mut,
        seeds = [
            ENTRY_SEED.as_bytes(),
            &leaderboard.id.to_bytes(),
            &falling_entry.rank.to_le_bytes(),
        ],
        bump,
    )]
    pub falling_entry: Account<'info, Entry>,

    /// Common Solana programs
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
