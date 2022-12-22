import * as anchor from "@project-serum/anchor";

import {
  createKeypairs,
  expectRevert,
  mintNft,
  mintToken,
  printAccounts,
} from "./utils";
import {
  getAccount,
  getAssociatedTokenAddressSync,
  getOrCreateAssociatedTokenAccount,
  transfer,
} from "@solana/spl-token";
import { getCreateEntryAccounts, getCreateLeaderboardAccounts } from "../ts";
// import {
//   getAttachNodeAccounts,
//   getAttachNoteAccounts,
//   getCreateNodeAccounts,
//   getCreateNoteAccounts,
// } from "../ts/account";
import { getEntryAddress, getLeaderboardAddress } from "../ts/pda";

import { DippiesIndexProtocol } from "../ts/dippies_index_protocol";
import DippiesIndexProtocolIdl from "../ts/dippies_index_protocol.json";
import { Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { expect } from "chai";

describe("Dippies Index Protocol", () => {
  let provider = anchor.getProvider();
  let program = anchor.workspace
    .DippiesIndexProtocol as Program<DippiesIndexProtocol>;
  let leaderboardId = PublicKey.default;
  let leaderboardCreator: anchor.web3.Keypair;
  let feeEarner = anchor.web3.Keypair.generate();
  let entriesCreator: anchor.web3.Keypair;
  let stakeholder1: anchor.web3.Keypair;
  let stakeholder2: anchor.web3.Keypair;
  let voteMint: PublicKey;
  let adminToken: { mint: PublicKey; metadata: PublicKey; edition: PublicKey };

  before(async () => {
    [leaderboardCreator, entriesCreator, stakeholder1, stakeholder2] =
      await createKeypairs(program.provider.connection, 4);
    provider = new anchor.AnchorProvider(
      program.provider.connection,
      new anchor.Wallet(leaderboardCreator),
      {}
    );
    program = new Program<DippiesIndexProtocol>(
      DippiesIndexProtocolIdl as any,
      program.programId,
      provider
    );
    voteMint = (
      await mintToken(provider, leaderboardCreator, stakeholder1.publicKey)
    ).mint;
    adminToken = await mintNft(
      provider,
      "TEST",
      leaderboardCreator,
      feeEarner.publicKey
    );

    await transfer(
      provider.connection,
      stakeholder1,
      (
        await getOrCreateAssociatedTokenAccount(
          provider.connection,
          stakeholder1,
          voteMint,
          stakeholder1.publicKey
        )
      ).address,
      (
        await getOrCreateAssociatedTokenAccount(
          provider.connection,
          stakeholder1,
          voteMint,
          entriesCreator.publicKey
        )
      ).address,
      stakeholder1.publicKey,
      10 ** 6
    );
  });

  it("Create a entry and win a node auction", async () => {
    const entryCreationFee = new anchor.BN(1000);

    const leaderboardKey = getLeaderboardAddress(leaderboardId);

    await provider.connection.confirmTransaction(
      await program.methods
        .createLeaderboard(leaderboardId, entryCreationFee)
        .accounts(
          getCreateLeaderboardAccounts(
            leaderboardId,
            voteMint,
            leaderboardCreator.publicKey,
            feeEarner.publicKey,
            adminToken.mint
          )
        )
        .signers([leaderboardCreator])
        .rpc({ skipPreflight: true })
    );

    let leaderboardAccount = await program.account.leaderboard.fetch(
      leaderboardKey
    );
    console.log(leaderboardAccount);
    expect(leaderboardAccount.id.toString()).to.equal(leaderboardId.toString());
    expect(leaderboardAccount.voteMint.toString()).to.equal(
      voteMint.toString()
    );
    expect(leaderboardAccount.adminMint.toString()).to.equal(
      adminToken.mint.toString()
    );
    expect(leaderboardAccount.entryCreationFee.toString()).to.equal(
      entryCreationFee.toString()
    );
    expect(leaderboardAccount.entries.toString()).to.equal("0");

    const contentMints = [
      (await mintToken(provider, leaderboardCreator, stakeholder1.publicKey))
        .mint,
    ];

    await provider.connection.confirmTransaction(
      await program.methods
        .createEntry()
        .accounts(
          getCreateEntryAccounts(
            leaderboardId,
            feeEarner.publicKey,
            adminToken.mint,
            voteMint,
            contentMints[0],
            entriesCreator.publicKey,
            0
          )
        )
        .signers([entriesCreator])
        .rpc({ skipPreflight: true })
    );

    expect(
      (
        await getAccount(
          provider.connection,
          getAssociatedTokenAddressSync(voteMint, feeEarner.publicKey)
        )
      ).amount.toString()
    ).to.equal(entryCreationFee.toString());

    const entryKey = getEntryAddress(leaderboardId, 0);

    let entryAccount = await program.account.entry.fetch(entryKey);
    expect(entryAccount.leaderboard.toString()).to.equal(
      leaderboardKey.toString()
    );
    expect(entryAccount.content.toString()).to.equal(
      contentMints[0].toString()
    );

    // // Stake on a note of a child node and then unstake
    // const stake = new anchor.BN(1000);
    // const user1Program = new Program(
    //   program.idl,
    //   program.programId,
    //   new anchor.AnchorProvider(
    //     program.provider.connection,
    //     new anchor.Wallet(user1),
    //     {
    //       skipPreflight: true,
    //     }
    //   )
    // );
    // const stakeStateKey = getStakeAddress(noteKeys[0], user1.publicKey);

    // await provider.connection.confirmTransaction(
    //   await program.methods
    //     .createStake()
    //     .accounts(
    //       getCreateStakeAccounts(
    //         leaderboardKey,
    //         voteMint,
    //         entryKey,
    //         nodeKeys[0],
    //         noteKeys[0],
    //         user1.publicKey
    //       )
    //     )
    //     .signers([user1])
    //     .rpc({ skipPreflight: true })
    // );

    // let stakeAccount = await user1Program.account.stakeState.fetch(
    //   stakeStateKey
    // );
    // expect(stakeAccount.stake.toString()).to.equal("0");

    // await provider.connection.confirmTransaction(
    //   await program.methods
    //     .updateStake(stake)
    //     .accounts(
    //       getUpdateStakeAccounts(
    //         leaderboardKey,
    //         voteMint,
    //         entryKey,
    //         nodeKeys[0],
    //         noteKeys[0],
    //         user1.publicKey
    //       )
    //     )
    //     .signers([user1])
    //     .rpc({ skipPreflight: true })
    // );
    // const timeBefore = await provider.connection.getBlockTime(
    //   await provider.connection.getSlot()
    // );

    // stakeAccount = await user1Program.account.stakeState.fetch(stakeStateKey);
    // expect(stakeAccount.stake.toString()).to.equal(stake.toString());

    // await provider.connection.confirmTransaction(
    //   await program.methods
    //     .updateStake(stake.neg())
    //     .accounts(
    //       getUpdateStakeAccounts(
    //         leaderboardKey,
    //         voteMint,
    //         entryKey,
    //         nodeKeys[0],
    //         noteKeys[0],
    //         user1.publicKey
    //       )
    //     )
    //     .signers([user1])
    //     .rpc({ skipPreflight: true })
    // );

    // stakeAccount = await user1Program.account.stakeState.fetch(stakeStateKey);
    // expect(stakeAccount.stake.toString()).to.equal("0");
    // expect(stakeAccount.accumulatedStake.toString()).to.equal(
    //   stake
    //     .mul(
    //       new anchor.BN(
    //         (await provider.connection.getBlockTime(
    //           await provider.connection.getSlot()
    //         )) - timeBefore
    //       )
    //     )
    //     .toString()
    // );

    // await provider.connection.confirmTransaction(
    //   await program.methods
    //     .closeStake()
    //     .accounts(
    //       getCloseStakeAccounts(
    //         leaderboardKey,
    //         entryKey,
    //         noteKeys[0],
    //         user1.publicKey
    //       )
    //     )
    //     .signers([user1])
    //     .rpc({ skipPreflight: true })
    // );

    // await expectRevert(user1Program.account.stakeState.fetch(stakeStateKey));

    // // Stake on a note and then upgrade the note
    // await provider.connection.confirmTransaction(
    //   await program.methods
    //     .createStake()
    //     .accounts(
    //       getCreateStakeAccounts(
    //         leaderboardKey,
    //         voteMint,
    //         entryKey,
    //         nodeKeys[0],
    //         noteKeys[0],
    //         user1.publicKey
    //       )
    //     )
    //     .signers([user1])
    //     .rpc({ skipPreflight: true })
    // );
    // await provider.connection.confirmTransaction(
    //   await program.methods
    //     .updateStake(stake)
    //     .accounts(
    //       getUpdateStakeAccounts(
    //         leaderboardKey,
    //         voteMint,
    //         entryKey,
    //         nodeKeys[0],
    //         noteKeys[0],
    //         user1.publicKey
    //       )
    //     )
    //     .signers([user1])
    //     .rpc({ skipPreflight: true })
    // );

    // await provider.connection.confirmTransaction(
    //   await program.methods
    //     .moveNote()
    //     .accounts(
    //       getMoveNoteAccounts(
    //         leaderboardKey,
    //         entryKey,
    //         noteKeys[0],
    //         nodeKeys[0],
    //         rootNodeKey,
    //         program.provider.publicKey
    //       )
    //     )
    //     .rpc({ skipPreflight: true })
    // );

    // let noteAccount = await program.account.note.fetch(noteKeys[0]);
    // expect(noteAccount.parent.toString()).to.equal(rootNodeKey.toString());

    // // Replace a note on the root
    // await provider.connection.confirmTransaction(
    //   await program.methods
    //     .replaceNote()
    //     .accounts(
    //       getReplaceNoteAccounts(
    //         leaderboardKey,
    //         entryKey,
    //         rootNodeKey,
    //         noteKeys[0],
    //         rootNoteKeys[0],
    //         program.provider.publicKey
    //       )
    //     )
    //     .rpc({ skipPreflight: true })
    // );

    // // Bribe and claim it
    // let updateCount = 0;
    // const listener = program.addEventListener(
    //   "UpdatedBribe",
    //   (event: UpdatedBribeEvent, slot, sig) => {
    //     updateCount += 1;
    //   }
    // );
    // const bribeAmount = new anchor.BN(10000);
    // let balanceBefore = (
    //   await getAccount(
    //     provider.connection,
    //     getAssociatedTokenAddressSync(voteMint, user1.publicKey)
    //   )
    // ).amount;
    // await provider.connection.confirmTransaction(
    //   await program.methods
    //     .setBribe(bribeAmount)
    //     .accounts(
    //       getSetBribeAccounts(
    //         leaderboardKey,
    //         entryKey,
    //         nodeKeys[0],
    //         noteKeys[0],
    //         voteMint,
    //         user1.publicKey
    //       )
    //     )
    //     .signers([user1])
    //     .rpc({ skipPreflight: true })
    // );

    // expect(
    //   (
    //     await getAccount(
    //       provider.connection,
    //       getAssociatedTokenAddressSync(voteMint, user1.publicKey)
    //     )
    //   ).amount.toString()
    // ).to.equal(
    //   new anchor.BN(balanceBefore.toString())
    //     .sub(new anchor.BN(bribeAmount))
    //     .toString()
    // );
    // expect(updateCount).to.equal(1);

    // program.removeEventListener(listener);

    // await provider.connection.confirmTransaction(
    //   await program.methods
    //     .claimBribe()
    //     .accounts(
    //       getClaimBribeAccounts(
    //         leaderboardKey,
    //         entryKey,
    //         nodeKeys[0],
    //         noteKeys[0],
    //         voteMint,
    //         user1.publicKey
    //       )
    //     )
    //     .signers([user1])
    //     .rpc({ skipPreflight: true })
    // );

    // expect(
    //   (
    //     await getAccount(
    //       provider.connection,
    //       getAssociatedTokenAddressSync(voteMint, user1.publicKey)
    //     )
    //   ).amount.toString()
    // ).to.equal(balanceBefore.toString());
  });
});
