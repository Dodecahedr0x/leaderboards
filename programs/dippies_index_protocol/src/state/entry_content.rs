use anchor_lang::prelude::*;

#[account]
pub struct EntryContent {
    /// The entry that holds this content
    pub entry: Pubkey,

    /// The mint storing its informations
    pub content_mint: Pubkey,
}

impl EntryContent {
    pub const LEN: usize = 8 // Discriminator
    + 32  // Entry
    + 32; // Content mint
}
