use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

use crate::constants::{ENTRY_SEED, LEADERBOARD_AUTHORITY_SEED, LEADERBOARD_SEED, STAKE_SEED};
use crate::state::{Entry, Leaderboard, StakeDeposit};

pub fn create_stake_deposit(ctx: Context<CreateStakeDeposit>) -> Result<()> {
    msg!("Create staking account");

    let stake_deposit = &mut ctx.accounts.stake_deposit;
    stake_deposit.staker = ctx.accounts.staker.key();
    stake_deposit.entry = ctx.accounts.entry.key();
    stake_deposit.accumulated_stake = ctx.accounts.entry.accumulated_stake;

    Ok(())
}

#[derive(Accounts)]
pub struct CreateStakeDeposit<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    /// CHECK: Can create deposit for anyone
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

    /// The leaderboard
    #[account(
        seeds = [
            LEADERBOARD_SEED.as_bytes(),
            &leaderboard.id.to_bytes(),
        ],
        bump,
        has_one = vote_mint,
    )]
    pub leaderboard: Account<'info, Leaderboard>,

    /// The token used to vote
    #[account(owner = token::ID)]
    pub vote_mint: Account<'info, Mint>,

    /// The entry staked on
    #[account(
        seeds = [
            ENTRY_SEED.as_bytes(),
            &leaderboard.key().to_bytes(),
            &entry.entry_mint.to_bytes(),
        ],
        bump,
    )]
    pub entry: Account<'info, Entry>,

    /// The account storing vote tokens
    #[account(
        init,
        payer = payer,
        space = StakeDeposit::LEN,
        seeds = [
            STAKE_SEED.as_bytes(),
            &entry.key().to_bytes(),
            &staker.key().to_bytes()
        ],
        bump
    )]
    pub stake_deposit: Box<Account<'info, StakeDeposit>>,

    /// The account storing vote tokens of the staker
    #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = vote_mint,
        associated_token::authority = staker,
    )]
    pub staker_account: Box<Account<'info, TokenAccount>>,

    /// The account storing vote tokens
    #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = vote_mint,
        associated_token::authority = leaderboard_authority,
    )]
    pub vote_account: Box<Account<'info, TokenAccount>>,

    /// Common Solana programs
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
