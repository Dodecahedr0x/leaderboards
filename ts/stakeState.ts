import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { AnchorProvider, BN } from "@project-serum/anchor";
import {
  NOTE_SEED,
  ROOT_AUTHORITY_SEED,
  ROOT_SEED,
  STAKE_SEED,
} from "./constants";
import { Node, Note, Root, Tree } from "./accounts";
import { PublicKey, SYSVAR_RENT_PUBKEY, SystemProgram } from "@solana/web3.js";
import { closeStake, createStake, updateStake } from "./instructions";

import { PROGRAM_ID as DIP_PROGRAM_ID } from "./programId";
import { StakeState } from "./accounts/StakeState";
import { TreeDeaNode } from "./node";
import { TreeDeaNote } from "./note";

export class TreeDeaStakeState {
  note: TreeDeaNote;
  stakeKey: PublicKey;

  constructor(note: TreeDeaNote, signer?: PublicKey) {
    this.note = note;
    if (signer) this.note.node.tree.root.signer = signer;
    this.stakeKey = PublicKey.findProgramAddressSync(
      [
        Buffer.from(STAKE_SEED),
        this.note.noteKey.toBuffer(),
        this.note.node.tree.root.signer.toBuffer(),
      ],
      DIP_PROGRAM_ID
    )[0];
  }

  static async fromNote(provider: AnchorProvider, note: Note) {
    const node = await Node.fetch(provider.connection, note.parent);
    if (!node) return;

    return new TreeDeaStakeState(
      new TreeDeaNote(await TreeDeaNode.fromNode(provider, node), note.id)
    );
  }

  static key(noteKey: PublicKey, signer: PublicKey) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from(STAKE_SEED), noteKey.toBuffer(), signer.toBuffer()],
      DIP_PROGRAM_ID
    )[0];
  }

  instruction = {
    createStake: () => {
      return createStake({
        signer: this.note.node.tree.root.signer,
        rootAuthority: this.note.node.tree.root.rootAuthority,
        root: this.note.node.tree.root.rootKey,
        voteMint: this.note.node.tree.root.voteMint,
        tree: this.note.node.tree.treeKey,
        node: this.note.node.nodeKey,
        note: this.note.noteKey,
        stakeState: this.stakeKey,
        stakerAccount: getAssociatedTokenAddressSync(
          this.note.node.tree.root.voteMint,
          this.note.node.tree.root.signer,
          true
        ),
        voteAccount: getAssociatedTokenAddressSync(
          this.note.node.tree.root.voteMint,
          this.note.node.tree.root.rootAuthority,
          true
        ),
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      });
    },
    updateStake: (stake: BN) => {
      return updateStake(
        { stake },
        {
          signer: this.note.node.tree.root.signer,
          rootAuthority: this.note.node.tree.root.rootAuthority,
          root: this.note.node.tree.root.rootKey,
          voteMint: this.note.node.tree.root.voteMint,
          tree: this.note.node.tree.treeKey,
          node: this.note.node.nodeKey,
          note: this.note.noteKey,
          stakeState: this.stakeKey,
          stakerAccount: getAssociatedTokenAddressSync(
            this.note.node.tree.root.voteMint,
            this.note.node.tree.root.signer
          ),
          voteAccount: getAssociatedTokenAddressSync(
            this.note.node.tree.root.voteMint,
            this.note.node.tree.root.rootAuthority,
            true
          ),
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
        }
      );
    },
    closeStake: () => {
      return closeStake({
        signer: this.note.node.tree.root.signer,
        root: this.note.node.tree.root.rootKey,
        tree: this.note.node.tree.treeKey,
        note: this.note.noteKey,
        stakeState: this.stakeKey,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      });
    },
  };
}
