use anchor_lang::prelude::*;

use crate::constants::{ENTRY_SEED, LEADERBOARD_SEED};
use crate::errors::DipErrors;
use crate::state::{Entry, Leaderboard};

pub fn replace_entry(ctx: Context<ReplaceEntry>) -> Result<()> {
    msg!("Replacing an entry");

    let leaderboard = &mut ctx.accounts.leaderboard;

    let position_outgoing = leaderboard
        .entries
        .iter()
        .position(|x| x == &ctx.accounts.incoming_entry.key());
    if position_outgoing.is_none() {
        return err!(DipErrors::NotOnLeaderboard);
    }

    let position_incoming = leaderboard
        .entries
        .iter()
        .position(|x| x == &ctx.accounts.incoming_entry.key());
    if position_incoming.is_some() {
        // The entry is already on the leaderboard
        if position_incoming < position_outgoing {
            return err!(DipErrors::InvalidReplacement);
        }

        leaderboard
            .entries
            .swap(position_outgoing.unwrap(), position_incoming.unwrap());
    } else {
        // This entry is not on the board
        leaderboard.entries[position_outgoing.unwrap()] = ctx.accounts.incoming_entry.key();
    }

    Ok(())
}

#[derive(Accounts)]
pub struct ReplaceEntry<'info> {
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
            &leaderboard.key().to_bytes(),
            &incoming_entry.entry_mint.to_bytes(),
        ],
        bump,
        constraint = incoming_entry.stake > outgoing_entry.stake @ DipErrors::NotEnoughStake
    )]
    pub incoming_entry: Account<'info, Entry>,

    /// The outgoing entry
    /// It has to already be on the leaderboard
    #[account(
        seeds = [
            ENTRY_SEED.as_bytes(),
            &leaderboard.key().to_bytes(),
            &outgoing_entry.entry_mint.to_bytes(),
        ],
        bump,
    )]
    pub outgoing_entry: Account<'info, Entry>,

    /// Common Solana programs
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
