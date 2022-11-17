import { AnchorProvider, Provider } from "@project-serum/anchor";
import {
  Keypair,
  PublicKey,
  SYSVAR_RENT_PUBKEY,
  SystemProgram,
} from "@solana/web3.js";
import { Node, Root, Tree } from "./accounts";
import { attachNode, createNode } from "./instructions";

import { PROGRAM_ID as DIP_PROGRAM_ID } from "./programId";
import { NODE_SEED } from "./constants";
import { TreeDeaNote } from "./note";
import { TreeDeaRoot } from "./root";
import { TreeDeaTree } from "./tree";

export class TreeDeaNode {
  tree: TreeDeaTree;
  parent: PublicKey;
  nodeKey: PublicKey;
  tag: string;

  constructor(tree: TreeDeaTree, parent: PublicKey, tag: string) {
    this.tree = tree;
    this.parent = parent;
    this.nodeKey = PublicKey.findProgramAddressSync(
      [
        Buffer.from(NODE_SEED),
        tree.treeKey.toBuffer(),
        parent.toBuffer(),
        Buffer.from(tag),
      ],
      DIP_PROGRAM_ID
    )[0];
    this.tag = tag;
  }

  static async fromNode(provider: Provider, node: Node) {
    const tree = await Tree.fetch(provider.connection, node.tree);
    if (!tree) return;

    const root = await Root.fetch(provider.connection, tree.root);
    if (!root) return;

    return new TreeDeaNode(
      new TreeDeaTree(
        new TreeDeaRoot(provider.publicKey, root.id, root.voteMint),
        tree.title
      ),
      node.parent,
      node.tags[node.tags.length - 1]
    );
  }

  instruction = {
    createChild: (tag: string) => {
      return createNode(
        { tag },
        {
          signer: this.tree.root.signer,
          root: this.tree.root.rootKey,
          tree: this.tree.treeKey,
          parentNode: this.nodeKey,
          node: this.nodeKey,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
        }
      );
    },
    attachNode: () => {
      return attachNode({
        signer: this.tree.root.signer,
        root: this.tree.root.rootKey,
        tree: this.tree.treeKey,
        parentNode: this.parent,
        node: this.nodeKey,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      });
    },
  };

  createNode(tag: string) {
    return {
      ix: this.instruction.createChild(tag),
      child: new TreeDeaNode(this.tree, this.nodeKey, tag),
    };
  }
  createNote(website: string, image: string, description: string) {
    const note = new TreeDeaNote(this, Keypair.generate().publicKey);
    return {
      ix: note.instruction.createNote(website, image, description),
      note,
    };
  }
}
