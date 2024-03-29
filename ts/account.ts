import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import {
  ClaimBribeAccounts,
  CloseStakeDepositAccounts,
  CreateEntryAccounts,
  CreateLeaderboardAccounts,
  CreateStakeDepositAccounts,
  Entry,
  Leaderboard,
  SetBribeAccounts,
  SwapEntriesAccounts,
  UpdateStakeAccounts,
} from "./types";
import { Keypair, PublicKey } from "@solana/web3.js";
import {
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  SystemProgram,
} from "@solana/web3.js";
import {
  getBribeAddress,
  getBribeClaimAddress,
  getEntryAddress,
  getLeaderboardAddress,
  getLeaderboardAuthorityAddress,
  getStakeDepositAddress,
} from "./pda";

export function getCreateLeaderboardAccounts({
  id,
  voteMint,
  payer,
  admin,
  adminMint = Keypair.generate().publicKey,
}: {
  id: PublicKey;
  voteMint: PublicKey;
  payer: PublicKey;
  admin: PublicKey;
  adminMint: PublicKey;
}): CreateLeaderboardAccounts {
  const leaderboard = getLeaderboardAddress(id);
  const authority = getLeaderboardAuthorityAddress(id);
  return {
    payer,
    admin,
    adminMint,
    leaderboardAuthority: authority,
    leaderboard,
    voteMint,
    voteAccount: getAssociatedTokenAddressSync(voteMint, authority, true),
    tokenProgram: TOKEN_PROGRAM_ID,
    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    systemProgram: SystemProgram.programId,
    rent: SYSVAR_RENT_PUBKEY,
  };
}

export function getCreateEntryAccounts({
  id,
  admin,
  adminMint,
  voteMint,
  contentMint,
  payer,
  rank,
}: {
  id: PublicKey;
  admin: PublicKey;
  adminMint: PublicKey;
  voteMint: PublicKey;
  contentMint: PublicKey;
  payer: PublicKey;
  rank: number;
}): CreateEntryAccounts {
  const leaderboard = getLeaderboardAddress(id);
  const authority = getLeaderboardAuthorityAddress(id);
  const entry = getEntryAddress(id, rank);
  return {
    payer,
    leaderboardAuthority: authority,
    leaderboard,
    voteMint: voteMint,
    creatorAccount: getAssociatedTokenAddressSync(voteMint, payer, true),
    admin,
    adminMint,
    adminVoteAccount: getAssociatedTokenAddressSync(voteMint, admin, true),
    adminMintAccount: getAssociatedTokenAddressSync(adminMint, admin, true),
    entry,
    contentMint,
    tokenProgram: TOKEN_PROGRAM_ID,
    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    systemProgram: SystemProgram.programId,
    rent: SYSVAR_RENT_PUBKEY,
  };
}

export function getSwapEntriesAccounts({
  id,
  payer,
  sourceRank,
  destinationRank,
}: {
  id: PublicKey;
  payer: PublicKey;
  sourceRank: number;
  destinationRank: number;
}): SwapEntriesAccounts {
  const leaderboard = getLeaderboardAddress(id);
  const climbingEntry = getEntryAddress(id, sourceRank);
  const fallingEntry = getEntryAddress(id, destinationRank);

  return {
    payer,
    leaderboard,
    climbingEntry,
    fallingEntry,
    systemProgram: SystemProgram.programId,
    rent: SYSVAR_RENT_PUBKEY,
  };
}

export function getCreateStakeDepositAccounts({
  id,
  voteMint,
  rank,
  staker,
  payer,
}: {
  id: PublicKey;
  voteMint: PublicKey;
  rank: number;
  staker: PublicKey;
  payer: PublicKey;
}): CreateStakeDepositAccounts {
  const leaderboardAuthority = getLeaderboardAuthorityAddress(id);
  const leaderboard = getLeaderboardAddress(id);
  const entry = getEntryAddress(id, rank);
  const stakeDeposit = getStakeDepositAddress(entry, staker);
  return {
    payer,
    leaderboardAuthority,
    leaderboard,
    voteMint,
    entry,
    stakeDeposit,
    staker,
    stakerAccount: getAssociatedTokenAddressSync(voteMint, staker, true),
    voteAccount: getAssociatedTokenAddressSync(
      voteMint,
      leaderboardAuthority,
      true
    ),
    tokenProgram: TOKEN_PROGRAM_ID,
    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    systemProgram: SystemProgram.programId,
    rent: SYSVAR_RENT_PUBKEY,
  };
}

export function getUpdateStakeAccounts({
  id,
  voteMint,
  rank,
  staker,
}: {
  id: PublicKey;
  voteMint: PublicKey;
  staker: PublicKey;
  rank: number;
}): UpdateStakeAccounts {
  const leaderboard = getLeaderboardAddress(id);
  const leaderboardAuthority = getLeaderboardAuthorityAddress(id);
  const entry = getEntryAddress(id, rank);
  const stakeDeposit = getStakeDepositAddress(entry, staker);
  return {
    staker,
    leaderboardAuthority,
    leaderboard,
    voteMint,
    entry,
    stakeDeposit,
    stakerAccount: getAssociatedTokenAddressSync(voteMint, staker, true),
    voteAccount: getAssociatedTokenAddressSync(
      voteMint,
      leaderboardAuthority,
      true
    ),
    tokenProgram: TOKEN_PROGRAM_ID,
    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    systemProgram: SystemProgram.programId,
    clock: SYSVAR_CLOCK_PUBKEY,
    rent: SYSVAR_RENT_PUBKEY,
  };
}

export function getCloseStakeAccounts({
  id,
  rank,
  staker,
  payer,
}: {
  id: PublicKey;
  rank: number;
  staker: PublicKey;
  payer?: PublicKey;
}): CloseStakeDepositAccounts {
  const leaderboard = getLeaderboardAddress(id);
  const entry = getEntryAddress(id, rank);
  const stakeDeposit = getStakeDepositAddress(entry, staker);
  return {
    payer: payer || staker,
    staker,
    leaderboard,
    entry,
    stakeDeposit,
    systemProgram: SystemProgram.programId,
    rent: SYSVAR_RENT_PUBKEY,
  };
}

export function getSetBribeAccounts({
  id,
  rank,
  bribeMint,
  briber,
}: {
  id: PublicKey;
  rank: number;
  briber: PublicKey;
  bribeMint: PublicKey;
}): SetBribeAccounts {
  const leaderboard = getLeaderboardAddress(id);
  const leaderboardAuthority = getLeaderboardAuthorityAddress(id);
  const entry = getEntryAddress(id, rank);
  return {
    briber,
    leaderboardAuthority,
    leaderboard,
    entry,
    bribe: getBribeAddress(entry, bribeMint),
    bribeMint,
    briberAccount: getAssociatedTokenAddressSync(bribeMint, briber, true),
    bribeAccount: getAssociatedTokenAddressSync(
      bribeMint,
      leaderboardAuthority,
      true
    ),
    tokenProgram: TOKEN_PROGRAM_ID,
    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    systemProgram: SystemProgram.programId,
    rent: SYSVAR_RENT_PUBKEY,
  };
}

export function getClaimBribeAccounts({
  id,
  rank,
  bribeMint,
  staker,
  payer,
}: {
  id: PublicKey;
  rank: number;
  bribeMint: PublicKey;
  staker: PublicKey;
  payer?: PublicKey;
}): ClaimBribeAccounts {
  const leaderboard = getLeaderboardAddress(id);
  const leaderboardAuthority = getLeaderboardAuthorityAddress(id);
  const entry = getEntryAddress(id, rank);
  const stakeDeposit = getStakeDepositAddress(entry, staker);
  return {
    payer: payer || staker,
    staker,
    leaderboardAuthority,
    leaderboard,
    entry,
    stakeDeposit,
    bribe: getBribeAddress(entry, bribeMint),
    bribeClaim: getBribeClaimAddress(entry, bribeMint, staker),
    bribeMint,
    stakerAccount: getAssociatedTokenAddressSync(bribeMint, staker, true),
    bribeAccount: getAssociatedTokenAddressSync(
      bribeMint,
      leaderboardAuthority,
      true
    ),
    tokenProgram: TOKEN_PROGRAM_ID,
    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    systemProgram: SystemProgram.programId,
    rent: SYSVAR_RENT_PUBKEY,
  };
}
