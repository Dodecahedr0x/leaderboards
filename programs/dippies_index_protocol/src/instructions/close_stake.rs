use anchor_lang::prelude::*;

use crate::seeds::{NOTE_SEED, ROOT_SEED, STAKE_SEED, TREE_SEED};
use crate::state::{Note, Root, StakeState, Tree};

pub fn close_stake(_ctx: Context<CloseStake>) -> Result<()> {
    Ok(())
}

#[derive(Accounts)]
pub struct CloseStake<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    /// The global root
    #[account(
        seeds = [
            ROOT_SEED.as_bytes(),
            &root.id.to_bytes(),
        ],
        bump,
    )]
    pub root: Account<'info, Root>,

    /// The tree
    #[account(
        seeds = [
            TREE_SEED.as_bytes(),
            &root.key().to_bytes(),
            &tree.title.as_ref(),
        ],
        bump,
    )]
    pub tree: Account<'info, Tree>,

    /// The attached note
    #[account(
        seeds = [
            NOTE_SEED.as_bytes(),
            &tree.key().to_bytes(),
            &note.id.to_bytes(),
        ],
        bump,
    )]
    pub note: Account<'info, Note>,

    /// The account storing vote tokens
    #[account(
        mut,
        close = signer,
        seeds = [
            STAKE_SEED.as_bytes(),
            &note.key().to_bytes(),
            &signer.key().to_bytes()
        ],
        bump,
        constraint = stake_state.stake == 0,
    )]
    pub stake_state: Box<Account<'info, StakeState>>,

    /// Common Solana programs
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
