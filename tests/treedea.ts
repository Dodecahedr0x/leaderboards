import * as anchor from "@project-serum/anchor";

import {
  MAX_CHILD_PER_NODE,
  MAX_NOTES_PER_NODE,
  NOTE_SEED,
} from "../ts/constants";
import {
  attachNodeAccounts,
  createNodeAccounts,
  createNoteAccounts,
  createStakeAccounts,
  moveNoteAccounts,
  replaceNoteAccounts,
} from "./../ts/tree";
import {
  createKeypairs,
  expectRevert,
  mintToken,
  printAccounts,
  provider,
} from "./utils";
import { createRootAccounts, createTreeAccounts } from "../ts";

import { Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { Treedea } from "../target/types/treedea";
import { expect } from "chai";

describe("TreeDea", () => {
  const program = anchor.workspace.Treedea as Program<Treedea>;
  let id = anchor.web3.Keypair.generate();
  let admin = anchor.web3.Keypair.generate();
  let user1 = anchor.web3.Keypair.generate();
  let user2 = anchor.web3.Keypair.generate();
  let voteMint;

  before(async () => {
    [id, admin, user1, user2] = await createKeypairs(provider, 4);
    voteMint = (await mintToken(provider, admin, user1.publicKey)).mint;
  });

  it("Create a tree and win a node auction", async () => {
    const rootAccounts = createRootAccounts(program, id.publicKey, voteMint);

    await program.methods
      .createRoot(id.publicKey, admin.publicKey)
      .accounts(rootAccounts)
      .rpc({ skipPreflight: true });

    let root = await program.account.root.fetch(rootAccounts.root);
    expect(root.id.toString()).to.equal(id.publicKey.toString());
    expect(root.admin.toString()).to.equal(admin.publicKey.toString());
    expect(root.voteMint.toString()).to.equal(voteMint.toString());

    const rootTag = "DeFi Protocol?";
    const treeAccounts = createTreeAccounts(
      program,
      rootAccounts.root,
      rootTag
    );
    await program.methods
      .createTree(rootTag)
      .accounts(treeAccounts)
      .rpc({ skipPreflight: true });

    let tree = await program.account.tree.fetch(treeAccounts.tree);
    expect(tree.root.toString()).to.equal(rootAccounts.root.toString());
    expect(tree.rootNode.toString()).to.equal(treeAccounts.rootNode.toString());
    expect(tree.title).to.equal(rootTag);

    let rootNode = await program.account.node.fetch(treeAccounts.rootNode);
    expect(rootNode.tree.toString()).to.equal(treeAccounts.tree.toString());
    expect(rootNode.parent.toString()).to.equal(PublicKey.default.toString());
    expect(rootNode.stake.toString()).to.equal("0");
    expect(rootNode.children.toString()).to.equal([].toString());
    expect(rootNode.tags.toString()).to.equal([rootTag].toString());
    expect(rootNode.notes.toString()).to.equal([].toString());

    // Create notes on the root
    let rootNoteAccounts = [];
    for (let i = 0; i < MAX_NOTES_PER_NODE; i++) {
      const id = anchor.web3.Keypair.generate().publicKey;
      rootNoteAccounts.push(
        createNoteAccounts(
          program,
          rootAccounts.root,
          treeAccounts.tree,
          treeAccounts.rootNode,
          id,
          treeAccounts.rootNode.toString(),
          "",
          "Test note"
        )
      );
      await program.methods
        .createNote(id, treeAccounts.rootNode.toString(), "", "Test note")
        .accounts(rootNoteAccounts[rootNoteAccounts.length - 1])
        .rpc({ skipPreflight: true });
      await program.methods
        .attachNote()
        .accounts(rootNoteAccounts[rootNoteAccounts.length - 1])
        .rpc({ skipPreflight: true });
    }

    rootNode = await program.account.node.fetch(treeAccounts.rootNode);
    expect(rootNode.notes.map((e) => e.toString()).toString()).to.equal(
      rootNoteAccounts.map((e) => e.note.toString()).toString()
    );

    // Create children nodes
    const tags = ["Solana", "Ethereum", "Polygon", "Arbitrum", "Optimism"];
    let nodeAccounts = [];
    for (const tag of tags) {
      nodeAccounts.push(
        createNodeAccounts(
          program,
          rootAccounts.root,
          treeAccounts.tree,
          treeAccounts.rootNode,
          tag
        )
      );
      await program.methods
        .createNode(tag)
        .accounts(nodeAccounts[nodeAccounts.length - 1])
        .rpc({ skipPreflight: true });

      let node = await program.account.node.fetch(
        nodeAccounts[nodeAccounts.length - 1].node
      );
      expect(node.tree.toString()).to.equal(treeAccounts.tree.toString());
      expect(node.parent.toString()).to.equal(treeAccounts.rootNode.toString());
      expect(node.stake.toString()).to.equal("0");
      expect(node.tags.toString()).to.equal([rootTag, tag].toString());
      expect(node.children.toString()).to.equal([].toString());
      expect(node.notes.toString()).to.equal([].toString());
    }

    // Attach nodes
    for (let i = 0; i <= MAX_CHILD_PER_NODE; i++) {
      const attachAccounts = attachNodeAccounts(
        program,
        rootAccounts.root,
        treeAccounts.tree,
        treeAccounts.rootNode,
        nodeAccounts[i].node
      );

      if (i < MAX_CHILD_PER_NODE) {
        await program.methods
          .attachNode()
          .accounts(attachAccounts)
          .rpc({ skipPreflight: true });

        let node = await program.account.node.fetch(treeAccounts.rootNode);
        expect(
          node.children
            .map((e) => e.toString())
            .includes(nodeAccounts[i].node.toString())
        );
      } else {
        await expectRevert(
          program.methods
            .attachNode()
            .accounts(attachAccounts)
            .rpc({ skipPreflight: true })
        );
      }
    }

    // Create notes on first child
    let noteAccounts = [];
    for (const node of nodeAccounts) {
      const id = anchor.web3.Keypair.generate().publicKey;
      noteAccounts.push(
        createNoteAccounts(
          program,
          rootAccounts.root,
          treeAccounts.tree,
          node.node,
          id,
          node.node.toString(),
          "",
          "Test note"
        )
      );
      await program.methods
        .createNote(id, node.node.toString(), "", "Test note")
        .accounts(noteAccounts[noteAccounts.length - 1])
        .rpc({ skipPreflight: true });
      await program.methods
        .attachNote()
        .accounts(noteAccounts[noteAccounts.length - 1])
        .rpc({ skipPreflight: true });

      let note = await program.account.note.fetch(
        noteAccounts[noteAccounts.length - 1].note
      );
      expect(note.parent.toString()).to.equal(node.node.toString());
      expect(note.website).to.equal(node.node.toString());
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
    let stakeAccounts = createStakeAccounts(
      user1Program,
      rootAccounts.root,
      voteMint,
      treeAccounts.tree,
      noteAccounts[0].node,
      noteAccounts[0].note
    );
    printAccounts(stakeAccounts);
    await user1Program.methods
      .createStake()
      .accounts(stakeAccounts)
      .rpc({ skipPreflight: true });

    let stakeAccount = await user1Program.account.stakeAccount.fetch(
      stakeAccounts.stakeAccount
    );
    expect(stakeAccount.stake.toString()).to.equal("0");

    await user1Program.methods
      .updateStake(stake)
      .accounts(stakeAccounts)
      .rpc({ skipPreflight: true });

    stakeAccount = await user1Program.account.stakeAccount.fetch(
      stakeAccounts.stakeAccount
    );
    expect(stakeAccount.stake.toString()).to.equal(stake.toString());

    await user1Program.methods
      .updateStake(stake.neg())
      .accounts(stakeAccounts)
      .rpc({ skipPreflight: true });

    stakeAccount = await user1Program.account.stakeAccount.fetch(
      stakeAccounts.stakeAccount
    );
    expect(stakeAccount.stake.toString()).to.equal("0");

    await user1Program.methods
      .closeStake()
      .accounts(stakeAccounts)
      .rpc({ skipPreflight: true });

    await expectRevert(
      user1Program.account.stakeAccount.fetch(stakeAccounts.stakeAccount)
    );

    // Stake on a note and then upgrade the note
    await user1Program.methods
      .createStake()
      .accounts(stakeAccounts)
      .rpc({ skipPreflight: true });
    await user1Program.methods
      .updateStake(stake)
      .accounts(stakeAccounts)
      .rpc({ skipPreflight: true });

    let moveAccounts = moveNoteAccounts(
      user1Program,
      rootAccounts.root,
      treeAccounts.tree,
      noteAccounts[0].node,
      treeAccounts.rootNode,
      noteAccounts[0].note
    );
    await user1Program.methods
      .moveNote()
      .accounts(moveAccounts)
      .rpc({ skipPreflight: true });

    let note = await program.account.note.fetch(noteAccounts[0].note);
    expect(note.parent.toString()).to.equal(treeAccounts.rootNode.toString());

    // Replace a note on the root
    const replaceAccounts = replaceNoteAccounts(
      user1Program,
      rootAccounts.root,
      treeAccounts.tree,
      treeAccounts.rootNode,
      noteAccounts[0].note,
      rootNoteAccounts[0].note
    );
    await user1Program.methods
      .replaceNote()
      .accounts(replaceAccounts)
      .rpc({ skipPreflight: true });
    // rootNode = await program.account.node.fetch(treeAccounts.rootNode);
  });
});
