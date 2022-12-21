mod constants;
mod events;
mod instructions;
mod state;

use anchor_lang::prelude::*;
use instructions::*;

declare_id!("9NyqaDMnzDXDXRKW9uBnQSHmUUAQZh4VKj4d8dvECbKJ");

#[program]
pub mod delegator {
    use super::*;

    pub fn create_delegator(ctx: Context<CreateDelegator>) -> Result<()> {
        instructions::create_delegator(ctx)
    }
}
