use crate::constants::*;
use anchor_lang::prelude::*;

#[account]
pub struct Node {
    /// The tree this node belongs to
    pub tree: Pubkey,

    /// The parent of this node
    pub parent: Pubkey,

    /// The total staked on notes of this node
    pub stake: u64,

    /// The set of tags of this node
    pub tags: Vec<String>,

    /// Children nodes
    pub children: Vec<Pubkey>,

    /// The set of notes currently attached to this node
    pub notes: Vec<Pubkey>,
}

impl Node {
    pub const LEN: usize = 8 // Discriminator
        + 32 // Tree
        + 32 // Parent
        + (4 + MAX_CHILD_PER_NODE * 32) // Children
        + 8 // Stake
        + (4 + (4 + MAX_TAG_LENGTH) * MAX_TAGS) // Tags
        + (4 + MAX_NOTES_PER_NODE * 32); // Notes
}
