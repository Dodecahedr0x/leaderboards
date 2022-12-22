import {
  BRIBE_CLAIM_SEED,
  BRIBE_SEED,
  ENTRY_SEED,
  LEADERBOARD_AUTHORITY_SEED,
  LEADERBOARD_SEED,
  STAKE_SEED,
} from "./constants";

import BN from "bn.js";
import { DIP_PROGRAM_ID } from "./";
import { PublicKey } from "@solana/web3.js";

export function getLeaderboardAddress(id: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(LEADERBOARD_SEED), id.toBuffer()],
    DIP_PROGRAM_ID
  )[0];
}

export function getLeaderboardAuthorityAddress(id: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(LEADERBOARD_AUTHORITY_SEED), id.toBuffer()],
    DIP_PROGRAM_ID
  )[0];
}

export function getEntryAddress(id: PublicKey, rank: number) {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(ENTRY_SEED),
      id.toBuffer(),
      new BN(rank).toArrayLike(Buffer, "le", 4),
    ],
    DIP_PROGRAM_ID
  )[0];
}

export function getStakeDepositAddress(entry: PublicKey, staker: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(STAKE_SEED), entry.toBuffer(), staker.toBuffer()],
    DIP_PROGRAM_ID
  )[0];
}

export function getBribeAddress(entry: PublicKey, bribeMint: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(BRIBE_SEED), entry.toBuffer(), bribeMint.toBuffer()],
    DIP_PROGRAM_ID
  )[0];
}

export function getBribeClaimAddress(
  entry: PublicKey,
  bribeMint: PublicKey,
  staker: PublicKey
) {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(BRIBE_CLAIM_SEED),
      entry.toBuffer(),
      bribeMint.toBuffer(),
      staker.toBuffer(),
    ],
    DIP_PROGRAM_ID
  )[0];
}
