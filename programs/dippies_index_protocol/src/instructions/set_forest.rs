use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::Token;

use crate::constants::FOREST_SEED;
use crate::state::Forest;

pub fn set_forest(ctx: Context<SetForest>, admin: Pubkey, tree_creation_fee: u64) -> Result<()> {
    msg!("Setting the forest");

    let forest = &mut ctx.accounts.forest;

    forest.admin = admin;
    forest.tree_creation_fee = tree_creation_fee;

    Ok(())
}

#[derive(Accounts)]
#[instruction(admin: Pubkey)]
pub struct SetForest<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    /// The forest
    #[account(
        seeds = [
            FOREST_SEED.as_bytes(),
            &forest.id.to_bytes(),
        ],
        bump,
        has_one = admin,
    )]
    pub forest: Account<'info, Forest>,

    /// Common Solana programs
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
