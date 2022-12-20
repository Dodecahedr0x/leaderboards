mod constants;
mod events;
mod instructions;
mod state;

use anchor_lang::prelude::*;
use instructions::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod delegator {
    use super::*;

    pub fn create_delegator(ctx: Context<CreateDelegator>) -> Result<()> {
        instructions::create_delegator(ctx)
    }
}
