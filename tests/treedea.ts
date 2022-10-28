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
import { Treedea } from "../target/types/treedea";

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
    console.log(root);

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
    let rootNode = await program.account.node.fetch(treeAccounts.rootNode);
    console.log(tree, rootNode);

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
      printAccounts(rootNoteAccounts[rootNoteAccounts.length - 1]);
      await program.methods
        .createNote(id, treeAccounts.rootNode.toString(), "", "Test note")
        .accounts(rootNoteAccounts[rootNoteAccounts.length - 1])
        .rpc({ skipPreflight: true });
      await program.methods
        .attachNote()
        .accounts(rootNoteAccounts[rootNoteAccounts.length - 1])
        .rpc({ skipPreflight: true });
    }

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
      printAccounts(nodeAccounts[nodeAccounts.length - 1]);
      await program.methods
        .createNode(tag)
        .accounts(nodeAccounts[nodeAccounts.length - 1])
        .rpc({ skipPreflight: true });
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
      printAccounts(attachAccounts);

      if (i < MAX_CHILD_PER_NODE) {
        await program.methods
          .attachNode()
          .accounts(attachAccounts)
          .rpc({ skipPreflight: true });
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
    console.log(
      (await program.account.node.fetch(treeAccounts.rootNode)).children.map(
        (e) => e.toString()
      )
    );
    console.log(
      (await program.account.node.fetch(nodeAccounts[0].node)).parent.toString()
    );
    console.log(
      anchor.web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from(NOTE_SEED),
          treeAccounts.tree.toBuffer(),
          anchor.web3.PublicKey.default.toBuffer(),
          Buffer.from(tags[0]),
        ],
        program.programId
      )[0].toString()
    );
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
      printAccounts(noteAccounts[noteAccounts.length - 1]);
      await program.methods
        .createNote(id, node.node.toString(), "", "Test note")
        .accounts(noteAccounts[noteAccounts.length - 1])
        .rpc({ skipPreflight: true });
      await program.methods
        .attachNote()
        .accounts(noteAccounts[noteAccounts.length - 1])
        .rpc({ skipPreflight: true });
    }

    // Stake on a note of a child node
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
    const stakeAccounts = createStakeAccounts(
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

    console.log(
      await user1Program.account.stakeAccount.fetch(stakeAccounts.stakeAccount)
    );

    await user1Program.methods
      .updateStake(stake)
      .accounts(stakeAccounts)
      .rpc({ skipPreflight: true });

    console.log(
      await user1Program.account.stakeAccount.fetch(stakeAccounts.stakeAccount)
    );

    await user1Program.methods
      .updateStake(stake.neg())
      .accounts(stakeAccounts)
      .rpc({ skipPreflight: true });

    console.log(
      await user1Program.account.stakeAccount.fetch(stakeAccounts.stakeAccount)
    );
  });
});
