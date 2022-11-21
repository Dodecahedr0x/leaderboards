use anchor_lang::prelude::*;

#[event]
pub struct NewTree {
    /// Forest where the tree is growing
    pub forest: Pubkey,

    /// The growing tree
    #[index]
    pub tree: Pubkey,

    /// The title of the tree
    pub title: String,
}

#[event]
pub struct NewNode {
    /// Forest where the tree is growing
    pub forest: Pubkey,

    /// The tree
    pub tree: Pubkey,

    /// The new node
    #[index]
    pub node: Pubkey,
}

#[event]
pub struct NewAttachedNote {
    /// Forest where the tree is growing
    pub forest: Pubkey,

    /// The tree
    pub tree: Pubkey,

    /// The node which has changing notes
    #[index]
    pub node: Pubkey,

    /// The newly attached note
    pub note: Pubkey,
}

#[event]
pub struct UpdatedBribe {
    /// Forest where the tree is growing
    pub forest: Pubkey,

    /// The tree
    pub tree: Pubkey,

    /// The node on which the note is attached
    pub node: Pubkey,

    /// The note receiving the bribe
    #[index]
    pub note: Pubkey,
}
