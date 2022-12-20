use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{Token, TokenAccount};

use crate::constants::{DELEGATOR_AUTHORITY_SEED, DELEGATOR_SEED};
use crate::events;
use crate::state::Delegator;

pub fn create_delegator(ctx: Context<CreateDelegator>) -> Result<()> {
    msg!("Creating the delegator");

    let delegator = &mut ctx.accounts.delegator;
    delegator.forest = ctx.accounts.forest.key();
    delegator.operator = ctx.accounts.operator.key();

    emit!(events::NewDelegator {
        forest: ctx.accounts.forest.key(),
        operator: ctx.accounts.operator.key(),
    });

    Ok(())
}

#[derive(Accounts)]
pub struct CreateDelegator<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    /// The account operating this delegator
    /// CHECK: Any account can operate a delegator
    pub operator: UncheckedAccount<'info>,

    /// The forest
    /// CHECK: Verifications will be done by DIP
    pub forest: UncheckedAccount<'info>,

    /// Mint of the token used to pay the tree creation fee
    /// CHECK: Verifications will be done by DIP
    pub vote_mint: UncheckedAccount<'info>,

    /// The state of the created delegator
    #[account(
      init,
      payer = payer,
      space = Delegator::LEN,
      seeds = [
        DELEGATOR_SEED.as_bytes(),
        &forest.key().to_bytes(),
        &operator.key().to_bytes(),
      ],
      bump,
    )]
    pub delegator: Account<'info, Delegator>,

    /// The account that manages tokens
    /// CHECK: Safe because this read-only account only gets used as a constraint
    #[account(
      seeds = [
          DELEGATOR_AUTHORITY_SEED.as_bytes(),
          &delegator.key().to_bytes()
      ],
      bump,
  )]
    pub delegator_authority: UncheckedAccount<'info>,

    #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = vote_mint,
        associated_token::authority = delegator_authority,
    )]
    pub delegation_account: Box<Account<'info, TokenAccount>>,

    /// Common Solana programs
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
