import { PublicKey, SYSVAR_RENT_PUBKEY, SystemProgram } from "@solana/web3.js";
import { attachNote, createNote, moveNote, replaceNote } from "./instructions";

import { PROGRAM_ID as DIP_PROGRAM_ID } from "./programId";
import { DipNode } from "./node";
import { NOTE_SEED } from "./constants";

export class DipNote {
  node: DipNode;
  id: PublicKey;
  noteKey: PublicKey;

  constructor(node: DipNode, noteId: PublicKey) {
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
          signer: this.node.tree.forest.signer,
          forest: this.node.tree.forest.forestKey,
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
        signer: this.node.tree.forest.signer,
        forest: this.node.tree.forest.forestKey,
        tree: this.node.tree.treeKey,
        note: this.noteKey,
        node: this.node.nodeKey,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      });
    },
    moveNote: (destinationNode: PublicKey) => {
      return moveNote({
        signer: this.node.tree.forest.signer,
        forest: this.node.tree.forest.forestKey,
        tree: this.node.tree.treeKey,
        note: this.noteKey,
        sourceNode: this.node.nodeKey,
        destinationNode,
        systemProgram: SystemProgram.programId,
      });
    },
    replaceNote: (targetNote: PublicKey) => {
      return replaceNote({
        signer: this.node.tree.forest.signer,
        forest: this.node.tree.forest.forestKey,
        tree: this.node.tree.treeKey,
        node: this.node.nodeKey,
        weakNote: targetNote,
        note: this.noteKey,
        systemProgram: SystemProgram.programId,
      });
    },
  };
}
