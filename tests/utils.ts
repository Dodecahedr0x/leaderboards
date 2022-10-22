import * as anchor from "@project-serum/anchor";

import { createAssociatedTokenAccount, createMint, mintToChecked } from "@solana/spl-token"

import { PROGRAM_ID as METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata"
import { PublicKey } from '@solana/web3.js';
import { assert } from "chai";

export const provider = anchor.getProvider() as anchor.AnchorProvider;

export const createKeypair = async (provider: anchor.Provider) => {
  const keypair = new anchor.web3.Keypair();
  const txn = await provider.connection.requestAirdrop(
    keypair.publicKey,
    10 * anchor.web3.LAMPORTS_PER_SOL
  );
  await provider.connection.confirmTransaction(txn);
  return keypair;
};

export const createKeypairs = async (provider: anchor.Provider, n: number) => {
  return await Promise.all(Array(n).fill(0).map(e => createKeypair(provider)));
};

export const getTokenMetadata = (tokenMint: anchor.web3.PublicKey) => {
  const [tokenMetadataAddress, bump] =
    anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        METADATA_PROGRAM_ID.toBuffer(),
        tokenMint.toBuffer(),
      ],
      METADATA_PROGRAM_ID
    );
  return tokenMetadataAddress;
};

export const printAccounts = (accounts: { [key: string]: PublicKey }) => {
  console.log(Object.entries(accounts).map(([k, v]) => [k, v.toString()]))
}

export const mintToken = async (
  provider: anchor.Provider,
  creator: anchor.web3.Keypair,
  destination: anchor.web3.PublicKey,
) => {
  const mint = await createMint(
    provider.connection,
    creator,
    creator.publicKey,
    null,
    0
  );

  const tokenAccount = await createAssociatedTokenAccount(
    provider.connection,
    creator,
    mint,
    destination
  );

  await mintToChecked(
    provider.connection,
    creator,
    mint,
    tokenAccount,
    creator.publicKey,
    1,
    0
  );

  return { mint, tokenAccount }
}

export const expectRevert = async (promise: Promise<any>) => {
  try {
    await promise
    assert(false)
  } catch (err) {
    console.log(err)
  }
}