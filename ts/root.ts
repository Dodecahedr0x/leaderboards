import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import {
  NODE_SEED,
  ROOT_AUTHORITY_SEED,
  ROOT_SEED,
  TREE_SEED,
} from "./constants";
import { SYSVAR_RENT_PUBKEY, SystemProgram } from "@solana/web3.js";
import { createRoot, createTree } from "./instructions";

import { BN } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { PROGRAM_ID as TREEDEA_ID } from "./programId";

export class TreeDeaRoot {
  signer: PublicKey;
  rootId: PublicKey;
  rootKey: PublicKey;
  rootAuthority: PublicKey;
  voteMint: PublicKey;
  voteAccount: PublicKey;

  constructor(signer: PublicKey, rootId: PublicKey, voteMint: PublicKey) {
    this.signer = signer;
    this.rootId = rootId;
    this.rootKey = PublicKey.findProgramAddressSync(
      [Buffer.from(ROOT_SEED), rootId.toBuffer()],
      TREEDEA_ID
    )[0];
    this.rootAuthority = PublicKey.findProgramAddressSync(
      [Buffer.from(ROOT_AUTHORITY_SEED), this.rootKey.toBuffer()],
      TREEDEA_ID
    )[0];
    this.voteMint = voteMint;
    this.voteAccount = getAssociatedTokenAddressSync(
      voteMint,
      this.rootAuthority,
      true
    );
  }

  instruction = {
    createRoot: (admin: PublicKey, treeCreationFee: BN) => {
      return createRoot(
        { id: this.rootId, admin, treeCreationFee },
        {
          signer: this.signer,
          rootAuthority: this.rootAuthority,
          root: this.rootKey,
          voteMint: this.voteMint,
          voteAccount: this.voteAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
        }
      );
    },
    createTree: (tag: string) => {
      const [tree] = PublicKey.findProgramAddressSync(
        [Buffer.from(TREE_SEED), this.rootKey.toBuffer(), Buffer.from(tag)],
        TREEDEA_ID
      );
      const [rootNode] = PublicKey.findProgramAddressSync(
        [
          Buffer.from(NODE_SEED),
          tree.toBuffer(),
          PublicKey.default.toBuffer(),
          Buffer.from(tag),
        ],
        TREEDEA_ID
      );

      return createTree(
        { tag },
        {
          signer: this.signer,
          root: this.rootKey,
          tree,
          rootNode,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
        }
      );
    },
  };
}
