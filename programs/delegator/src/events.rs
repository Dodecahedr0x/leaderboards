use anchor_lang::prelude::*;

#[event]
pub struct NewDelegator {
    /// Forest where the tree is growing
    pub forest: Pubkey,

    /// The tree
    #[index]
    pub operator: Pubkey,
}
