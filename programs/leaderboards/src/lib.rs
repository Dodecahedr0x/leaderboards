mod constants;
mod errors;
mod events;
mod instructions;
mod state;

use anchor_lang::prelude::*;
use instructions::*;

declare_id!("C2WzwqdpPaiRP6H9C11331nLhyKtq2WA7hse25ajvJyb");

#[program]
pub mod leaderboards {
    use super::*;

    pub fn create_leaderboard(
        ctx: Context<CreateLeaderboard>,
        id: Pubkey,
        entry_creation_fee: u64,
    ) -> Result<()> {
        instructions::create_leaderboard(ctx, id, entry_creation_fee)
    }

    pub fn set_leaderboard_fee(
        ctx: Context<SetLeaderboardFee>,
        entry_creation_fee: u64,
    ) -> Result<()> {
        instructions::set_leaderboard_fee(ctx, entry_creation_fee)
    }

    pub fn create_entry(ctx: Context<CreateEntry>) -> Result<()> {
        instructions::create_entry(ctx)
    }

    pub fn swap_entries(ctx: Context<SwapEntries>) -> Result<()> {
        instructions::swap_entries(ctx)
    }

    pub fn create_stake_deposit(ctx: Context<CreateStakeDeposit>) -> Result<()> {
        instructions::create_stake_deposit(ctx)
    }

    pub fn update_stake(ctx: Context<UpdateStake>, stake: i128) -> Result<()> {
        instructions::update_stake(ctx, stake)
    }

    pub fn close_stake_deposit(ctx: Context<CloseStakeDeposit>) -> Result<()> {
        instructions::close_stake_deposit(ctx)
    }

    pub fn set_bribe(ctx: Context<SetBribe>, amount: u64) -> Result<()> {
        instructions::set_bribe(ctx, amount)
    }

    pub fn claim_bribe(ctx: Context<ClaimBribe>) -> Result<()> {
        instructions::claim_bribe(ctx)
    }
}
