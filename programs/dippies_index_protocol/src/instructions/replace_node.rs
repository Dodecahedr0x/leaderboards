use anchor_lang::prelude::*;

use crate::constants::{FOREST_SEED, MAX_CHILD_PER_NODE, NODE_SEED, TREE_SEED};
use crate::errors::DipErrors;
use crate::state::{Forest, Node, Tree};

pub fn replace_node(ctx: Context<ReplaceNode>) -> Result<()> {
    msg!("Replacing a node");

    let parent_node = &mut ctx.accounts.parent_node;
    let position = parent_node
        .children
        .iter()
        .position(|&n| n == ctx.accounts.weaker_node.key())
        .unwrap();
    parent_node.children.remove(position);
    parent_node.children.push(ctx.accounts.node.key());

    Ok(())
}

#[derive(Accounts)]
pub struct ReplaceNode<'info> {
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
            &parent_node.parent.key().to_bytes(),
            &parent_node.tags.last().unwrap().as_ref(),
        ],
        bump,
        constraint = parent_node.children.len() == MAX_CHILD_PER_NODE @ DipErrors::NodeNotFull,
        constraint = parent_node.children.iter().find(|&n| n == &node.key()).is_none() @ DipErrors::AlreadyAChild,
        constraint = parent_node.children.iter().find(|&n| n == &weaker_node.key()).is_some() @ DipErrors::NotAChild,
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
        constraint = node.stake > weaker_node.stake @ DipErrors::NotEnoughStake,
    )]
    pub node: Account<'info, Node>,

    /// The weaker node being replaced
    #[account(
        mut,
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
