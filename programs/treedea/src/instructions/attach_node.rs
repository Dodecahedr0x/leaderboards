use anchor_lang::prelude::*;

use crate::seeds::{NODE_SEED, ROOT_SEED, TREE_SEED};
use crate::state::{Node, Root, Tree, MAX_CHILD_PER_NODE};

pub fn attach_node(ctx: Context<AttachNode>, tag: String) -> Result<()> {
    msg!("Attaching child node");

    let parent_node = &mut ctx.accounts.parent_node;
    let node = &mut ctx.accounts.node;
    node.parent = parent_node.key();

    if parent_node.children.len() >= MAX_CHILD_PER_NODE {}

    Ok(())
}

#[derive(Accounts)]
#[instruction(tag: String)]
pub struct AttachNode<'info> {
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
    )]
    pub parent_node: Account<'info, Node>,

    /// The new node
    #[account(
        mut,
        seeds = [
            NODE_SEED.as_bytes(),
            &tree.key().to_bytes(),
            &parent_node.key().to_bytes(),
            &node.tags.last().unwrap().as_ref(),
        ],
        bump,
        constraint = node.stake > weaker_node.stake || parent_node.children.len() < MAX_CHILD_PER_NODE,
    )]
    pub node: Account<'info, Node>,

    /// The node being replaced
    #[account(
        seeds = [
            NODE_SEED.as_bytes(),
            &tree.key().to_bytes(),
            &parent_node.key().to_bytes(),
            &weaker_node.tags.last().unwrap().as_ref(),
        ],
        bump,
    )]
    pub weaker_node: Account<'info, Node>,

    /// Common Solana programs
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
