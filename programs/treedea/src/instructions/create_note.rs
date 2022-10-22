use anchor_lang::prelude::*;

use crate::seeds::{NODE_SEED, NOTE_SEED, ROOT_SEED, TREE_SEED};
use crate::state::{Node, Note, Root, Tree, MAX_DESCRIPTION_LENGTH, MAX_URI_LENGTH};

pub fn create_note(
    ctx: Context<CreateNote>,
    website: String,
    image: String,
    description: String,
) -> Result<()> {
    msg!("Creating a note");

    let note = &mut ctx.accounts.note;
    note.website = website;
    note.image = image;
    note.description = description;
    note.parent = ctx.accounts.parent_node.key();

    Ok(())
}

#[derive(Accounts)]
#[instruction(website: String, image: String, description: String)]
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

    /// The parent node to attach to
    #[account(
        seeds = [
            NODE_SEED.as_bytes(),
            &tree.key().to_bytes(),
            &parent_node.parent.key().to_bytes(),
            &parent_node.tags.last().unwrap().as_ref(),
        ],
        bump,
    )]
    pub parent_node: Account<'info, Node>,

    /// The new note
    #[account(
        init,
        payer = signer,
        space = Note::LEN,
        seeds = [
            NOTE_SEED.as_bytes(),
            &tree.key().to_bytes(),
            &website.as_ref(),
            &image.as_ref(),
            &description.as_ref(),
        ],
        bump,
        constraint = website.len() <= MAX_URI_LENGTH,
        constraint = image.len() <= MAX_URI_LENGTH,
        constraint = description.len() <= MAX_DESCRIPTION_LENGTH,
    )]
    pub note: Account<'info, Note>,

    /// Common Solana programs
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
