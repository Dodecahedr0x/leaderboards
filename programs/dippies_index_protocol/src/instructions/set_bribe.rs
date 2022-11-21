use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{self, transfer, Mint, Token, TokenAccount, Transfer};

use crate::events::UpdatedBribe;
use crate::seeds::{
    BRIBE_SEED, FOREST_AUTHORITY_SEED, FOREST_SEED, NODE_SEED, NOTE_SEED, STAKE_SEED, TREE_SEED,
};
use crate::state::{Bribe, Forest, Node, Note, StakeState, Tree};

pub fn set_bribe(ctx: Context<SetBribe>, amount: u64) -> Result<()> {
    msg!("Setting a bribe");

    // Updating accumulated stake
    // TODO: Handle wrapping
    let note = &mut ctx.accounts.note;
    let current_time = Clock::get()?.unix_timestamp;
    let note_elapsed_time = (current_time - note.last_update) as u64;
    note.last_update = current_time;
    note.accumulated_stake += note.stake * note_elapsed_time;

    let bribe = &mut ctx.accounts.bribe;
    bribe.note = note.key();
    bribe.bribe_mint = ctx.accounts.bribe_mint.key();
    bribe.amount += amount;
    bribe.accumulated_stake = note.accumulated_stake;
    bribe.last_update = Clock::get()?.unix_timestamp;

    transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.briber_account.to_account_info(),
                to: ctx.accounts.bribe_account.to_account_info(),
                authority: ctx.accounts.signer.to_account_info(),
            },
        ),
        amount,
    )?;

    emit!(UpdatedBribe {
        forest: ctx.accounts.forest.key(),
        tree: ctx.accounts.tree.key(),
        node: ctx.accounts.node.key(),
        note: ctx.accounts.note.key(),
    });

    Ok(())
}

#[derive(Accounts)]
pub struct SetBribe<'info> {
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

    /// The global forest
    #[account(
        seeds = [
            FOREST_SEED.as_bytes(),
            &forest.id.to_bytes(),
        ],
        bump,
    )]
    pub forest: Box<Account<'info, Forest>>,

    /// The tree
    #[account(
        seeds = [
            TREE_SEED.as_bytes(),
            &forest.key().to_bytes(),
            &tree.title.as_ref(),
        ],
        bump,
    )]
    pub tree: Box<Account<'info, Tree>>,

    /// The node to attach to
    #[account(
        seeds = [
            NODE_SEED.as_bytes(),
            &tree.key().to_bytes(),
            &node.parent.key().to_bytes(),
            &node.tags.last().unwrap().as_ref(),
        ],
        bump,
    )]
    pub node: Box<Account<'info, Node>>,

    /// The bribed note
    #[account(
        mut,
        seeds = [
            NOTE_SEED.as_bytes(),
            &tree.key().to_bytes(),
            &note.id.to_bytes()
        ],
        bump,
    )]
    pub note: Box<Account<'info, Note>>,

    /// The account storing vote tokens
    #[account(
        mut,
        seeds = [
            STAKE_SEED.as_bytes(),
            &note.key().to_bytes(),
            &signer.key().to_bytes()
        ],
        bump
    )]
    pub stake_state: Box<Account<'info, StakeState>>,

    /// The bribe
    #[account(
        init_if_needed,
        payer = signer,
        space = Bribe::LEN,
        seeds = [
            BRIBE_SEED.as_bytes(),
            &note.key().to_bytes(),
            &bribe_mint.key().to_bytes()
        ],
        bump,
    )]
    pub bribe: Account<'info, Bribe>,

    /// The token used to bribe
    #[account(owner = token::ID)]
    pub bribe_mint: Account<'info, Mint>,

    /// The account paying the bribe
    #[account(
        init_if_needed,
        payer = signer,
        associated_token::mint = bribe_mint,
        associated_token::authority = signer,
    )]
    pub briber_account: Account<'info, TokenAccount>,

    /// The account storing the bribe
    #[account(
        init_if_needed,
        payer = signer,
        associated_token::mint = bribe_mint,
        associated_token::authority = forest_authority,
    )]
    pub bribe_account: Account<'info, TokenAccount>,

    /// Common Solana programs
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
