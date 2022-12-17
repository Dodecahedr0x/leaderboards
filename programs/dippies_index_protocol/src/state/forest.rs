use anchor_lang::prelude::*;

#[account]
pub struct Forest {
    /// The ID of the forest
    pub id: Pubkey,

    /// The token used to vote for a tag
    pub vote_mint: Pubkey,

    /// Admin of the forest
    pub admin: Pubkey,

    /// Cost to create a tree from this forest
    pub tree_creation_fee: u64,
}

impl Forest {
    pub const LEN: usize = 8 + 3 * 32 + 8;
}
