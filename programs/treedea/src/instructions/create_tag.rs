use anchor_lang::prelude::*;

use crate::state::Tag;

pub fn create_tag(_ctx: Context<CreateTag>) -> Result<()> {
    Ok(())
}

#[derive(Accounts)]
pub struct CreateTag<'info> {
    #[account(init, payer = user, space = 8 + 8)]
    pub puppet: Account<'info, Tag>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}
