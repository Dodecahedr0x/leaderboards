use anchor_lang::prelude::*;

#[derive(AnchorDeserialize, AnchorSerialize, Clone, Copy)]
pub struct EntryContent {
    /// Content NFT
    pub content_mint: Pubkey,

    /// Total currently staked on this entry
    pub stake: u64,

    /// Last time the stake was updated
    pub last_update: i64,

    /// Total staked accumulated on this entry
    pub accumulated_stake: u64,
}

#[account]
pub struct Entry {
    /// The leaderboard this entry is from
    pub leaderboard: Pubkey,

    /// The current rank of the entry
    pub rank: u32,

    /// The content of the entry
    pub content: EntryContent,
}

impl Entry {
    pub const LEN: usize = 8 // Discriminator
    + 32 // Leaderboard
    + 4  // Rank
    + 32 // Content
    + 8  // Stake
    + 8  // Last Update
    + 8; // Accumulated stake
}
