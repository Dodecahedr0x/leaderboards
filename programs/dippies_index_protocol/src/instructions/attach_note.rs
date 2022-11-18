use anchor_lang::prelude::*;

use crate::seeds::{FOREST_SEED, NODE_SEED, NOTE_SEED, TREE_SEED};
use crate::state::{Forest, Node, Note, Tree, MAX_CHILD_PER_NODE};

pub fn attach_note(ctx: Context<AttachNote>) -> Result<()> {
    msg!("Attaching child note");

    let node = &mut ctx.accounts.node;
    node.notes.push(ctx.accounts.note.key());
    node.stake += ctx.accounts.note.stake;

    Ok(())
}

#[derive(Accounts)]
pub struct AttachNote<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    /// The forest
    #[account(
        seeds = [
            FOREST_SEED.as_bytes(),
            &forest.id.to_bytes(),
        ],
        bump,
    )]
    pub forest: Account<'info, Forest>,

    /// The tree
    #[account(
        seeds = [
            TREE_SEED.as_bytes(),
            &forest.key().to_bytes(),
            &tree.title.as_ref(),
        ],
        bump,
    )]
    pub tree: Account<'info, Tree>,

    /// The parent node to attach to
    #[account(
        mut,
        seeds = [
            NODE_SEED.as_bytes(),
            &tree.key().to_bytes(),
            &node.parent.key().to_bytes(),
            &node.tags.last().unwrap().as_ref(),
        ],
        bump,
        constraint = node.notes.len() < MAX_CHILD_PER_NODE,
    )]
    pub node: Account<'info, Node>,

    /// The attached note
    #[account(
        mut,
        seeds = [
            NOTE_SEED.as_bytes(),
            &tree.key().to_bytes(),
            &note.id.to_bytes(),
        ],
        bump,
    )]
    pub note: Account<'info, Note>,

    /// Common Solana programs
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
