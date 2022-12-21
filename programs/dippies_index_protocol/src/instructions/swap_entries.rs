use anchor_lang::prelude::*;

use crate::constants::{ENTRY_CONTENT_SEED, ENTRY_SEED, LEADERBOARD_SEED};
use crate::errors::DipErrors;
use crate::state::{Entry, EntryContent, Leaderboard};

pub fn swap_entries(ctx: Context<SwapEntries>) -> Result<()> {
    msg!("Swapping entries");

    let climbing_entry = &mut ctx.accounts.climbing_entry;
    let climbing_content = &mut ctx.accounts.climbing_content;
    let falling_entry = &mut ctx.accounts.falling_entry;
    let falling_content = &mut ctx.accounts.falling_content;

    // Entries keep the same rank but their content and state are swapped
    let tmp_stake = climbing_entry.stake;
    climbing_entry.stake = falling_entry.stake;
    falling_entry.stake = tmp_stake;

    let tmp_last_update = climbing_entry.last_update;
    climbing_entry.last_update = falling_entry.last_update;
    falling_entry.last_update = tmp_last_update;

    let tmp_accumulated_stake = climbing_entry.accumulated_stake;
    climbing_entry.accumulated_stake = falling_entry.accumulated_stake;
    falling_entry.accumulated_stake = tmp_accumulated_stake;

    climbing_content.entry = falling_entry.key();
    falling_content.entry = climbing_entry.key();

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

    #[account(
        mut,
        seeds = [
            ENTRY_CONTENT_SEED.as_bytes(),
            &leaderboard.id.to_bytes(),
            &climbing_content.content_mint.to_bytes(),
        ],
        bump,
    )]
    pub climbing_content: Box<Account<'info, EntryContent>>,

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

    #[account(
        mut,
        seeds = [
            ENTRY_CONTENT_SEED.as_bytes(),
            &leaderboard.id.to_bytes(),
            &falling_content.content_mint.to_bytes(),
        ],
        bump,
    )]
    pub falling_content: Box<Account<'info, EntryContent>>,

    /// Common Solana programs
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
