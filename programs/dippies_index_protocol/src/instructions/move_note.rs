use anchor_lang::prelude::*;

use crate::errors::DipErrors;
use crate::seeds::{FOREST_SEED, NODE_SEED, NOTE_SEED, TREE_SEED};
use crate::state::{Forest, Node, Note, Tree};

pub fn move_note(ctx: Context<MoveNote>) -> Result<()> {
    msg!("Moving a note");

    let source_node = &mut ctx.accounts.source_node;
    let note = &mut ctx.accounts.note;
    note.parent = ctx.accounts.destination_node.key();

    let note_position = source_node.notes.iter().position(|&n| n == note.key());
    if note_position.is_some() {
        // Remove the note from the source
        source_node.notes.remove(note_position.unwrap());
        source_node.stake -= note.stake;
    }

    Ok(())
}

#[derive(Accounts)]
pub struct MoveNote<'info> {
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

    /// The node the note is currently attached to
    #[account(
        mut,
        seeds = [
            NODE_SEED.as_bytes(),
            &tree.key().to_bytes(),
            &source_node.parent.key().to_bytes(),
            &source_node.tags.last().unwrap().as_ref(),
        ],
        bump,
    )]
    pub source_node: Account<'info, Node>,

    /// The node the note will be attached to
    #[account(
        seeds = [
            NODE_SEED.as_bytes(),
            &tree.key().to_bytes(),
            &destination_node.parent.key().to_bytes(),
            &destination_node.tags.last().unwrap().as_ref(),
        ],
        bump,
        constraint = destination_node.tags.iter().all(|x| note.tags.contains(x)) @ DipErrors::TagsMismatch,
    )]
    pub destination_node: Account<'info, Node>,

    /// The new note
    #[account(
        mut,
        seeds = [
            NOTE_SEED.as_bytes(),
            &tree.key().to_bytes(),
            &note.id.to_bytes()
        ],
        bump,
        constraint = note.parent == source_node.key() @ DipErrors::InvalidNode,
    )]
    pub note: Account<'info, Note>,

    /// Common Solana programs
    pub system_program: Program<'info, System>,
}
