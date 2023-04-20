import * as anchor from "@project-serum/anchor";

import { createKeypairs, expectRevert, mintNft, mintToken } from "./utils";
import {
  getAccount,
  getAssociatedTokenAddressSync,
  getOrCreateAssociatedTokenAccount,
  transfer,
} from "@solana/spl-token";
import {
  getClaimBribeAccounts,
  getCloseStakeAccounts,
  getCreateEntryAccounts,
  getCreateLeaderboardAccounts,
  getCreateStakeDepositAccounts,
  getSetBribeAccounts,
  getSwapEntriesAccounts,
  getUpdateStakeAccounts,
} from "../ts";
import {
  getEntryAddress,
  getLeaderboardAddress,
  getStakeDepositAddress,
} from "../ts/pda";

import { BN } from "bn.js";
import { Leaderboards } from "../ts/leaderboards";
import { Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { expect } from "chai";

describe("Leaderboards", () => {
  const provider = anchor.getProvider();
  const connection = provider.connection;
  const program = anchor.workspace.Leaderboards as Program<Leaderboards>;
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

    const entriesKey = Array(5)
      .fill(0)
      .map((_, i) => getEntryAddress(leaderboardId, i));

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
            rank: 0,
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
            rank: 0,
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
            rank: 0,
          })
        )
        .rpc({ skipPreflight: true })
    );

    await expectRevert(program.account.stakeDeposit.fetch(stakeDepositKey));

    // Stake on a note and then upgrade the note
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
    await connection.confirmTransaction(
      await program.methods
        .updateStake(stake)
        .accounts(
          getUpdateStakeAccounts({
            id: leaderboardId,
            voteMint,
            rank: 0,
            staker: stakeholder1.publicKey,
          })
        )
        .signers([stakeholder1])
        .rpc({ skipPreflight: true })
    );

    // Create a new entry, stake double the amount and swap it with the previous one
    await connection.confirmTransaction(
      await program.methods
        .createEntry()
        .accounts(
          getCreateEntryAccounts({
            id: leaderboardId,
            admin: feeEarner.publicKey,
            adminMint: adminToken.mint,
            voteMint,
            contentMint: contentMints[1],
            payer: stakeholder1.publicKey,
            rank: 1,
          })
        )
        .signers([stakeholder1])
        .rpc({ skipPreflight: true })
    );
    await connection.confirmTransaction(
      await program.methods
        .createStakeDeposit()
        .accounts(
          getCreateStakeDepositAccounts({
            id: leaderboardId,
            voteMint,
            rank: 1,
            staker: stakeholder1.publicKey,
            payer: provider.publicKey,
          })
        )
        .rpc({ skipPreflight: true })
    );
    await connection.confirmTransaction(
      await program.methods
        .updateStake(stake.mul(new BN(2)))
        .accounts(
          getUpdateStakeAccounts({
            id: leaderboardId,
            voteMint,
            rank: 1,
            staker: stakeholder1.publicKey,
          })
        )
        .signers([stakeholder1])
        .rpc({ skipPreflight: true })
    );
    await connection.confirmTransaction(
      await program.methods
        .swapEntries()
        .accounts(
          getSwapEntriesAccounts({
            id: leaderboardId,
            payer: provider.publicKey,
            sourceRank: 1,
            destinationRank: 0,
          })
        )
        .rpc({ skipPreflight: true })
    );

    entryAccount = await program.account.entry.fetch(
      getEntryAddress(leaderboardId, 0)
    );
    expect(entryAccount.content.stake.toString()).to.equal(
      stake.mul(new BN(2)).toString()
    );
    expect(entryAccount.content.contentMint.toString()).to.equal(
      contentMints[1].toString()
    );

    // Bribe and claim it
    const bribeAmount = new anchor.BN(10000);
    let balanceBefore = (
      await getAccount(
        connection,
        getAssociatedTokenAddressSync(voteMint, stakeholder1.publicKey)
      )
    ).amount;
    await connection.confirmTransaction(
      await program.methods
        .setBribe(bribeAmount)
        .accounts(
          getSetBribeAccounts({
            id: leaderboardId,
            rank: 0,
            briber: stakeholder1.publicKey,
            bribeMint: voteMint,
          })
        )
        .signers([stakeholder1])
        .rpc({ skipPreflight: true })
    );

    expect(
      (
        await getAccount(
          provider.connection,
          getAssociatedTokenAddressSync(voteMint, stakeholder1.publicKey)
        )
      ).amount.toString()
    ).to.equal(
      new anchor.BN(balanceBefore.toString())
        .sub(new anchor.BN(bribeAmount))
        .toString()
    );

    await provider.connection.confirmTransaction(
      await program.methods
        .claimBribe()
        .accounts(
          getClaimBribeAccounts({
            id: leaderboardId,
            rank: 0,
            bribeMint: voteMint,
            staker: stakeholder1.publicKey,
            payer: provider.publicKey,
          })
        )
        .rpc({ skipPreflight: true })
    );

    expect(
      (
        await getAccount(
          provider.connection,
          getAssociatedTokenAddressSync(voteMint, stakeholder1.publicKey)
        )
      ).amount.toString()
    ).to.equal(balanceBefore.toString());
  });
});
