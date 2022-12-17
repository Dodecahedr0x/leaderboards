use crate::constants::*;
use anchor_lang::prelude::*;

#[account]
pub struct Tree {
    /// The forest this tree grows in
    pub forest: Pubkey,

    /// The root node of the tree
    pub root_node: Pubkey,

    /// Title of the tree
    pub title: String,

    /// Total staked on this tree
    pub stake: u64,
}

impl Tree {
    pub const LEN: usize = 8 + 2 * 32 + (4 + MAX_TAG_LENGTH);
}
