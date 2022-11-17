use anchor_lang::prelude::*;

use crate::errors::DipErrors;
use crate::seeds::{FOREST_SEED, NODE_SEED, TREE_SEED};
use crate::state::{Forest, Node, Tree, MAX_TAG_LENGTH};

pub fn create_tree(ctx: Context<CreateTree>, tag: String) -> Result<()> {
    msg!("Creating the tree");

    let tree = &mut ctx.accounts.tree;
    tree.forest = ctx.accounts.forest.key();
    tree.root_node = ctx.accounts.root_node.key();
    tree.title = tag.clone();

    let root_node = &mut ctx.accounts.root_node;
    root_node.tree = ctx.accounts.tree.key();
    root_node.parent = Pubkey::default();
    root_node.tags.push(tag);

    Ok(())
}

#[derive(Accounts)]
#[instruction(tag: String)]
pub struct CreateTree<'info> {
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
        init,
        payer = signer,
        space = Tree::LEN,
        seeds = [
            TREE_SEED.as_bytes(),
            &forest.key().to_bytes(),
            &tag.as_ref(),
        ],
        bump,
        constraint = tag.len() <= MAX_TAG_LENGTH @ DipErrors::StringTooLong,
    )]
    pub tree: Account<'info, Tree>,

    /// The root node of the new tree
    #[account(
        init,
        payer = signer,
        space = Node::LEN,
        seeds = [
            NODE_SEED.as_bytes(),
            &tree.key().to_bytes(),
            Pubkey::default().to_bytes().as_ref(),
            &tag.as_ref(),
        ],
        bump,
    )]
    pub root_node: Account<'info, Node>,

    /// Common Solana programs
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
