use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

use crate::constants::{FOREST_AUTHORITY_SEED, FOREST_SEED};
use crate::state::Forest;

pub fn create_forest(
    ctx: Context<CreateForest>,
    id: Pubkey,
    admin: Pubkey,
    tree_creation_fee: u64,
) -> Result<()> {
    msg!("Creating the global forest");

    let forest = &mut ctx.accounts.forest;

    forest.id = id;
    forest.vote_mint = ctx.accounts.vote_mint.key();
    forest.admin = admin;
    forest.tree_creation_fee = tree_creation_fee;

    Ok(())
}

#[derive(Accounts)]
#[instruction(id: Pubkey)]
pub struct CreateForest<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

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
        init,
        payer = signer,
        space = Forest::LEN,
        seeds = [
            FOREST_SEED.as_bytes(),
            &id.to_bytes(),
        ],
        bump,
    )]
    pub forest: Account<'info, Forest>,

    /// The token used to vote for nodes and tags
    #[account(owner = token::ID)]
    pub vote_mint: Account<'info, Mint>,

    /// The account storing vote tokens
    #[account(
        init_if_needed,
        payer = signer,
        associated_token::mint = vote_mint,
        associated_token::authority = forest_authority,
    )]
    pub vote_account: Account<'info, TokenAccount>,

    /// Common Solana programs
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
