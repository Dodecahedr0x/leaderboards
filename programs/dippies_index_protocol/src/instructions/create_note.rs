use anchor_lang::prelude::*;

use crate::errors::TreeDeaErrors;
use crate::seeds::{NODE_SEED, NOTE_SEED, ROOT_SEED, TREE_SEED};
use crate::state::{Node, Note, Root, Tree, MAX_DESCRIPTION_LENGTH, MAX_URI_LENGTH};

pub fn create_note(
    ctx: Context<CreateNote>,
    id: Pubkey,
    website: String,
    image: String,
    description: String,
) -> Result<()> {
    msg!("Creating a note");

    let note = &mut ctx.accounts.note;
    note.id = id;
    note.website = website;
    note.image = image;
    note.description = description;
    note.tags = ctx.accounts.node.tags.clone();
    note.parent = ctx.accounts.node.key();
    note.stake = 0;

    Ok(())
}

#[derive(Accounts)]
#[instruction(id: Pubkey, website: String, image: String, description: String)]
pub struct CreateNote<'info> {
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

    /// The node to attach to
    #[account(
        seeds = [
            NODE_SEED.as_bytes(),
            &tree.key().to_bytes(),
            &node.parent.key().to_bytes(),
            &node.tags.last().unwrap().as_ref(),
        ],
        bump,
        constraint = node.children.len() == 0 @ TreeDeaErrors::InvalidNode
    )]
    pub node: Account<'info, Node>,

    /// The new note
    #[account(
        init,
        payer = signer,
        space = Note::LEN,
        seeds = [
            NOTE_SEED.as_bytes(),
            &tree.key().to_bytes(),
            &id.to_bytes()
        ],
        bump,
        constraint = website.len() <= MAX_URI_LENGTH @ TreeDeaErrors::StringTooLong,
        constraint = image.len() <= MAX_URI_LENGTH @ TreeDeaErrors::StringTooLong,
        constraint = description.len() <= MAX_DESCRIPTION_LENGTH @ TreeDeaErrors::StringTooLong,
    )]
    pub note: Account<'info, Note>,

    /// Common Solana programs
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}