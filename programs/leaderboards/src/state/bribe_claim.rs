use anchor_lang::prelude::*;

#[account]
pub struct BribeClaim {
    /// The bribe being claimed
    pub bribe: Pubkey,

    /// The claimant
    pub claimant: Pubkey,

    /// The accumulated shares at the last update
    pub accumulated_stake: u64,

    /// The last time the bribe was updated
    pub last_update: i64,
}

impl BribeClaim {
    pub const LEN: usize = 8 // Discriminator
        + 32 // Bribe
        + 32 // Claimant
        + 8  // Accumulated stake
        + 8; // Update
}
