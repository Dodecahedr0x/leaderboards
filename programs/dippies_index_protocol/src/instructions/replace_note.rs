use anchor_lang::prelude::*;

use crate::errors::DipErrors;
use crate::seeds::{FOREST_SEED, NODE_SEED, NOTE_SEED, TREE_SEED};
use crate::state::{Forest, Node, Note, Tree, MAX_NOTES_PER_NODE};

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
        constraint = node.notes.contains(&weak_note.key()) @ DipErrors::NotOnNode,
        constraint = !node.notes.contains(&note.key()) @ DipErrors::AlreadyOnNode,
        constraint = node.notes.len() >= MAX_NOTES_PER_NODE @ DipErrors::NodeNotFull,
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
        constraint = note.parent == node.key() @ DipErrors::NotChildNote,
        constraint = note.stake > weak_note.stake @ DipErrors::NotEnoughStake,
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
        constraint = weak_note.parent == node.key() @ DipErrors::NotChildNote,
    )]
    pub weak_note: Account<'info, Note>,

    /// Common Solana programs
    pub system_program: Program<'info, System>,
}
