import * as anchor from "@project-serum/anchor";

import { MAX_CHILD_PER_NODE, MAX_NOTES_PER_NODE } from "../ts/constants";
import {
  createKeypairs,
  expectRevert,
  mintToken,
  printAccounts,
} from "./utils";
import {
  getAccount,
  getAssociatedTokenAddressSync,
  getOrCreateAssociatedTokenAccount,
  transfer,
} from "@solana/spl-token";
import {
  getAttachNodeAccounts,
  getAttachNoteAccounts,
  getClaimBribeAccounts,
  getCloseStakeAccounts,
  getCreateForestAccounts,
  getCreateNodeAccounts,
  getCreateNoteAccounts,
  getCreateStakeAccounts,
  getCreateTreeAccounts,
  getMoveNoteAccounts,
  getReplaceNoteAccounts,
  getSetBribeAccounts,
  getUpdateStakeAccounts,
} from "../ts/account";
import {
  getForestAddress,
  getNodeAddress,
  getNoteAddress,
  getStakeAddress,
  getTreeAddress,
} from "../ts/pda";

import { DippiesIndexProtocol } from "../ts/dippies_index_protocol";
import DippiesIndexProtocolIdl from "../ts/dippies_index_protocol.json";
import { Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { UpdatedBribeEvent } from "./../ts";
import { expect } from "chai";

describe("Dippies Index Protocol", () => {
  let provider: anchor.AnchorProvider;
  let program = anchor.workspace
    .DippiesIndexProtocol as Program<DippiesIndexProtocol>;
  let id = anchor.web3.Keypair.generate();
  let admin = anchor.web3.Keypair.generate();
  let user1 = anchor.web3.Keypair.generate();
  let user2 = anchor.web3.Keypair.generate();
  let voteMint: PublicKey;

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
    program = new Program<DippiesIndexProtocol>(
      DippiesIndexProtocolIdl as any,
      program.programId,
      provider
    );
    voteMint = (await mintToken(provider, admin, user1.publicKey)).mint;

    await transfer(
      provider.connection,
      user1,
      (
        await getOrCreateAssociatedTokenAccount(
          provider.connection,
          user1,
          voteMint,
          user1.publicKey
        )
      ).address,
      (
        await getOrCreateAssociatedTokenAccount(
          provider.connection,
          user1,
          voteMint,
          admin.publicKey
        )
      ).address,
      user1.publicKey,
      10 ** 6
    );
  });

  it("Create a tree and win a node auction", async () => {
    const treeCreationFee = new anchor.BN(1000);

    const forestKey = getForestAddress(id.publicKey);

    await provider.connection.confirmTransaction(
      await program.methods
        .createForest(id.publicKey, user2.publicKey, treeCreationFee)
        .accounts(
          getCreateForestAccounts(
            id.publicKey,
            voteMint,
            program.provider.publicKey
          )
        )
        .rpc({ skipPreflight: true })
    );

    let forestAccount = await program.account.forest.fetch(forestKey);
    expect(forestAccount.id.toString()).to.equal(id.publicKey.toString());
    expect(voteMint.toString()).to.equal(voteMint.toString());

    const forestTag = "DeFi Protocol?";
    await provider.connection.confirmTransaction(
      await program.methods
        .createTree(forestTag)
        .accounts(
          getCreateTreeAccounts(
            forestKey,
            user2.publicKey,
            voteMint,
            forestTag,
            program.provider.publicKey
          )
        )
        .rpc({ skipPreflight: true })
    );

    expect(
      (
        await getAccount(
          provider.connection,
          getAssociatedTokenAddressSync(voteMint, user2.publicKey)
        )
      ).amount.toString()
    ).to.equal(treeCreationFee.toString());

    const treeKey = getTreeAddress(forestKey, forestTag);
    const rootNodeKey = getNodeAddress(treeKey, PublicKey.default, forestTag);

    let treeAccount = await program.account.tree.fetch(treeKey);
    expect(treeAccount.forest.toString()).to.equal(forestKey.toString());
    expect(treeAccount.rootNode.toString()).to.equal(rootNodeKey.toString());
    expect(treeAccount.title).to.equal(forestTag);

    let rootNode = await program.account.node.fetch(treeAccount.rootNode);
    expect(rootNode.tree.toString()).to.equal(treeKey.toString());
    expect(rootNode.parent.toString()).to.equal(PublicKey.default.toString());
    expect(rootNode.stake.toString()).to.equal("0");
    expect(rootNode.children.toString()).to.equal([].toString());
    expect(rootNode.tags.toString()).to.equal([forestTag].toString());
    expect(rootNode.notes.toString()).to.equal([].toString());

    // Create notes on the root
    let rootNoteKeys: PublicKey[] = [];
    for (let i = 0; i < MAX_NOTES_PER_NODE; i++) {
      const id = anchor.web3.Keypair.generate().publicKey;
      const key = getNoteAddress(treeKey, id);
      rootNoteKeys.push(key);

      await provider.connection.confirmTransaction(
        await program.methods
          .createNote(id, "title", treeAccount.rootNode.toString(), "", "test")
          .accounts(
            getCreateNoteAccounts(
              forestKey,
              treeKey,
              rootNodeKey,
              id,
              program.provider.publicKey
            )
          )
          .rpc()
      );
      await provider.connection.confirmTransaction(
        await program.methods
          .attachNote()
          .accounts(
            getAttachNoteAccounts(
              forestKey,
              treeKey,
              rootNodeKey,
              getNoteAddress(treeKey, id),
              program.provider.publicKey
            )
          )
          .rpc()
      );
    }

    rootNode = await program.account.node.fetch(rootNodeKey);
    expect(rootNode.notes.map((e) => e.toString()).toString()).to.equal(
      rootNoteKeys.map((e) => e.toString()).toString()
    );

    // Create children nodes
    const tags = ["Solana", "Ethereum", "Polygon", "Arbitrum", "Optimism"];
    let nodeKeys: PublicKey[] = [];
    for (const tag of tags) {
      nodeKeys.push(getNodeAddress(treeKey, rootNodeKey, tag));
      await provider.connection.confirmTransaction(
        await program.methods
          .createNode(tag)
          .accounts(
            getCreateNodeAccounts(
              forestKey,
              treeKey,
              rootNodeKey,
              tag,
              program.provider.publicKey
            )
          )
          .rpc()
      );

      let node = await program.account.node.fetch(
        nodeKeys[nodeKeys.length - 1]
      );
      expect(node.tree.toString()).to.equal(treeKey.toString());
      expect(node.parent.toString()).to.equal(rootNodeKey.toString());
      expect(node.stake.toString()).to.equal("0");
      expect(node.tags.toString()).to.equal([forestTag, tag].toString());
      expect(node.children.toString()).to.equal([].toString());
      expect(node.notes.toString()).to.equal([].toString());
    }

    // Attach nodes
    for (let i = 0; i <= MAX_CHILD_PER_NODE; i++) {
      if (i < MAX_CHILD_PER_NODE) {
        await provider.connection.confirmTransaction(
          await program.methods
            .attachNode()
            .accounts(
              getAttachNodeAccounts(
                forestKey,
                treeKey,
                rootNodeKey,
                nodeKeys[i],
                program.provider.publicKey
              )
            )
            .rpc({ skipPreflight: true })
        );

        let node = await program.account.node.fetch(rootNodeKey);
        expect(
          node.children
            .map((e) => e.toString())
            .includes(nodeKeys[i].toString())
        );
      } else {
        await expectRevert(
          program.methods
            .attachNode()
            .accounts(
              getAttachNodeAccounts(
                forestKey,
                treeKey,
                rootNodeKey,
                nodeKeys[i],
                program.provider.publicKey
              )
            )
            .rpc({ skipPreflight: true })
        );
      }
    }

    // Create notes on first child
    let noteKeys: PublicKey[] = [];
    for (let i = 0; i < MAX_NOTES_PER_NODE; i++) {
      const id = anchor.web3.Keypair.generate().publicKey;
      const noteKey = getNoteAddress(treeKey, id);
      noteKeys.push(noteKey);
      await provider.connection.confirmTransaction(
        await program.methods
          .createNote(id, "title", nodeKeys[0].toString(), "", "Test note")
          .accounts(
            getCreateNoteAccounts(
              forestKey,
              treeKey,
              nodeKeys[0],
              id,
              program.provider.publicKey
            )
          )
          .rpc({ skipPreflight: true })
      );
      await provider.connection.confirmTransaction(
        await program.methods
          .attachNote()
          .accounts(
            getAttachNoteAccounts(
              forestKey,
              treeKey,
              nodeKeys[0],
              noteKey,
              program.provider.publicKey
            )
          )
          .rpc({ skipPreflight: true })
      );

      let note = await program.account.note.fetch(
        noteKeys[noteKeys.length - 1]
      );
      expect(note.parent.toString()).to.equal(nodeKeys[0].toString());
      expect(note.website).to.equal(nodeKeys[0].toString());
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
    const stakeStateKey = getStakeAddress(noteKeys[0], user1.publicKey);

    await provider.connection.confirmTransaction(
      await program.methods
        .createStake()
        .accounts(
          getCreateStakeAccounts(
            forestKey,
            voteMint,
            treeKey,
            nodeKeys[0],
            noteKeys[0],
            user1.publicKey
          )
        )
        .signers([user1])
        .rpc({ skipPreflight: true })
    );

    let stakeAccount = await user1Program.account.stakeState.fetch(
      stakeStateKey
    );
    expect(stakeAccount.stake.toString()).to.equal("0");

    await provider.connection.confirmTransaction(
      await program.methods
        .updateStake(stake)
        .accounts(
          getUpdateStakeAccounts(
            forestKey,
            voteMint,
            treeKey,
            nodeKeys[0],
            noteKeys[0],
            user1.publicKey
          )
        )
        .signers([user1])
        .rpc({ skipPreflight: true })
    );
    const timeBefore = await provider.connection.getBlockTime(
      await provider.connection.getSlot()
    );

    stakeAccount = await user1Program.account.stakeState.fetch(stakeStateKey);
    expect(stakeAccount.stake.toString()).to.equal(stake.toString());

    await provider.connection.confirmTransaction(
      await program.methods
        .updateStake(stake.neg())
        .accounts(
          getUpdateStakeAccounts(
            forestKey,
            voteMint,
            treeKey,
            nodeKeys[0],
            noteKeys[0],
            user1.publicKey
          )
        )
        .signers([user1])
        .rpc({ skipPreflight: true })
    );

    stakeAccount = await user1Program.account.stakeState.fetch(stakeStateKey);
    expect(stakeAccount.stake.toString()).to.equal("0");
    expect(stakeAccount.accumulatedStake.toString()).to.equal(
      stake
        .mul(
          new anchor.BN(
            (await provider.connection.getBlockTime(
              await provider.connection.getSlot()
            )) - timeBefore
          )
        )
        .toString()
    );

    await provider.connection.confirmTransaction(
      await program.methods
        .closeStake()
        .accounts(
          getCloseStakeAccounts(
            forestKey,
            treeKey,
            noteKeys[0],
            user1.publicKey
          )
        )
        .signers([user1])
        .rpc({ skipPreflight: true })
    );

    await expectRevert(user1Program.account.stakeState.fetch(stakeStateKey));

    // Stake on a note and then upgrade the note
    await provider.connection.confirmTransaction(
      await program.methods
        .createStake()
        .accounts(
          getCreateStakeAccounts(
            forestKey,
            voteMint,
            treeKey,
            nodeKeys[0],
            noteKeys[0],
            user1.publicKey
          )
        )
        .signers([user1])
        .rpc({ skipPreflight: true })
    );
    await provider.connection.confirmTransaction(
      await program.methods
        .updateStake(stake)
        .accounts(
          getUpdateStakeAccounts(
            forestKey,
            voteMint,
            treeKey,
            nodeKeys[0],
            noteKeys[0],
            user1.publicKey
          )
        )
        .signers([user1])
        .rpc({ skipPreflight: true })
    );

    await provider.connection.confirmTransaction(
      await program.methods
        .moveNote()
        .accounts(
          getMoveNoteAccounts(
            forestKey,
            treeKey,
            noteKeys[0],
            nodeKeys[0],
            rootNodeKey,
            program.provider.publicKey
          )
        )
        .rpc({ skipPreflight: true })
    );

    let noteAccount = await program.account.note.fetch(noteKeys[0]);
    expect(noteAccount.parent.toString()).to.equal(rootNodeKey.toString());

    // Replace a note on the root
    await provider.connection.confirmTransaction(
      await program.methods
        .replaceNote()
        .accounts(
          getReplaceNoteAccounts(
            forestKey,
            treeKey,
            rootNodeKey,
            noteKeys[0],
            rootNoteKeys[0],
            program.provider.publicKey
          )
        )
        .rpc({ skipPreflight: true })
    );

    // Bribe and claim it
    let updateCount = 0;
    const listener = program.addEventListener(
      "UpdatedBribe",
      (event: UpdatedBribeEvent, slot, sig) => {
        updateCount += 1;
      }
    );
    const bribeAmount = new anchor.BN(10000);
    let balanceBefore = (
      await getAccount(
        provider.connection,
        getAssociatedTokenAddressSync(voteMint, user1.publicKey)
      )
    ).amount;
    await provider.connection.confirmTransaction(
      await program.methods
        .setBribe(bribeAmount)
        .accounts(
          getSetBribeAccounts(
            forestKey,
            treeKey,
            nodeKeys[0],
            noteKeys[0],
            voteMint,
            user1.publicKey
          )
        )
        .signers([user1])
        .rpc({ skipPreflight: true })
    );

    expect(
      (
        await getAccount(
          provider.connection,
          getAssociatedTokenAddressSync(voteMint, user1.publicKey)
        )
      ).amount.toString()
    ).to.equal(
      new anchor.BN(balanceBefore.toString())
        .sub(new anchor.BN(bribeAmount))
        .toString()
    );
    expect(updateCount).to.equal(1);

    program.removeEventListener(listener);

    await provider.connection.confirmTransaction(
      await program.methods
        .claimBribe()
        .accounts(
          getClaimBribeAccounts(
            forestKey,
            treeKey,
            nodeKeys[0],
            noteKeys[0],
            voteMint,
            user1.publicKey
          )
        )
        .signers([user1])
        .rpc({ skipPreflight: true })
    );

    expect(
      (
        await getAccount(
          provider.connection,
          getAssociatedTokenAddressSync(voteMint, user1.publicKey)
        )
      ).amount.toString()
    ).to.equal(balanceBefore.toString());
  });
});
