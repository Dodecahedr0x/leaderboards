use anchor_lang::prelude::*;

#[account]
pub struct Leaderboard {
    /// The ID of the leaderboard
    pub id: Pubkey,

    /// The owner of this mint can update the fee
    pub admin_mint: Pubkey,

    /// The token used to create and vote on entries
    pub vote_mint: Pubkey,

    /// Cost to create a new entry in this leaderboard
    pub entry_creation_fee: u64,

    /// Number of entries
    pub entries: u32,
}

impl Leaderboard {
    pub const LEN: usize = 8 // Discriminator 
    + 32 // ID
    + 32 // Admin mint
    + 32 // Vote mint
    + 8  // Entry creation fee
    + 4; // Entries;
}
