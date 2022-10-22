import * as anchor from "@project-serum/anchor";

import { attachNodeAccounts, createNodeAccounts } from './../ts/tree';
import { createKeypairs, expectRevert, mintToken, printAccounts, provider } from "./utils";
import { createRootAccounts, createTreeAccounts } from "../ts";

import { MAX_CHILD_PER_NODE } from "../ts/constants";
import { Program } from "@project-serum/anchor";
import { Treedea } from "../target/types/treedea";
import { expect } from "chai";

describe("TreeDea", () => {
  const program = anchor.workspace.Treedea as Program<Treedea>;
  let id = anchor.web3.Keypair.generate()
  let admin = anchor.web3.Keypair.generate()
  let user1 = anchor.web3.Keypair.generate()
  let user2 = anchor.web3.Keypair.generate()
  let voteMint

  before(async () => {
    [id, admin, user1, user2] = await createKeypairs(provider, 4)
    voteMint = (await mintToken(provider, admin, user1.publicKey)).mint
  })

  it("Create a tree and win a node auction", async () => {
    const rootAccounts = createRootAccounts(program, id.publicKey, voteMint)
    printAccounts(rootAccounts)

    await program.methods.createRoot(id.publicKey, admin.publicKey).accounts(rootAccounts).rpc({ skipPreflight: true })

    let root = await program.account.root.fetch(rootAccounts.root)
    console.log(root)

    const rootTag = "DeFi Protocol?"
    const treeAccounts = createTreeAccounts(program, rootAccounts.root, rootTag)
    printAccounts(treeAccounts)
    await program.methods.createTree(rootTag).accounts(treeAccounts).rpc({ skipPreflight: true })

    let tree = await program.account.tree.fetch(treeAccounts.tree)
    let rootNode = await program.account.node.fetch(treeAccounts.rootNode)
    console.log(tree, rootNode)

    const tags = ["Solana", "Ethereum", "Polygon", "Arbitrum", "Optimism"]
    let nodeAccounts = []
    for (const tag of tags) {
      nodeAccounts.push(createNodeAccounts(program, rootAccounts.root, treeAccounts.tree, treeAccounts.rootNode, tag))
      console.log(tag)
      printAccounts(nodeAccounts[nodeAccounts.length - 1])
      await program.methods.createNode(tag).accounts(nodeAccounts[nodeAccounts.length - 1]).rpc({ skipPreflight: true })
    }

    for (let i = 0; i <= MAX_CHILD_PER_NODE; i++) {
      const attachAccounts = attachNodeAccounts(program, rootAccounts.root, treeAccounts.tree, treeAccounts.rootNode, nodeAccounts[i].node)
      printAccounts(attachAccounts)

      if (i < MAX_CHILD_PER_NODE) {
        await program.methods.attachNode().accounts(attachAccounts).rpc({ skipPreflight: true })
      } else {
        await expectRevert(program.methods.attachNode().accounts(attachAccounts).rpc({ skipPreflight: true }))
      }
    }
  });
});
