use anchor_lang::prelude::*;

#[account]
pub struct Entry {
    /// The leaderboard this entry is from
    pub leaderboard: Pubkey,

    /// The mint of the entry storing its informations
    pub entry_mint: Pubkey,

    /// Total staked on this entry
    pub stake: u64,
}

impl Entry {
    pub const LEN: usize = 8 // Discriminator
    + 32 // Leaderboard
    + 32 // Entry mint
    + 8; // Stake
}