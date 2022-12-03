use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

use crate::constants::{
    FOREST_AUTHORITY_SEED, FOREST_SEED, NODE_SEED, NOTE_SEED, STAKE_SEED, TREE_SEED,
};
use crate::state::{Forest, Node, Note, StakeState, Tree};

pub fn create_stake(ctx: Context<CreateStake>) -> Result<()> {
    msg!("Create staking account");

    let stake_account = &mut ctx.accounts.stake_state;
    stake_account.staker = ctx.accounts.signer.key();
    stake_account.note = ctx.accounts.note.key();
    stake_account.accumulated_stake = ctx.accounts.note.accumulated_stake;

    Ok(())
}

#[derive(Accounts)]
pub struct CreateStake<'info> {
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
        seeds = [
            FOREST_SEED.as_bytes(),
            &forest.id.to_bytes(),
        ],
        bump,
        has_one = vote_mint,
    )]
    pub forest: Account<'info, Forest>,

    /// The token used to vote for nodes and tags
    #[account(owner = token::ID)]
    pub vote_mint: Account<'info, Mint>,

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

    /// The node the note is attached to
    #[account(
        seeds = [
            NODE_SEED.as_bytes(),
            &tree.key().to_bytes(),
            &node.parent.key().to_bytes(),
            &node.tags.last().unwrap().as_ref(),
        ],
        bump,
    )]
    pub node: Account<'info, Node>,

    /// The attached note
    #[account(
        mut,
        seeds = [
            NOTE_SEED.as_bytes(),
            &tree.key().to_bytes(),
            &note.id.to_bytes(),
        ],
        bump,
    )]
    pub note: Account<'info, Note>,

    /// The account storing vote tokens
    #[account(
        init,
        payer = signer,
        space = StakeState::LEN,
        seeds = [
            STAKE_SEED.as_bytes(),
            &note.key().to_bytes(),
            &signer.key().to_bytes()
        ],
        bump
    )]
    pub stake_state: Box<Account<'info, StakeState>>,

    /// The account storing vote tokens
    #[account(
        init_if_needed,
        payer = signer,
        associated_token::mint = vote_mint,
        associated_token::authority = signer,
    )]
    pub staker_account: Box<Account<'info, TokenAccount>>,

    /// The account storing vote tokens
    #[account(
        init_if_needed,
        payer = signer,
        associated_token::mint = vote_mint,
        associated_token::authority = forest_authority,
    )]
    pub vote_account: Box<Account<'info, TokenAccount>>,

    /// Common Solana programs
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
