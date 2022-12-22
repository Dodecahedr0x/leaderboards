use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{self, transfer, Mint, Token, TokenAccount, Transfer};

use crate::constants::{
    BRIBE_CLAIM_SEED, BRIBE_SEED, ENTRY_SEED, LEADERBOARD_AUTHORITY_SEED, LEADERBOARD_SEED,
    STAKE_SEED,
};
use crate::state::{Bribe, BribeClaim, Entry, Leaderboard, StakeDeposit};

pub fn claim_bribe(ctx: Context<ClaimBribe>) -> Result<()> {
    msg!("Claim a bribe");

    let entry = &mut ctx.accounts.entry;
    let stake_state = &mut ctx.accounts.stake_state;
    let bribe = &mut ctx.accounts.bribe;
    let bribe_claim = &mut ctx.accounts.bribe_claim;

    // Updating accumulated stake
    // TODO: Handle wrapping
    let current_time = Clock::get()?.unix_timestamp;
    let entry_elapsed_time = (current_time - entry.content.last_update) as u64;
    let stake_elapsed_time = (current_time - stake_state.last_update) as u64;
    entry.content.last_update = current_time;
    entry.content.accumulated_stake += entry.content.stake * entry_elapsed_time;
    stake_state.last_update = current_time;
    stake_state.accumulated_stake += stake_state.stake * stake_elapsed_time;

    let mut amount = bribe.amount * stake_state.accumulated_stake / entry.content.accumulated_stake
        * ((entry.content.accumulated_stake - bribe_claim.accumulated_stake)
            / entry.content.accumulated_stake);
    amount = if amount > bribe.amount {
        bribe.amount
    } else {
        amount
    };

    bribe.entry = entry.key();
    bribe.bribe_mint = ctx.accounts.bribe_mint.key();
    bribe.amount -= amount;
    bribe.accumulated_stake = entry.content.accumulated_stake;
    bribe.last_update = Clock::get()?.unix_timestamp;

    bribe_claim.bribe = bribe.key();
    bribe_claim.claimant = ctx.accounts.staker.key();
    bribe_claim.accumulated_stake = entry.content.accumulated_stake;

    let authority_bump = *ctx.bumps.get("leaderboard_authority").unwrap();
    let authority_seeds = &[
        LEADERBOARD_AUTHORITY_SEED.as_bytes(),
        &ctx.accounts.leaderboard.id.to_bytes(),
        &[authority_bump],
    ];
    let signer_seeds = &[&authority_seeds[..]];
    transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.bribe_account.to_account_info(),
                to: ctx.accounts.staker_account.to_account_info(),
                authority: ctx.accounts.leaderboard_authority.to_account_info(),
            },
            signer_seeds,
        ),
        amount,
    )?;

    Ok(())
}

#[derive(Accounts)]
pub struct ClaimBribe<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    /// CHECK: Bribes can be claimed for anyone
    pub staker: UncheckedAccount<'info>,

    /// The account that manages tokens
    /// CHECK: Safe because this read-only account only gets used as a constraint
    #[account(
        seeds = [
            LEADERBOARD_AUTHORITY_SEED.as_bytes(),
            &leaderboard.id.to_bytes()
        ],
        bump,
    )]
    pub leaderboard_authority: UncheckedAccount<'info>,

    #[account(
        seeds = [
            LEADERBOARD_SEED.as_bytes(),
            &leaderboard.id.to_bytes(),
        ],
        bump,
    )]
    pub leaderboard: Box<Account<'info, Leaderboard>>,

    #[account(
        seeds = [
            ENTRY_SEED.as_bytes(),
            &leaderboard.id.to_bytes(),
            &entry.rank.to_le_bytes(),
        ],
        bump,
    )]
    pub entry: Box<Account<'info, Entry>>,

    /// The account storing vote tokens
    #[account(
        mut,
        seeds = [
            STAKE_SEED.as_bytes(),
            &entry.key().to_bytes(),
            &staker.key().to_bytes()
        ],
        bump
    )]
    pub stake_state: Box<Account<'info, StakeDeposit>>,

    /// The bribe
    #[account(
        mut,
        seeds = [
            BRIBE_SEED.as_bytes(),
            &entry.key().to_bytes(),
            &bribe_mint.key().to_bytes()
        ],
        bump,
    )]
    pub bribe: Account<'info, Bribe>,

    /// The bribe claim
    #[account(
        init_if_needed,
        payer = payer,
        space = BribeClaim::LEN,
        seeds = [
            BRIBE_CLAIM_SEED.as_bytes(),
            &entry.key().to_bytes(),
            &bribe_mint.key().to_bytes(),
            &staker.key().to_bytes()
        ],
        bump,
    )]
    pub bribe_claim: Account<'info, BribeClaim>,

    /// The token used to bribe
    #[account(owner = token::ID)]
    pub bribe_mint: Account<'info, Mint>,

    /// The account receiving the bribe
    #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = bribe_mint,
        associated_token::authority = staker,
    )]
    pub staker_account: Account<'info, TokenAccount>,

    /// The account storing the bribe
    #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = bribe_mint,
        associated_token::authority = leaderboard_authority,
    )]
    pub bribe_account: Account<'info, TokenAccount>,

    /// Common Solana programs
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
