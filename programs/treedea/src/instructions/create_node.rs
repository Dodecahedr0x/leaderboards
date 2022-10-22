use anchor_lang::prelude::*;

use crate::seeds::{NODE_SEED, ROOT_SEED, TREE_SEED};
use crate::state::{Node, Root, Tree, MAX_TAG_LENGTH};

pub fn create_node(ctx: Context<CreateNode>, tag: String) -> Result<()> {
    msg!("Creating child node");

    let node = &mut ctx.accounts.node;
    node.tree = ctx.accounts.tree.key();
    node.parent = node.key();
    node.tags = ctx.accounts.parent_node.tags.clone();
    node.tags.push(tag);

    Ok(())
}

#[derive(Accounts)]
#[instruction(tag: String)]
pub struct CreateNode<'info> {
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

    /// The new node
    #[account(
        init,
        payer = signer,
        space = Node::LEN,
        seeds = [
            NODE_SEED.as_bytes(),
            &tree.key().to_bytes(),
            &parent_node.key().to_bytes(),
            &tag.as_ref(),
        ],
        bump,
        constraint = tag.len() <= MAX_TAG_LENGTH,
    )]
    pub node: Account<'info, Node>,

    /// Common Solana programs
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
