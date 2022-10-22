use anchor_lang::prelude::*;

use crate::seeds::{NODE_SEED, ROOT_SEED, TREE_SEED};
use crate::state::{Node, Root, Tree, MAX_CHILD_PER_NODE};

pub fn attach_node(ctx: Context<AttachNode>) -> Result<()> {
    msg!("Attaching child node");

    let parent_node = &mut ctx.accounts.parent_node;
    parent_node.children.push(ctx.accounts.node.key());

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
        constraint = parent_node.children.len() < MAX_CHILD_PER_NODE,
    )]
    pub parent_node: Account<'info, Node>,

    /// The attached node
    #[account(
        mut,
        seeds = [
            NODE_SEED.as_bytes(),
            &tree.key().to_bytes(),
            &parent_node.key().to_bytes(),
            &node.tags.last().unwrap().as_ref(),
        ],
        bump,
    )]
    pub node: Account<'info, Node>,

    /// Common Solana programs
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
