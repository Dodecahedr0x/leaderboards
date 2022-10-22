use anchor_lang::prelude::*;

use crate::seeds::{NODE_SEED, NOTE_SEED, ROOT_SEED, TREE_SEED};
use crate::state::{Node, Note, Root, Tree, MAX_CHILD_PER_NODE};

pub fn attach_note(ctx: Context<AttachNote>) -> Result<()> {
    msg!("Attaching child note");

    let parent_node = &mut ctx.accounts.parent_node;
    parent_node.notes.push(ctx.accounts.note.key());

    Ok(())
}

#[derive(Accounts)]
pub struct AttachNote<'info> {
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

    /// The parent node to attach to
    #[account(
        mut,
        seeds = [
            NODE_SEED.as_bytes(),
            &tree.key().to_bytes(),
            &parent_node.parent.key().to_bytes(),
            &parent_node.tags.last().unwrap().as_ref(),
        ],
        bump,
        constraint = parent_node.notes.len() < MAX_CHILD_PER_NODE,
    )]
    pub parent_node: Account<'info, Node>,

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
