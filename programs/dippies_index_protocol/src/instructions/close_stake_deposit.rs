use anchor_lang::prelude::*;

use crate::constants::{ENTRY_SEED, LEADERBOARD_SEED, STAKE_SEED};
use crate::errors::DipErrors;
use crate::events::ClosedStake;
use crate::state::{Entry, Leaderboard, StakeDeposit};

pub fn close_stake_deposit(ctx: Context<CloseStakeDeposit>) -> Result<()> {
    emit!(ClosedStake {
        staker: ctx.accounts.staker.key(),
        stake: ctx.accounts.stake_deposit.key(),
    });

    Ok(())
}

#[derive(Accounts)]
pub struct CloseStakeDeposit<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    /// CHECK: Verified against the stake deposit
    #[account(mut)]
    pub staker: AccountInfo<'info>,

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
        mut,
        seeds = [
            ENTRY_SEED.as_bytes(),
            &leaderboard.id.to_bytes(),
            &entry.rank.to_le_bytes(),
        ],
        bump
    )]
    pub entry: Box<Account<'info, Entry>>,

    /// The state of the staker's deposit
    #[account(
        mut,
        close = staker,
        seeds = [
            STAKE_SEED.as_bytes(),
            &entry.key().to_bytes(),
            &staker.key().to_bytes()
        ],
        bump,
        has_one = staker,
        constraint = stake_deposit.stake == 0 @ DipErrors::NotEmptyStakeDeposit
    )]
    pub stake_deposit: Box<Account<'info, StakeDeposit>>,

    /// Common Solana programs
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
