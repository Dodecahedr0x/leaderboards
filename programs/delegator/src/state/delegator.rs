use anchor_lang::prelude::*;

#[account]
pub struct Delegator {
    /// The forest this delegator work in
    pub forest: Pubkey,

    /// The root node of the tree
    pub operator: Pubkey,

    /// Total delegated staked
    pub total_stake: u64,

    /// The commission taken on bribe
    pub commission: u16,
}

impl Delegator {
    pub const LEN: usize = 8 + 32 + 32 + 8 + 2;
}
