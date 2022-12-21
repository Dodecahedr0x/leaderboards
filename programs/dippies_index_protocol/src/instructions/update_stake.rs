use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

use crate::constants::{ENTRY_SEED, LEADERBOARD_AUTHORITY_SEED, LEADERBOARD_SEED, STAKE_SEED};
use crate::events::UpdatedStake;
use crate::state::{Entry, Leaderboard, StakeDeposit};

pub fn update_stake(ctx: Context<UpdateStake>, stake: i128) -> Result<()> {
    let entry = &mut ctx.accounts.entry;
    let stake_deposit = &mut ctx.accounts.stake_deposit;

    // Updating accumulated stake
    // TODO: Handle wrapping
    let current_time = Clock::get()?.unix_timestamp;
    let note_elapsed_time = (current_time - entry.last_update) as u64;
    entry.last_update = current_time;
    entry.accumulated_stake += entry.stake * note_elapsed_time;
    let stake_elapsed_time = (current_time - stake_deposit.last_update) as u64;
    stake_deposit.last_update = current_time;
    stake_deposit.accumulated_stake += stake_deposit.stake * stake_elapsed_time;

    if stake >= 0 {
        let stake = stake as u64;
        msg!("Staking {} tokens", stake);

        entry.stake += stake;
        stake_deposit.stake += stake;

        let transfer_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.staker_account.to_account_info(),
                to: ctx.accounts.vote_account.to_account_info(),
                authority: ctx.accounts.staker.to_account_info(),
            },
        );
        token::transfer(transfer_ctx, stake)?;
    } else {
        let stake = -stake as u64;
        msg!("Unstaking {} tokens", stake);

        entry.stake -= stake;
        stake_deposit.stake -= stake;

        let authority_bump = *ctx.bumps.get("leaderboard_authority").unwrap();
        let authority_seeds = &[
            LEADERBOARD_AUTHORITY_SEED.as_bytes(),
            &ctx.accounts.leaderboard.id.to_bytes(),
            &[authority_bump],
        ];
        let signer_seeds = &[&authority_seeds[..]];
        let transfer_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.vote_account.to_account_info(),
                to: ctx.accounts.staker_account.to_account_info(),
                authority: ctx.accounts.leaderboard_authority.to_account_info(),
            },
            signer_seeds,
        );
        token::transfer(transfer_ctx, stake)?;
    }

    emit!(UpdatedStake {
        leaderboard: ctx.accounts.leaderboard.key(),
        entry: entry.key(),
        stake: stake_deposit.key(),
        amount: entry.stake
    });

    Ok(())
}

#[derive(Accounts)]
pub struct UpdateStake<'info> {
    #[account(mut)]
    pub staker: Signer<'info>,

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
    pub leaderboard: Box<Account<'info, Leaderboard>>,

    /// The token used to vote for nodes and tags
    #[account(owner = token::ID)]
    pub vote_mint: Account<'info, Mint>,

    /// The entry
    #[account(
        mut,
        seeds = [
            ENTRY_SEED.as_bytes(),
            &leaderboard.key().to_bytes(),
            &entry.rank.to_le_bytes(),
        ],
        bump,
    )]
    pub entry: Box<Account<'info, Entry>>,

    /// The state of the staker's deposit
    #[account(
        mut,
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
        payer = staker,
        associated_token::mint = vote_mint,
        associated_token::authority = staker,
    )]
    pub staker_account: Box<Account<'info, TokenAccount>>,

    /// The account storing vote tokens of the leaderboard
    #[account(
        init_if_needed,
        payer = staker,
        associated_token::mint = vote_mint,
        associated_token::authority = leaderboard_authority,
    )]
    pub vote_account: Box<Account<'info, TokenAccount>>,

    /// Common Solana programs
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub clock: Sysvar<'info, Clock>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
