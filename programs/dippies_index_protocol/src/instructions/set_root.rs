use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::Token;

use crate::seeds::ROOT_SEED;
use crate::state::Root;

pub fn set_root(ctx: Context<SetRoot>, admin: Pubkey, tree_creation_fee: u64) -> Result<()> {
    msg!("Setting the global root");

    let root = &mut ctx.accounts.root;

    root.admin = admin;
    root.tree_creation_fee = tree_creation_fee;

    Ok(())
}

#[derive(Accounts)]
#[instruction(admin: Pubkey)]
pub struct SetRoot<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    /// The global root
    #[account(
        seeds = [
            ROOT_SEED.as_bytes(),
            &root.id.to_bytes(),
        ],
        bump,
        has_one = admin,
    )]
    pub root: Account<'info, Root>,

    /// Common Solana programs
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
