use anchor_lang::prelude::*;

#[error_code]
pub enum TreeDeaErrors {
    #[msg("Given string is too long")]
    StringTooLong,
}
