use anchor_lang::prelude::*;

/// Indicates the maximum depth of the tree
pub const MAX_TAGS: usize = 10;

/// Character length of a tag
pub const MAX_TAG_LENGTH: usize = 256;

/// Maximum number of notes that can be attached to a tree
pub const MAX_NOTES_PER_NODE: usize = 3;

/// The maximum
pub const MAX_CHILD_PER_NODE: usize = 3;

#[account]
pub struct Root {
    /// The ID of the root
    pub id: Pubkey,

    /// The admin of the tree
    pub admin: Pubkey,

    /// The token used to vote for a tag
    pub vote_mint: Pubkey,
}

impl Root {
    pub const LEN: usize = 8 + 3 * 32;
}

#[account]
pub struct Tree {
    /// The root of the tree
    pub root: Pubkey,

    /// The root node of the tree
    pub root_node: Pubkey,

    /// Title of the tree
    pub title: String,
}

impl Tree {
    pub const LEN: usize = 8 + 2 * 32 + (4 + MAX_TAG_LENGTH);
}

#[account]
pub struct Node {
    /// The tree this node belongs to
    pub tree: Pubkey,

    /// The parent of this node
    pub parent: Pubkey,

    /// Children nodes
    pub children: Vec<Pubkey>,

    /// The total staked on notes of this node
    pub stake: u64,

    /// The set of tags of this node
    pub tags: Vec<String>,

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

#[account]
pub struct Tag {
    pub data: u64,
}
