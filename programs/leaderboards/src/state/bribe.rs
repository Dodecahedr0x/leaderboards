use anchor_lang::prelude::*;

#[account]
pub struct Bribe {
    /// The entry receiving the bribe
    pub entry: Pubkey,

    /// The mint of the bribe
    pub bribe_mint: Pubkey,

    /// Claimable bribe amount
    pub amount: u64,

    /// The accumulated shares at the last update
    pub accumulated_stake: u64,

    /// The last time the bribe was updated
    pub last_update: i64,
}

impl Bribe {
    pub const LEN: usize = 8 // Discriminator
        + 32 // Note
        + 32 // Mint
        + 8  // Claimable amount
        + 8  // Accumulated stake
        + 8; // Update
}
