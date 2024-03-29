use anchor_lang::prelude::*;

#[account]
pub struct StakeDeposit {
    /// The staker owning this account
    pub staker: Pubkey,

    /// The entry staked on
    pub entry: Pubkey,

    /// The amount currently staked
    pub stake: u64,

    /// The amount currently staked
    pub accumulated_stake: u64,

    /// The last time this account was updated
    pub last_update: i64,
}

impl StakeDeposit {
    pub const LEN: usize = 8 // Discriminator
        + 32 // Staker
        + 32 // Note
        + 8  // Stake
        + 8  // Accumulated stake
        + 8; // Update
}
