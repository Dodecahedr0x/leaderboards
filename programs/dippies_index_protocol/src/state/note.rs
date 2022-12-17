use crate::constants::*;
use anchor_lang::prelude::*;

#[account]
pub struct Note {
    /// Unique noteidetifier
    pub id: Pubkey,

    /// The tree this onte belongs to
    pub tree: Pubkey,

    /// The node this note is attached to
    pub parent: Pubkey,

    /// The stake currently on this note
    pub stake: u64,

    /// The total stake accumulated per unit of time
    pub accumulated_stake: u64,

    /// The last time this note was updated
    pub last_update: i64,

    /// The title of the note
    pub title: String,

    /// The website the note points to
    pub website: String,

    /// Thecoverimage ofthe note
    pub image: String,

    /// A short description of the website the note points to
    pub description: String,

    /// The set of tags on this node
    pub tags: Vec<String>,
}

impl Note {
    pub const LEN: usize = 8 // Discriminator
        + 32 // ID
        + 32 // Tree
        + 32 // Parent
        + 8  // Stake
        + 8  // Accumulated Stake
        + 8  // Last Update
        + (4 + MAX_TAG_LENGTH) // Title
        + (4 + MAX_URI_LENGTH) * 2 // Website and image
        + (4 + MAX_DESCRIPTION_LENGTH) // Description
        + (4 + MAX_TAGS * MAX_TAG_LENGTH); // Tags
}
