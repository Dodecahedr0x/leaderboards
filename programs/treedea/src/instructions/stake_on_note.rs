use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

use crate::seeds::{NODE_SEED, NOTE_SEED, ROOT_AUTHORITY_SEED, ROOT_SEED, STAKE_SEED, TREE_SEED};
use crate::state::{Node, Note, Root, StakeAccount, Tree};

pub fn stake_on_note(ctx: Context<StakeOnNote>, stake: u64) -> Result<()> {
    msg!("Creating the global root");

    let node = &mut ctx.accounts.node;
    node.stake += stake;
    let note = &mut ctx.accounts.note;
    note.stake += stake;

    let transfer_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.staker_account.to_account_info(),
            to: ctx.accounts.vote_account.to_account_info(),
            authority: ctx.accounts.signer.to_account_info(),
        },
    );
    token::transfer(transfer_ctx, stake)?;

    Ok(())
}

#[derive(Accounts)]
pub struct StakeOnNote<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    /// The account that manages tokens
    /// CHECK: Safe because this read-only account only gets used as a constraint
    #[account(
        seeds = [
            ROOT_AUTHORITY_SEED.as_bytes(),
            &root.id.to_bytes()
        ],
        bump,
    )]
    pub root_authority: UncheckedAccount<'info>,

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
        init_if_needed,
        payer = signer,
        space = StakeAccount::LEN,
        seeds = [
            STAKE_SEED.as_bytes(),
            &note.key().to_bytes(),
            &signer.key().to_bytes()
        ],
        bump
    )]
    pub stake_account: Account<'info, StakeAccount>,

    /// The token used to vote for nodes and tags
    #[account(owner = token::ID)]
    pub vote_mint: Account<'info, Mint>,

    /// The account storing vote tokens
    #[account(
        init_if_needed,
        payer = signer,
        associated_token::mint = vote_mint,
        associated_token::authority = signer,
    )]
    pub staker_account: Account<'info, TokenAccount>,

    /// The account storing vote tokens
    #[account(
        init_if_needed,
        payer = signer,
        associated_token::mint = vote_mint,
        associated_token::authority = root_authority,
    )]
    pub vote_account: Account<'info, TokenAccount>,

    /// Common Solana programs
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
