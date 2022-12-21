use anchor_lang::prelude::*;

#[error_code]
pub enum DipErrors {
    #[msg("Not the admin")]
    NotAdmin,

    #[msg("The entry is not on the leaderboard")]
    NotOnLeaderboard,

    #[msg("Highest stake entry must have a lower index")]
    InvalidReplacement,

    #[msg("Given string is too long")]
    StringTooLong,

    #[msg("Node is already full")]
    NodeFull,

    #[msg("Node is not full yet")]
    NodeNotFull,

    #[msg("Target node is not a child")]
    NotAChild,

    #[msg("Target node is already a child")]
    AlreadyAChild,

    #[msg("Not enough stake to replace")]
    NotEnoughStake,

    #[msg("Invalid node")]
    InvalidNode,

    #[msg("Tags do not match")]
    TagsMismatch,

    #[msg("Target note is not a child of the node")]
    NotChildNote,

    #[msg("Target note is not attached to the node")]
    NotOnNode,

    #[msg("Target note is already on the node")]
    AlreadyOnNode,
}
