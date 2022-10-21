use anchor_lang::prelude::*;

/// Indicates the maximum depth of the tree
pub const MAX_TAGS: usize = 10;

/// Maximum number of notes that can be attached to a tree
pub const MAX_NOTES_PER_NODE: usize = 3;

/// Character length of a tag
pub const MAX_TAG_LENGTH: usize = 256;

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
}

impl Tree {
    pub const LEN: usize = 8 + 2 * 32;
}

#[account]
pub struct Node {
    /// The tree this node belongs to
    pub tree: Pubkey,

    /// The parent of this node
    pub parent: Pubkey,

    /// The left child
    pub left_child: Option<Pubkey>,

    /// The right child
    pub right_child: Option<Pubkey>,

    /// The razor tag that defines what tags children will have
    pub razor: String,

    /// The set of tags of this node
    pub tags: Vec<String>,

    /// The set of nagative tags of this node
    pub not_tags: Vec<String>,

    /// The set of notes currently attached to this node
    pub notes: Vec<Pubkey>,
}

impl Node {
    pub const LEN: usize = 8 // Discriminator
        + 32 // Tree
        + 3 * 33 // Parent and child
        + (4 + MAX_TAG_LENGTH) // Razor
        + (4 + (4 + MAX_TAG_LENGTH) * MAX_TAGS) // Tags
        + (4 + (4 + MAX_TAG_LENGTH) * MAX_TAGS) // Negative Tags
        + (4 + MAX_NOTES_PER_NODE * 32); // Notes
}

#[account]
pub struct Tag {
    pub data: u64,
}
