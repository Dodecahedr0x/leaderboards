use anchor_lang::prelude::*;

use crate::state::Tag;

pub fn create_node(_ctx: Context<CreateNode>) -> Result<()> {
    Ok(())
}

#[derive(Accounts)]
pub struct CreateNode<'info> {
    #[account(init, payer = user, space = 8 + 8)]
    pub puppet: Account<'info, Tag>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}
