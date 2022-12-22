import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import {
  ClaimBribeAccounts,
  CreateEntryAccounts,
  CreateLeaderboardAccounts,
  CreateStakeDepositAccounts,
  Entry,
  Leaderboard,
  SetBribeAccounts,
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

export function getCreateLeaderboardAccounts(
  id: PublicKey,
  voteMint: PublicKey,
  payer: PublicKey,
  admin: PublicKey,
  adminMint: PublicKey = Keypair.generate().publicKey
): CreateLeaderboardAccounts {
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

export function getCreateEntryAccounts(
  id: PublicKey,
  admin: PublicKey,
  adminMint: PublicKey,
  voteMint: PublicKey,
  contentMint: PublicKey,
  payer: PublicKey,
  rank: number
): CreateEntryAccounts {
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

// export function getCreateNodeAccounts(
//   leaderboard: PublicKey,
//   entry: PublicKey,
//   parentNode: PublicKey,
//   tag: string,
//   signer: PublicKey
// ): CreateNodeAccounts {
//   const node = getNodeAddress(entry, parentNode, tag);
//   return {
//     signer,
//     leaderboard,
//     entry,
//     parentNode,
//     node,
//     systemProgram: SystemProgram.programId,
//     rent: SYSVAR_RENT_PUBKEY,
//   };
// }

// export function getAttachNodeAccounts(
//   leaderboard: PublicKey,
//   entry: PublicKey,
//   parentNode: PublicKey,
//   node: PublicKey,
//   signer: PublicKey
// ): AttachNodeAccounts {
//   return {
//     signer,
//     leaderboard,
//     entry,
//     parentNode,
//     node,
//     systemProgram: SystemProgram.programId,
//     rent: SYSVAR_RENT_PUBKEY,
//   };
// }

// export function getCreateNoteAccounts(
//   leaderboard: PublicKey,
//   entry: PublicKey,
//   node: PublicKey,
//   id: PublicKey,
//   signer: PublicKey
// ): CreateNoteAccounts {
//   const note = getNoteAddress(entry, id);
//   return {
//     signer,
//     leaderboard,
//     entry,
//     node,
//     note,
//     systemProgram: SystemProgram.programId,
//     rent: SYSVAR_RENT_PUBKEY,
//   };
// }

// export function getAttachNoteAccounts(
//   leaderboard: PublicKey,
//   entry: PublicKey,
//   node: PublicKey,
//   note: PublicKey,
//   signer: PublicKey
// ): AttachNoteAccounts {
//   return {
//     signer,
//     leaderboard,
//     entry,
//     node,
//     note,
//     systemProgram: SystemProgram.programId,
//     rent: SYSVAR_RENT_PUBKEY,
//   };
// }

// export function getMoveNoteAccounts(
//   leaderboard: PublicKey,
//   entry: PublicKey,
//   note: PublicKey,
//   sourceNode: PublicKey,
//   destinationNode: PublicKey,
//   signer: PublicKey
// ): MoveNoteAccounts {
//   return {
//     signer,
//     leaderboard,
//     entry,
//     note,
//     sourceNode,
//     destinationNode,
//     systemProgram: SystemProgram.programId,
//   };
// }

// export function getReplaceNoteAccounts(
//   leaderboard: PublicKey,
//   entry: PublicKey,
//   node: PublicKey,
//   note: PublicKey,
//   weakNote: PublicKey,
//   signer: PublicKey
// ): ReplaceNoteAccounts {
//   return {
//     signer,
//     leaderboard,
//     entry,
//     node,
//     note,
//     weakNote,
//     systemProgram: SystemProgram.programId,
//   };
// }

// export function getCreateStakeAccounts(
//   leaderboard: PublicKey,
//   voteMint: PublicKey,
//   entry: PublicKey,
//   node: PublicKey,
//   note: PublicKey,
//   signer: PublicKey
// ): CreateStakeAccounts {
//   const leaderboardAuthority = getLeaderboardAuthorityAddress(leaderboard);
//   const stakeState = getStakeAddress(note, signer);
//   return {
//     signer,
//     leaderboardAuthority,
//     leaderboard,
//     voteMint,
//     entry,
//     node,
//     note,
//     stakeState,
//     stakerAccount: getAssociatedTokenAddressSync(voteMint, signer, true),
//     voteAccount: getAssociatedTokenAddressSync(
//       voteMint,
//       leaderboardAuthority,
//       true
//     ),
//     tokenProgram: TOKEN_PROGRAM_ID,
//     associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
//     systemProgram: SystemProgram.programId,
//     rent: SYSVAR_RENT_PUBKEY,
//   };
// }

// export function getUpdateStakeAccounts(
//   leaderboard: PublicKey,
//   voteMint: PublicKey,
//   entry: PublicKey,
//   node: PublicKey,
//   note: PublicKey,
//   signer: PublicKey
// ): UpdateStakeAccounts {
//   const leaderboardAuthority = getLeaderboardAuthorityAddress(leaderboard);
//   const stakeState = getStakeAddress(note, signer);
//   return {
//     signer,
//     leaderboardAuthority,
//     leaderboard,
//     voteMint,
//     entry,
//     node,
//     note,
//     stakeState,
//     stakerAccount: getAssociatedTokenAddressSync(voteMint, signer, true),
//     voteAccount: getAssociatedTokenAddressSync(
//       voteMint,
//       leaderboardAuthority,
//       true
//     ),
//     tokenProgram: TOKEN_PROGRAM_ID,
//     associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
//     systemProgram: SystemProgram.programId,
//     clock: SYSVAR_CLOCK_PUBKEY,
//     rent: SYSVAR_RENT_PUBKEY,
//   };
// }

// export function getCloseStakeAccounts(
//   leaderboard: PublicKey,
//   entry: PublicKey,
//   note: PublicKey,
//   signer: PublicKey
// ): CloseStakeAccounts {
//   const stakeState = getStakeAddress(note, signer);
//   return {
//     signer,
//     leaderboard,
//     entry,
//     note,
//     stakeState,
//     systemProgram: SystemProgram.programId,
//     rent: SYSVAR_RENT_PUBKEY,
//   };
// }

// export function getSetBribeAccounts(
//   leaderboard: PublicKey,
//   entry: PublicKey,
//   node: PublicKey,
//   note: PublicKey,
//   bribeMint: PublicKey,
//   signer: PublicKey
// ): SetBribeAccounts {
//   const leaderboardAuthority = getLeaderboardAuthorityAddress(leaderboard);
//   const stakeState = getStakeAddress(note, signer);
//   return {
//     signer,
//     leaderboardAuthority,
//     leaderboard,
//     entry,
//     note,
//     stakeState,
//     node,
//     bribe: getBribeAddress(note, bribeMint),
//     bribeMint,
//     briberAccount: getAssociatedTokenAddressSync(bribeMint, signer, true),
//     bribeAccount: getAssociatedTokenAddressSync(
//       bribeMint,
//       leaderboardAuthority,
//       true
//     ),
//     tokenProgram: TOKEN_PROGRAM_ID,
//     associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
//     systemProgram: SystemProgram.programId,
//     rent: SYSVAR_RENT_PUBKEY,
//   };
// }

// export function getClaimBribeAccounts(
//   leaderboard: PublicKey,
//   entry: PublicKey,
//   node: PublicKey,
//   note: PublicKey,
//   bribeMint: PublicKey,
//   signer: PublicKey
// ): ClaimBribeAccounts {
//   const leaderboardAuthority = getLeaderboardAuthorityAddress(leaderboard);
//   const stakeState = getStakeAddress(note, signer);
//   return {
//     signer,
//     leaderboardAuthority,
//     leaderboard,
//     entry,
//     note,
//     stakeState,
//     node,
//     bribe: getBribeAddress(note, bribeMint),
//     bribeClaim: getBribeClaimAddress(note, bribeMint, signer),
//     bribeMint,
//     briberAccount: getAssociatedTokenAddressSync(bribeMint, signer, true),
//     bribeAccount: getAssociatedTokenAddressSync(
//       bribeMint,
//       leaderboardAuthority,
//       true
//     ),
//     tokenProgram: TOKEN_PROGRAM_ID,
//     associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
//     systemProgram: SystemProgram.programId,
//     rent: SYSVAR_RENT_PUBKEY,
//   };
// }
