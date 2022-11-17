import * as anchor from "@project-serum/anchor";

import { MAX_CHILD_PER_NODE, MAX_NOTES_PER_NODE } from "../ts/constants";
import {
  createKeypairs,
  expectRevert,
  mintToken,
  printAccounts,
} from "./utils";

import { DippiesIndexProtocol } from "../target/types/dippies_index_protocol";
import { Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { TreeDeaNode } from "./../ts/node";
import { TreeDeaNote } from "./../ts/note";
import { TreeDeaRoot } from "./../ts/index";
import { TreeDeaStakeState } from "../ts/stakeState";
import { TreeDeaTree } from "./../ts/tree";
import { expect } from "chai";

describe("Dippies Index Protocol", () => {
  let provider: anchor.AnchorProvider;
  const program = anchor.workspace
    .DippiesIndexProtocol as Program<DippiesIndexProtocol>;
  let id = anchor.web3.Keypair.generate();
  let admin = anchor.web3.Keypair.generate();
  let user1 = anchor.web3.Keypair.generate();
  let user2 = anchor.web3.Keypair.generate();
  let voteMint;

  before(async () => {
    [id, admin, user1, user2] = await createKeypairs(
      program.provider.connection,
      4
    );
    provider = new anchor.AnchorProvider(
      program.provider.connection,
      new anchor.Wallet(admin),
      {}
    );
    voteMint = (await mintToken(provider, admin, user1.publicKey)).mint;
  });

  it("Create a tree and win a node auction", async () => {
    const treeCreationFee = new anchor.BN(10000);

    const root = new TreeDeaRoot(provider.publicKey, id.publicKey, voteMint);

    await provider.sendAndConfirm(
      new anchor.web3.Transaction().add(
        root.instruction.createRoot(admin.publicKey, treeCreationFee)
      )
    );

    let rootAccount = await program.account.root.fetch(root.rootKey);
    expect(rootAccount.id.toString()).to.equal(id.publicKey.toString());
    expect(root.voteMint.toString()).to.equal(voteMint.toString());

    const rootTag = "DeFi Protocol?";
    await provider.sendAndConfirm(
      new anchor.web3.Transaction().add(root.instruction.createTree(rootTag))
    );

    const tree = new TreeDeaTree(root, rootTag);
    let treeAccount = await program.account.tree.fetch(tree.treeKey);
    expect(treeAccount.root.toString()).to.equal(tree.root.rootKey.toString());
    expect(treeAccount.rootNode.toString()).to.equal(tree.rootNode.toString());
    expect(treeAccount.title).to.equal(rootTag);

    let rootNode = await program.account.node.fetch(tree.rootNode);
    expect(rootNode.tree.toString()).to.equal(tree.treeKey.toString());
    expect(rootNode.parent.toString()).to.equal(PublicKey.default.toString());
    expect(rootNode.stake.toString()).to.equal("0");
    expect(rootNode.children.toString()).to.equal([].toString());
    expect(rootNode.tags.toString()).to.equal([rootTag].toString());
    expect(rootNode.notes.toString()).to.equal([].toString());

    // Create notes on the root
    let rootNoteAccounts: TreeDeaNote[] = [];
    for (let i = 0; i < MAX_NOTES_PER_NODE; i++) {
      const id = anchor.web3.Keypair.generate().publicKey;

      rootNoteAccounts.push(
        new TreeDeaNote(new TreeDeaNode(tree, PublicKey.default, rootTag), id)
      );

      await provider.sendAndConfirm(
        new anchor.web3.Transaction().add(
          rootNoteAccounts[rootNoteAccounts.length - 1].instruction.createNote(
            tree.rootNode.toString(),
            "",
            "test"
          )
        )
      );
      await provider.sendAndConfirm(
        new anchor.web3.Transaction().add(
          rootNoteAccounts[rootNoteAccounts.length - 1].instruction.attachNote()
        )
      );
    }

    rootNode = await program.account.node.fetch(tree.rootNode);
    expect(rootNode.notes.map((e) => e.toString()).toString()).to.equal(
      rootNoteAccounts.map((e) => e.noteKey.toString()).toString()
    );

    // Create children nodes
    const tags = ["Solana", "Ethereum", "Polygon", "Arbitrum", "Optimism"];
    let nodeAccounts: TreeDeaNode[] = [];
    for (const tag of tags) {
      nodeAccounts.push(new TreeDeaNode(tree, tree.rootNode, tag));
      await provider.sendAndConfirm(
        new anchor.web3.Transaction().add(tree.instruction.createNode(tag))
      );

      let node = await program.account.node.fetch(
        nodeAccounts[nodeAccounts.length - 1].nodeKey
      );
      expect(node.tree.toString()).to.equal(tree.treeKey.toString());
      expect(node.parent.toString()).to.equal(tree.rootNode.toString());
      expect(node.stake.toString()).to.equal("0");
      expect(node.tags.toString()).to.equal([rootTag, tag].toString());
      expect(node.children.toString()).to.equal([].toString());
      expect(node.notes.toString()).to.equal([].toString());
    }

    // Attach nodes
    for (let i = 0; i <= MAX_CHILD_PER_NODE; i++) {
      if (i < MAX_CHILD_PER_NODE) {
        await provider.sendAndConfirm(
          new anchor.web3.Transaction().add(
            nodeAccounts[i].instruction.attachNode()
          )
        );

        let node = await program.account.node.fetch(tree.rootNode);
        expect(
          node.children
            .map((e) => e.toString())
            .includes(nodeAccounts[i].nodeKey.toString())
        );
      } else {
        await expectRevert(
          provider.sendAndConfirm(
            new anchor.web3.Transaction().add(
              nodeAccounts[i].instruction.attachNode()
            )
          )
        );
      }
    }

    // Create notes on first child
    let noteAccounts: TreeDeaNote[] = [];
    for (const node of nodeAccounts) {
      const id = anchor.web3.Keypair.generate().publicKey;
      noteAccounts.push(new TreeDeaNote(node, id));
      await provider.sendAndConfirm(
        new anchor.web3.Transaction().add(
          noteAccounts[noteAccounts.length - 1].instruction.createNote(
            node.nodeKey.toString(),
            "",
            "Test note"
          )
        )
      );
      await provider.sendAndConfirm(
        new anchor.web3.Transaction().add(
          noteAccounts[noteAccounts.length - 1].instruction.attachNote()
        )
      );

      let note = await program.account.note.fetch(
        noteAccounts[noteAccounts.length - 1].noteKey
      );
      expect(note.parent.toString()).to.equal(node.nodeKey.toString());
      expect(note.website).to.equal(node.nodeKey.toString());
      expect(note.image).to.equal("");
      expect(note.description).to.equal("Test note");
    }

    // Stake on a note of a child node and then unstake
    const stake = new anchor.BN(1000);
    const user1Program = new Program(
      program.idl,
      program.programId,
      new anchor.AnchorProvider(
        program.provider.connection,
        new anchor.Wallet(user1),
        {
          skipPreflight: true,
        }
      )
    );
    const stakeState = new TreeDeaStakeState(noteAccounts[0], user1.publicKey);

    await user1Program.provider.sendAndConfirm(
      new anchor.web3.Transaction().add(stakeState.instruction.createStake())
    );

    let stakeAccount = await user1Program.account.stakeState.fetch(
      stakeState.stakeKey
    );
    expect(stakeAccount.stake.toString()).to.equal("0");

    await user1Program.provider.sendAndConfirm(
      new anchor.web3.Transaction().add(
        stakeState.instruction.updateStake(stake)
      )
    );

    stakeAccount = await user1Program.account.stakeState.fetch(
      stakeState.stakeKey
    );
    expect(stakeAccount.stake.toString()).to.equal(stake.toString());

    await user1Program.provider.sendAndConfirm(
      new anchor.web3.Transaction().add(
        stakeState.instruction.updateStake(stake.neg())
      )
    );

    stakeAccount = await user1Program.account.stakeState.fetch(
      stakeState.stakeKey
    );
    expect(stakeAccount.stake.toString()).to.equal("0");

    await user1Program.provider.sendAndConfirm(
      new anchor.web3.Transaction().add(stakeState.instruction.closeStake())
    );

    await expectRevert(
      user1Program.account.stakeState.fetch(stakeState.stakeKey)
    );

    // Stake on a note and then upgrade the note
    await user1Program.provider.sendAndConfirm(
      new anchor.web3.Transaction().add(stakeState.instruction.createStake())
    );
    await user1Program.provider.sendAndConfirm(
      new anchor.web3.Transaction().add(
        stakeState.instruction.updateStake(stake)
      )
    );

    await user1Program.provider.sendAndConfirm(
      new anchor.web3.Transaction().add(
        noteAccounts[0].instruction.moveNote(tree.rootNode)
      )
    );

    let note = await program.account.note.fetch(noteAccounts[0].noteKey);
    expect(note.parent.toString()).to.equal(tree.rootNode.toString());

    // Replace a note on the root
    await user1Program.provider.sendAndConfirm(
      new anchor.web3.Transaction().add(
        new TreeDeaNote(
          await TreeDeaNode.fromNode(user1Program.provider, rootNode as any),
          noteAccounts[0].id
        ).instruction.replaceNote(rootNoteAccounts[0].noteKey)
      )
    );
  });
});
