use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{transfer, Mint, Token, TokenAccount, Transfer};

use crate::constants::{FOREST_AUTHORITY_SEED, FOREST_SEED, MAX_TAG_LENGTH, NODE_SEED, TREE_SEED};
use crate::errors::DipErrors;
use crate::events;
use crate::state::{Forest, Node, Tree};

pub fn create_tree(ctx: Context<CreateTree>, title: String) -> Result<()> {
    msg!("Creating the tree");

    transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.creator_account.to_account_info(),
                to: ctx.accounts.admin_account.to_account_info(),
                authority: ctx.accounts.signer.to_account_info(),
            },
        ),
        ctx.accounts.forest.tree_creation_fee,
    )?;

    let tree = &mut ctx.accounts.tree;
    tree.forest = ctx.accounts.forest.key();
    tree.root_node = ctx.accounts.root_node.key();
    tree.title = title.clone();

    let root_node = &mut ctx.accounts.root_node;
    root_node.tree = tree.key();
    root_node.parent = Pubkey::default();
    root_node.tags.push(title.clone());

    emit!(events::NewTree {
        forest: ctx.accounts.forest.key(),
        tree: ctx.accounts.tree.key(),
        title: title,
    });

    Ok(())
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct CreateTree<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    /// CHECK: Check against forest
    pub admin: AccountInfo<'info>,

    /// The account that manages tokens
    /// CHECK: Safe because this read-only account only gets used as a constraint
    #[account(
        seeds = [
            FOREST_AUTHORITY_SEED.as_bytes(),
            &forest.key().to_bytes()
        ],
        bump,
    )]
    pub forest_authority: UncheckedAccount<'info>,

    /// The forest
    #[account(
        seeds = [
            FOREST_SEED.as_bytes(),
            &forest.id.to_bytes(),
        ],
        bump,
        has_one = admin,
        has_one = vote_mint,
    )]
    pub forest: Account<'info, Forest>,

    /// Mint of the token used to pay the tree creation fee
    pub vote_mint: Account<'info, Mint>,

    #[account(
        init_if_needed,
        payer = signer,
        associated_token::mint = vote_mint,
        associated_token::authority = signer,
    )]
    pub creator_account: Box<Account<'info, TokenAccount>>,

    #[account(
        init_if_needed,
        payer = signer,
        associated_token::mint = vote_mint,
        associated_token::authority = admin,
    )]
    pub admin_account: Box<Account<'info, TokenAccount>>,

    /// The tree
    #[account(
        init,
        payer = signer,
        space = Tree::LEN,
        seeds = [
            TREE_SEED.as_bytes(),
            &forest.key().to_bytes(),
            &title.as_ref(),
        ],
        bump,
        constraint = title.len() <= MAX_TAG_LENGTH @ DipErrors::StringTooLong,
    )]
    pub tree: Box<Account<'info, Tree>>,

    /// The root node of the new tree
    #[account(
        init,
        payer = signer,
        space = Node::LEN,
        seeds = [
            NODE_SEED.as_bytes(),
            &tree.key().to_bytes(),
            Pubkey::default().to_bytes().as_ref(),
            &title.as_ref(),
        ],
        bump,
    )]
    pub root_node: Account<'info, Node>,

    /// Common Solana programs
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
