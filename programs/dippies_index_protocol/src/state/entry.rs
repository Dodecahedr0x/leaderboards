use anchor_lang::prelude::*;

#[account]
pub struct Entry {
    /// The leaderboard this entry is from
    pub leaderboard: Pubkey,

    /// The current rank of the entry
    pub rank: u32,

    /// Total currently staked on this entry
    pub stake: u64,

    /// Last time the stake was updated
    pub last_update: i64,

    /// Total staked accumulated on this entry
    pub accumulated_stake: u64,
}

impl Entry {
    pub const LEN: usize = 8 // Discriminator
    + 32 // Leaderboard
    + 4  // Rank
    + 8  // Stake
    + 8  // Last Update
    + 8; // Accumulated stake
}
