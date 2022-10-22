use anchor_lang::prelude::*;

#[error_code]
pub enum TreeDeaErrors {
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
}
