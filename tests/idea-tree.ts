import * as anchor from "@project-serum/anchor";

import { createKeypairs, mintToken, printAccounts, provider } from "./utils";
import { createRootAccounts, createTreeAccounts } from "../ts";

import { IdeaTree } from "../target/types/idea_tree";
import { Program } from "@project-serum/anchor";

describe("idea-tree", () => {
  const program = anchor.workspace.IdeaTree as Program<IdeaTree>;
  let id = anchor.web3.Keypair.generate()
  let admin = anchor.web3.Keypair.generate()
  let user1 = anchor.web3.Keypair.generate()
  let user2 = anchor.web3.Keypair.generate()
  let voteMint

  before(async () => {
    [id, admin, user1, user2] = await createKeypairs(provider, 4)
    voteMint = (await mintToken(provider, admin, user1.publicKey)).mint
  })

  it("Create a tree", async () => {
    const rootAccounts = createRootAccounts(program, id.publicKey, voteMint)
    printAccounts(rootAccounts)

    await program.methods.createRoot(id.publicKey, admin.publicKey).accounts(rootAccounts).rpc({ skipPreflight: true })

    let root = await program.account.root.fetch(rootAccounts.root)
    console.log(root)
    
    const rootRazor = "DeFi Protocol?"
    const treeAccounts = createTreeAccounts(program, id.publicKey, voteMint, rootRazor)
    printAccounts(treeAccounts)
    await program.methods.createTree(rootRazor).accounts(treeAccounts).rpc({ skipPreflight: true })
    
    let tree = await program.account.tree.fetch(treeAccounts.tree)
    console.log(tree)
  });
});
