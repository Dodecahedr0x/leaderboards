mod errors;
mod instructions;
mod seeds;
mod state;

use anchor_lang::prelude::*;
use instructions::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod treedea {
    use super::*;

    pub fn create_root(ctx: Context<CreateRoot>, id: Pubkey, admin: Pubkey) -> Result<()> {
        instructions::create_root(ctx, id, admin)
    }

    pub fn create_tree(ctx: Context<CreateTree>, tag: String) -> Result<()> {
        instructions::create_tree(ctx, tag)
    }

    pub fn create_node(ctx: Context<CreateNode>, tag: String) -> Result<()> {
        instructions::create_node(ctx, tag)
    }

    pub fn attach_node(ctx: Context<AttachNode>) -> Result<()> {
        instructions::attach_node(ctx)
    }

    pub fn replace_node(ctx: Context<ReplaceNode>) -> Result<()> {
        instructions::replace_node(ctx)
    }

    pub fn create_note(
        ctx: Context<CreateNote>,
        id: Pubkey,
        website: String,
        image: String,
        description: String,
    ) -> Result<()> {
        instructions::create_note(ctx, id, website, image, description)
    }

    pub fn attach_note(ctx: Context<AttachNote>) -> Result<()> {
        instructions::attach_note(ctx)
    }

    pub fn create_stake(ctx: Context<CreateStake>) -> Result<()> {
        instructions::create_stake(ctx)
    }

    pub fn update_stake(ctx: Context<UpdateStake>, stake: i128) -> Result<()> {
        instructions::update_stake(ctx, stake)
    }

    pub fn close_stake(ctx: Context<CloseStake>) -> Result<()> {
        instructions::close_stake(ctx)
    }
}
