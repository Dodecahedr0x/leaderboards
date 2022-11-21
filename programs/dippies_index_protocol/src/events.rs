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
