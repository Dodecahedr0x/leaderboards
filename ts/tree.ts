import * as anchor from "@project-serum/anchor";

import {
  ASSOCIATED_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@project-serum/anchor/dist/cjs/utils/token";
import {
  NODE_SEED,
  NOTE_SEED,
  ROOT_AUTHORITY_SEED,
  ROOT_SEED,
  STAKE_SEED,
  TREE_SEED,
  VOTE_MINT_SEED,
} from "./constants";

import { Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { Treedea } from "../target/types/treedea";
import { getAssociatedTokenKey } from "./utils";

export const createRootAccounts = (
  program: Program<Treedea>,
  id: PublicKey,
  voteMint: PublicKey
) => {
  const [key] = PublicKey.findProgramAddressSync(
    [Buffer.from(ROOT_SEED), id.toBuffer()],
    program.programId
  );
  const [rootAuthority] = PublicKey.findProgramAddressSync(
    [Buffer.from(ROOT_AUTHORITY_SEED), key.toBuffer()],
    program.programId
  );
  const voteAccount = getAssociatedTokenKey(rootAuthority, voteMint);

  return {
    rootAuthority,
    root: key,
    voteMint,
    voteAccount,
    tokenProgram: TOKEN_PROGRAM_ID,
    associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
    systemProgram: anchor.web3.SystemProgram.programId,
    rent: anchor.web3.SYSVAR_RENT_PUBKEY,
  };
};

export const createTreeAccounts = (
  program: Program<Treedea>,
  root: PublicKey,
  tag: string
) => {
  const [tree] = PublicKey.findProgramAddressSync(
    [Buffer.from(TREE_SEED), root.toBuffer(), Buffer.from(tag)],
    program.programId
  );
  const [rootNode] = PublicKey.findProgramAddressSync(
    [
      Buffer.from(NODE_SEED),
      tree.toBuffer(),
      PublicKey.default.toBuffer(),
      Buffer.from(tag),
    ],
    program.programId
  );

  return {
    root,
    tree,
    rootNode,
    systemProgram: anchor.web3.SystemProgram.programId,
    rent: anchor.web3.SYSVAR_RENT_PUBKEY,
  };
};

export const createNodeAccounts = (
  program: Program<Treedea>,
  root: PublicKey,
  tree: PublicKey,
  parentNode: PublicKey,
  tag: String
) => {
  const [node] = PublicKey.findProgramAddressSync(
    [
      Buffer.from(NODE_SEED),
      tree.toBuffer(),
      parentNode.toBuffer(),
      Buffer.from(tag),
    ],
    program.programId
  );

  return {
    root,
    tree,
    parentNode,
    node,
    systemProgram: anchor.web3.SystemProgram.programId,
    rent: anchor.web3.SYSVAR_RENT_PUBKEY,
  };
};

export const attachNodeAccounts = (
  program: Program<Treedea>,
  root: PublicKey,
  tree: PublicKey,
  parentNode: PublicKey,
  node: PublicKey
) => {
  return {
    root,
    tree,
    parentNode,
    node,
    systemProgram: anchor.web3.SystemProgram.programId,
    rent: anchor.web3.SYSVAR_RENT_PUBKEY,
  };
};

export const createNoteAccounts = (
  program: Program<Treedea>,
  root: PublicKey,
  tree: PublicKey,
  node: PublicKey,
  id: PublicKey,
  website: string,
  image: string,
  description: string
) => {
  const [note] = PublicKey.findProgramAddressSync(
    [Buffer.from(NOTE_SEED), tree.toBuffer(), id.toBuffer()],
    program.programId
  );

  return {
    root,
    tree,
    node,
    note,
    systemProgram: anchor.web3.SystemProgram.programId,
    rent: anchor.web3.SYSVAR_RENT_PUBKEY,
  };
};

export const attachNoteAccounts = (
  program: Program<Treedea>,
  root: PublicKey,
  tree: PublicKey,
  node: PublicKey,
  id: PublicKey
) => {
  const [note] = PublicKey.findProgramAddressSync(
    [Buffer.from(NOTE_SEED), tree.toBuffer(), id.toBuffer()],
    program.programId
  );

  return {
    root,
    tree,
    node,
    note,
    systemProgram: anchor.web3.SystemProgram.programId,
    rent: anchor.web3.SYSVAR_RENT_PUBKEY,
  };
};

export const createStakeAccounts = (
  program: Program<Treedea>,
  root: PublicKey,
  voteMint: PublicKey,
  tree: PublicKey,
  node: PublicKey,
  note: PublicKey
) => {
  const [rootAuthority] = PublicKey.findProgramAddressSync(
    [Buffer.from(ROOT_AUTHORITY_SEED), root.toBuffer()],
    program.programId
  );
  const stakerAccount = getAssociatedTokenKey(
    program.provider.publicKey,
    voteMint
  );
  const [stakeAccount] = PublicKey.findProgramAddressSync(
    [
      Buffer.from(STAKE_SEED),
      note.toBuffer(),
      program.provider.publicKey.toBuffer(),
    ],
    program.programId
  );
  const voteAccount = getAssociatedTokenKey(rootAuthority, voteMint);

  return {
    signer: program.provider.publicKey,
    rootAuthority,
    root,
    tree,
    node,
    note,
    stakeAccount,
    voteMint,
    stakerAccount,
    voteAccount,
    tokenProgram: TOKEN_PROGRAM_ID,
    associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
    systemProgram: anchor.web3.SystemProgram.programId,
    rent: anchor.web3.SYSVAR_RENT_PUBKEY,
  };
};

export const moveNoteAccounts = (
  program: Program<Treedea>,
  root: PublicKey,
  tree: PublicKey,
  sourceNode: PublicKey,
  destinationNode: PublicKey,
  note: PublicKey
) => {
  return {
    root,
    tree,
    sourceNode,
    destinationNode,
    note,
    systemProgram: anchor.web3.SystemProgram.programId,
  };
};

export const replaceNoteAccounts = (
  program: Program<Treedea>,
  root: PublicKey,
  tree: PublicKey,
  node: PublicKey,
  note: PublicKey,
  weakNote: PublicKey
) => {
  return {
    root,
    tree,
    node,
    note,
    weakNote,
    systemProgram: anchor.web3.SystemProgram.programId,
  };
};
