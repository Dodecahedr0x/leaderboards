use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

use crate::seeds::{
    FOREST_AUTHORITY_SEED, FOREST_SEED, NODE_SEED, NOTE_SEED, STAKE_SEED, TREE_SEED,
};
use crate::state::{Forest, Node, Note, StakeState, Tree};

pub fn update_stake(ctx: Context<UpdateStake>, stake: i128) -> Result<()> {
    let tree = &mut ctx.accounts.tree;
    let node = &mut ctx.accounts.node;
    let note = &mut ctx.accounts.note;
    let stake_state = &mut ctx.accounts.stake_state;

    // Updating accumulated stake
    // TODO: Handle wrapping
    let current_time = Clock::get()?.unix_timestamp;
    let note_elapsed_time = (current_time - note.last_update) as u64;
    note.last_update = current_time;
    note.accumulated_stake += note.stake * note_elapsed_time;
    let stake_elapsed_time = (current_time - stake_state.last_update) as u64;
    stake_state.last_update = current_time;
    stake_state.accumulated_stake += stake_state.stake * stake_elapsed_time;

    if stake >= 0 {
        let stake = stake as u64;
        msg!("Staking {} tokens", stake);

        tree.stake += stake;
        node.stake += stake;
        note.stake += stake;
        stake_state.stake += stake;

        let transfer_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.staker_account.to_account_info(),
                to: ctx.accounts.vote_account.to_account_info(),
                authority: ctx.accounts.signer.to_account_info(),
            },
        );
        token::transfer(transfer_ctx, stake)?;
    } else {
        let stake = -stake as u64;
        msg!("Unstaking {} tokens", stake);

        tree.stake -= stake;
        node.stake -= stake;
        note.stake -= stake;
        stake_state.stake -= stake;

        let authority_bump = *ctx.bumps.get("forest_authority").unwrap();
        let authority_seeds = &[
            FOREST_AUTHORITY_SEED.as_bytes(),
            &ctx.accounts.forest.key().to_bytes(),
            &[authority_bump],
        ];
        let signer_seeds = &[&authority_seeds[..]];
        let transfer_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.vote_account.to_account_info(),
                to: ctx.accounts.staker_account.to_account_info(),
                authority: ctx.accounts.forest_authority.to_account_info(),
            },
            signer_seeds,
        );
        token::transfer(transfer_ctx, stake)?;
    }

    Ok(())
}

#[derive(Accounts)]
pub struct UpdateStake<'info> {
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

    /// The forest
    #[account(
        seeds = [
            FOREST_SEED.as_bytes(),
            &forest.id.to_bytes(),
        ],
        bump,
        has_one = vote_mint,
    )]
    pub forest: Account<'info, Forest>,

    /// The token used to vote for nodes and tags
    #[account(owner = token::ID)]
    pub vote_mint: Account<'info, Mint>,

    /// The tree
    #[account(
        mut,
        seeds = [
            TREE_SEED.as_bytes(),
            &forest.key().to_bytes(),
            &tree.title.as_ref(),
        ],
        bump,
    )]
    pub tree: Account<'info, Tree>,

    /// The node the note is attached to
    #[account(
        mut,
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
        mut,
        seeds = [
            STAKE_SEED.as_bytes(),
            &note.key().to_bytes(),
            &signer.key().to_bytes()
        ],
        bump
    )]
    pub stake_state: Box<Account<'info, StakeState>>,

    /// The account storing vote tokens
    #[account(
        init_if_needed,
        payer = signer,
        associated_token::mint = vote_mint,
        associated_token::authority = signer,
    )]
    pub staker_account: Box<Account<'info, TokenAccount>>,

    /// The account storing vote tokens
    #[account(
        init_if_needed,
        payer = signer,
        associated_token::mint = vote_mint,
        associated_token::authority = forest_authority,
    )]
    pub vote_account: Box<Account<'info, TokenAccount>>,

    /// Common Solana programs
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub clock: Sysvar<'info, Clock>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
