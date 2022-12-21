use anchor_lang::prelude::*;

#[event]
pub struct NewEntry {
    /// Leaderboard this entry is on
    pub leaderboard: Pubkey,

    /// The entry
    #[index]
    pub entry: Pubkey,
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
pub struct UpdatedStake {
    /// The leaderboard
    pub leaderboard: Pubkey,

    /// The entry staked on
    pub entry: Pubkey,

    /// The account holding the stake
    #[index]
    pub stake: Pubkey,

    /// The new amount staked on the note
    pub amount: u64,
}

#[event]
pub struct UpdatedBribe {
    /// The leaderboard
    pub leaderboard: Pubkey,

    /// The entry bribed
    #[index]
    pub entry: Pubkey,

    /// The token used to bribe
    pub bribe_mint: Pubkey,

    /// The bribe amount available
    pub amount: u64,
}
