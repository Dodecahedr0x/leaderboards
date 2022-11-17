use anchor_lang::prelude::*;

use crate::errors::TreeDeaErrors;
use crate::seeds::{NODE_SEED, NOTE_SEED, ROOT_SEED, TREE_SEED};
use crate::state::{Node, Note, Root, Tree, MAX_NOTES_PER_NODE};

pub fn replace_note(ctx: Context<ReplaceNote>) -> Result<()> {
    msg!("Replacing a note");

    let node = &mut ctx.accounts.node;
    let note = &mut ctx.accounts.note;

    node.stake -= ctx.accounts.weak_note.stake;
    node.stake += note.stake;

    let position = node
        .notes
        .iter()
        .position(|n| n == &ctx.accounts.weak_note.key())
        .unwrap();
    node.notes[position] = note.key();

    Ok(())
}

#[derive(Accounts)]
pub struct ReplaceNote<'info> {
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

    /// The node the note will be attached to
    #[account(
        mut,
        seeds = [
            NODE_SEED.as_bytes(),
            &tree.key().to_bytes(),
            &node.parent.key().to_bytes(),
            &node.tags.last().unwrap().as_ref(),
        ],
        bump,
        constraint = node.notes.contains(&weak_note.key()) @ TreeDeaErrors::NotOnNode,
        constraint = !node.notes.contains(&note.key()) @ TreeDeaErrors::AlreadyOnNode,
        constraint = node.notes.len() >= MAX_NOTES_PER_NODE @ TreeDeaErrors::NodeNotFull,
    )]
    pub node: Account<'info, Node>,

    /// The new note
    #[account(
        mut,
        seeds = [
            NOTE_SEED.as_bytes(),
            &tree.key().to_bytes(),
            &note.id.to_bytes()
        ],
        bump,
        constraint = note.parent == node.key() @ TreeDeaErrors::NotChildNote,
        constraint = note.stake > weak_note.stake @ TreeDeaErrors::NotEnoughStake,
    )]
    pub note: Account<'info, Note>,

    /// The new note
    #[account(
        seeds = [
            NOTE_SEED.as_bytes(),
            &tree.key().to_bytes(),
            &weak_note.id.to_bytes()
        ],
        bump,
        constraint = weak_note.parent == node.key() @ TreeDeaErrors::NotChildNote,
    )]
    pub weak_note: Account<'info, Note>,

    /// Common Solana programs
    pub system_program: Program<'info, System>,
}
