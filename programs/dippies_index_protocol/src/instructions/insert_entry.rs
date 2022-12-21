use anchor_lang::prelude::*;

use crate::constants::{ENTRY_SEED, LEADERBOARD_SEED, MAX_ENTRIES_PER_LEADERBOARD};
use crate::state::{Entry, Leaderboard};

pub fn insert_entry(ctx: Context<InsertEntry>) -> Result<()> {
    msg!("Inserting entry");

    let leaderboard = &mut ctx.accounts.leaderboard;
    leaderboard.entries.push(ctx.accounts.entry.key());

    Ok(())
}

#[derive(Accounts)]
pub struct InsertEntry<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    /// The leaderboard
    #[account(
        seeds = [
            LEADERBOARD_SEED.as_bytes(),
            &leaderboard.id.to_bytes(),
        ],
        bump,
        constraint = leaderboard.entries.len() < MAX_ENTRIES_PER_LEADERBOARD,
    )]
    pub leaderboard: Account<'info, Leaderboard>,

    /// The entry
    #[account(
        seeds = [
            ENTRY_SEED.as_bytes(),
            &leaderboard.key().to_bytes(),
            &entry.entry_mint.to_bytes(),
        ],
        bump,
    )]
    pub entry: Account<'info, Entry>,

    /// Common Solana programs
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
