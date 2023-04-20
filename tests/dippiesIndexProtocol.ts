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
  getMint,
  getOrCreateAssociatedTokenAccount,
  transfer,
} from "@solana/spl-token";
import {
  getCloseStakeAccounts,
  getCreateEntryAccounts,
  getCreateLeaderboardAccounts,
  getCreateStakeDepositAccounts,
  getUpdateStakeAccounts,
} from "../ts";
// import {
//   getAttachNodeAccounts,
//   getAttachNoteAccounts,
//   getCreateNodeAccounts,
//   getCreateNoteAccounts,
// } from "../ts/account";
import {
  getEntryAddress,
  getLeaderboardAddress,
  getStakeDepositAddress,
} from "../ts/pda";

import { DippiesIndexProtocol } from "../ts/dippies_index_protocol";
import DippiesIndexProtocolIdl from "../ts/dippies_index_protocol.json";
import { Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { expect } from "chai";

describe("Dippies Index Protocol", () => {
  const provider = anchor.getProvider();
  const connection = provider.connection;
  const program = anchor.workspace
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
      await createKeypairs(connection, 4);
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
      connection,
      stakeholder1,
      (
        await getOrCreateAssociatedTokenAccount(
          connection,
          stakeholder1,
          voteMint,
          stakeholder1.publicKey
        )
      ).address,
      (
        await getOrCreateAssociatedTokenAccount(
          connection,
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

    console.log(await getMint(connection, adminToken.mint));
    await connection.confirmTransaction(
      await program.methods
        .createLeaderboard(leaderboardId, entryCreationFee)
        .accounts(
          getCreateLeaderboardAccounts({
            id: leaderboardId,
            voteMint,
            payer: provider.publicKey,
            admin: feeEarner.publicKey,
            adminMint: adminToken.mint,
          })
        )
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

    await connection.confirmTransaction(
      await program.methods
        .createEntry()
        .accounts(
          getCreateEntryAccounts({
            id: leaderboardId,
            admin: feeEarner.publicKey,
            adminMint: adminToken.mint,
            voteMint,
            contentMint: contentMints[0],
            payer: stakeholder1.publicKey,
            rank: 0,
          })
        )
        .signers([stakeholder1])
        .rpc({ skipPreflight: true })
    );

    expect(
      (
        await getAccount(
          connection,
          getAssociatedTokenAddressSync(voteMint, feeEarner.publicKey)
        )
      ).amount.toString()
    ).to.equal(entryCreationFee.toString());

    const entriesKey = [getEntryAddress(leaderboardId, 0)];

    let entryAccount = await program.account.entry.fetch(entriesKey[0]);
    expect(entryAccount.leaderboard.toString()).to.equal(
      leaderboardKey.toString()
    );
    expect(entryAccount.rank.toString()).to.equal("0");
    expect(entryAccount.content.contentMint.toString()).to.equal(
      contentMints[0].toString()
    );
    expect(entryAccount.content.stake.toString()).to.equal("0");
    expect(entryAccount.content.lastUpdate.toString()).to.equal("0");
    expect(entryAccount.content.accumulatedStake.toString()).to.equal("0");

    // Stake on a note of a child node and then unstake
    await connection.confirmTransaction(
      await program.methods
        .createStakeDeposit()
        .accounts(
          getCreateStakeDepositAccounts({
            id: leaderboardId,
            voteMint,
            rank: 0,
            staker: stakeholder1.publicKey,
            payer: provider.publicKey,
          })
        )
        .rpc({ skipPreflight: true })
    );

    const stake = new anchor.BN(1000);
    const stakeDepositKey = getStakeDepositAddress(
      entriesKey[0],
      stakeholder1.publicKey
    );
    let stakeDepositAccount = await program.account.stakeDeposit.fetch(
      stakeDepositKey
    );
    expect(stakeDepositAccount.stake.toString()).to.equal("0");

    await connection.confirmTransaction(
      await program.methods
        .updateStake(stake)
        .accounts(
          getUpdateStakeAccounts({
            id: leaderboardId,
            voteMint,
            entry: entriesKey[0],
            staker: stakeholder1.publicKey,
          })
        )
        .signers([stakeholder1])
        .rpc({ skipPreflight: true })
    );
    const timeBefore = await provider.connection.getBlockTime(
      await provider.connection.getSlot()
    );

    stakeDepositAccount = await program.account.stakeDeposit.fetch(
      stakeDepositKey
    );
    expect(stakeDepositAccount.stake.toString()).to.equal(stake.toString());

    await connection.confirmTransaction(
      await program.methods
        .updateStake(stake.neg())
        .accounts(
          getUpdateStakeAccounts({
            id: leaderboardId,
            voteMint,
            entry: entriesKey[0],
            staker: stakeholder1.publicKey,
          })
        )
        .signers([stakeholder1])
        .rpc({ skipPreflight: true })
    );

    stakeDepositAccount = await program.account.stakeDeposit.fetch(
      stakeDepositKey
    );
    expect(stakeDepositAccount.stake.toString()).to.equal("0");
    expect(stakeDepositAccount.accumulatedStake.toString()).to.equal(
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
        .closeStakeDeposit()
        .accounts(
          getCloseStakeAccounts({
            id: leaderboardId,
            staker: stakeholder1.publicKey,
            payer: provider.publicKey,
            entry: entriesKey[0],
          })
        )
        .rpc({ skipPreflight: true })
    );

    await expectRevert(program.account.stakeDeposit.fetch(stakeDepositKey));

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
