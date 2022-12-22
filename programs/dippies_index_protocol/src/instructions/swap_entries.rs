use anchor_lang::prelude::*;

use crate::constants::{ENTRY_SEED, LEADERBOARD_SEED};
use crate::errors::DipErrors;
use crate::state::{Entry, Leaderboard};

pub fn swap_entries(ctx: Context<SwapEntries>) -> Result<()> {
    msg!("Swapping entries");

    let climbing_entry = &mut ctx.accounts.climbing_entry;
    let falling_entry = &mut ctx.accounts.falling_entry;

    // Entries keep the same rank but their content and state are swapped
    // This is done to have easily accessible entries using their rank
    let tmp_stake = climbing_entry.stake;
    climbing_entry.stake = falling_entry.stake;
    falling_entry.stake = tmp_stake;

    let tmp_last_update = climbing_entry.last_update;
    climbing_entry.last_update = falling_entry.last_update;
    falling_entry.last_update = tmp_last_update;

    let tmp_accumulated_stake = climbing_entry.accumulated_stake;
    climbing_entry.accumulated_stake = falling_entry.accumulated_stake;
    falling_entry.accumulated_stake = tmp_accumulated_stake;

    let tmp_content = climbing_entry.content;
    climbing_entry.content = falling_entry.content;
    falling_entry.content = tmp_content;

    Ok(())
}

#[derive(Accounts)]
pub struct SwapEntries<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

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
        seeds = [
            ENTRY_SEED.as_bytes(),
            &leaderboard.id.to_bytes(),
            &climbing_entry.rank.to_le_bytes(),
        ],
        bump,
        constraint = climbing_entry.stake > falling_entry.stake @ DipErrors::NotEnoughStake,
        constraint = climbing_entry.rank < falling_entry.rank @ DipErrors::InvalidReplacement,
    )]
    pub climbing_entry: Account<'info, Entry>,

    /// The outgoing entry
    /// It has to already be on the leaderboard
    #[account(
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