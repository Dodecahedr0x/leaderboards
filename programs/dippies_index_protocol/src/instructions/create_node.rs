use anchor_lang::prelude::*;

use crate::events::NewNode;
use crate::seeds::{FOREST_SEED, NODE_SEED, TREE_SEED};
use crate::state::{Forest, Node, Tree, MAX_TAG_LENGTH};

pub fn create_node(ctx: Context<CreateNode>, tag: String) -> Result<()> {
    msg!("Creating child node");

    let node = &mut ctx.accounts.node;
    node.tree = ctx.accounts.tree.key();
    node.parent = ctx.accounts.parent_node.key();
    node.tags = ctx.accounts.parent_node.tags.clone();
    node.tags.push(tag);

    emit!(NewNode {
        forest: ctx.accounts.forest.key(),
        tree: ctx.accounts.tree.key(),
        node: ctx.accounts.node.key(),
    });

    Ok(())
}

#[derive(Accounts)]
#[instruction(tag: String)]
pub struct CreateNode<'info> {
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
