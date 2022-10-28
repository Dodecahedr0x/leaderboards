use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

use crate::seeds::{ROOT_AUTHORITY_SEED, ROOT_SEED};
use crate::state::Root;

pub fn create_root(ctx: Context<CreateRoot>, id: Pubkey, admin: Pubkey) -> Result<()> {
    msg!("Creating the global root");

    let root = &mut ctx.accounts.root;

    root.id = id;
    root.admin = admin;
    root.vote_mint = ctx.accounts.vote_mint.key();

    Ok(())
}

#[derive(Accounts)]
#[instruction(id: Pubkey)]
pub struct CreateRoot<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    /// The account that manages tokens
    /// CHECK: Safe because this read-only account only gets used as a constraint
    #[account(
        seeds = [
            ROOT_AUTHORITY_SEED.as_bytes(),
            &root.key().to_bytes()
        ],
        bump,
    )]
    pub root_authority: UncheckedAccount<'info>,

    /// The global root
    #[account(
        init,
        payer = signer,
        space = Root::LEN,
        seeds = [
            ROOT_SEED.as_bytes(),
            &id.to_bytes(),
        ],
        bump,
    )]
    pub root: Account<'info, Root>,

    /// The token used to vote for nodes and tags
    #[account(owner = token::ID)]
    pub vote_mint: Account<'info, Mint>,

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
