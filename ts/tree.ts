import * as anchor from "@project-serum/anchor";

import { ASSOCIATED_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token';
import { NODE_SEED, ROOT_AUTHORITY_SEED, ROOT_SEED, TREE_SEED, VOTE_MINT_SEED } from "./constants"

import { IdeaTree } from "../target/types/idea_tree"
import { Program } from "@project-serum/anchor"
import { PublicKey } from "@solana/web3.js"
import { getAssociatedTokenKey } from "./utils"

export const createRootAccounts = (program: Program<IdeaTree>, id: PublicKey, voteMint: PublicKey) => {
  const [rootAuthority,] = PublicKey.findProgramAddressSync([Buffer.from(ROOT_AUTHORITY_SEED), id.toBuffer()], program.programId)
  const [key,] = PublicKey.findProgramAddressSync([Buffer.from(ROOT_SEED), id.toBuffer()], program.programId)
  const voteAccount = getAssociatedTokenKey(rootAuthority, voteMint)

  return {
    rootAuthority,
    root: key,
    voteMint,
    voteAccount,
    tokenProgram: TOKEN_PROGRAM_ID,
    associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
    systemProgram: anchor.web3.SystemProgram.programId,
    rent: anchor.web3.SYSVAR_RENT_PUBKEY
  }
}

export const createTreeAccounts = (program: Program<IdeaTree>, id: PublicKey, voteMint: PublicKey, razor: string) => {
  const { root } = createRootAccounts(program, id, voteMint)
  const [tree,] = PublicKey.findProgramAddressSync([Buffer.from(TREE_SEED), root.toBuffer(), Buffer.from(razor)], program.programId)
  const [rootNode,] = PublicKey.findProgramAddressSync([Buffer.from(NODE_SEED), tree.toBuffer(), Buffer.from(razor)], program.programId)

  return {
    root,
    tree,
    rootNode,
    systemProgram: anchor.web3.SystemProgram.programId,
    rent: anchor.web3.SYSVAR_RENT_PUBKEY
  }
}