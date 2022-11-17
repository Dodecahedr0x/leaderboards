import {
  NODE_SEED,
  NOTE_SEED,
  ROOT_AUTHORITY_SEED,
  ROOT_SEED,
} from "./constants";
import { Node, Root, Tree } from "./accounts";
import { PublicKey, SYSVAR_RENT_PUBKEY, SystemProgram } from "@solana/web3.js";
import {
  attachNode,
  attachNote,
  createNode,
  createNote,
  moveNote,
  replaceNote,
} from "./instructions";

import { AnchorProvider } from "@project-serum/anchor";
import { PROGRAM_ID as DIP_PROGRAM_ID } from "./programId";
import { TreeDeaNode } from "./node";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";

export class TreeDeaNote {
  node: TreeDeaNode;
  id: PublicKey;
  noteKey: PublicKey;

  constructor(node: TreeDeaNode, noteId: PublicKey) {
    this.node = node;
    this.id = noteId;
    this.noteKey = PublicKey.findProgramAddressSync(
      [
        Buffer.from(NOTE_SEED),
        this.node.tree.treeKey.toBuffer(),
        this.id.toBuffer(),
      ],
      DIP_PROGRAM_ID
    )[0];
  }

  instruction = {
    createNote: (website: string, image: string, description: string) => {
      return createNote(
        { website, image, id: this.id, description },
        {
          signer: this.node.tree.root.signer,
          root: this.node.tree.root.rootKey,
          tree: this.node.tree.treeKey,
          note: this.noteKey,
          node: this.node.nodeKey,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
        }
      );
    },
    attachNote: () => {
      return attachNote({
        signer: this.node.tree.root.signer,
        root: this.node.tree.root.rootKey,
        tree: this.node.tree.treeKey,
        note: this.noteKey,
        node: this.node.nodeKey,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      });
    },
    moveNote: (destinationNode: PublicKey) => {
      return moveNote({
        signer: this.node.tree.root.signer,
        root: this.node.tree.root.rootKey,
        tree: this.node.tree.treeKey,
        note: this.noteKey,
        sourceNode: this.node.nodeKey,
        destinationNode,
        systemProgram: SystemProgram.programId,
      });
    },
    replaceNote: (targetNote: PublicKey) => {
      return replaceNote({
        signer: this.node.tree.root.signer,
        root: this.node.tree.root.rootKey,
        tree: this.node.tree.treeKey,
        node: this.node.nodeKey,
        weakNote: targetNote,
        note: this.noteKey,
        systemProgram: SystemProgram.programId,
      });
    },
  };
}
