import * as anchor from "@project-serum/anchor";

import {
  PROGRAM_ID as METADATA_PROGRAM_ID,
  createCreateMasterEditionV3Instruction,
  createCreateMetadataAccountInstruction,
  createCreateMetadataAccountV2Instruction,
  createCreateMetadataAccountV3Instruction,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  createAssociatedTokenAccount,
  createMint,
  mintTo,
  mintToChecked,
} from "@solana/spl-token";

import { PublicKey } from "@solana/web3.js";
import { assert } from "chai";

export const provider = anchor.getProvider() as anchor.AnchorProvider;

export const createKeypair = async (connection: anchor.web3.Connection) => {
  const keypair = new anchor.web3.Keypair();
  const txn = await connection.requestAirdrop(
    keypair.publicKey,
    10 * anchor.web3.LAMPORTS_PER_SOL
  );
  await connection.confirmTransaction(txn);
  return keypair;
};

export const createKeypairs = async (
  connection: anchor.web3.Connection,
  n: number
) => {
  return await Promise.all(
    Array(n)
      .fill(0)
      .map((e) => createKeypair(connection))
  );
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
  console.log(Object.entries(accounts).map(([k, v]) => [k, v.toString()]));
};

export const mintToken = async (
  provider: anchor.Provider,
  creator: anchor.web3.Signer,
  destination: anchor.web3.PublicKey,
  decimals: number = 6
) => {
  const mint = await createMint(
    provider.connection,
    creator,
    creator.publicKey,
    null,
    decimals
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
    10 ** 8,
    decimals
  );
  return { mint, tokenAccount };
};

export const expectRevert = async (promise: Promise<any>) => {
  try {
    await promise;
    assert(false);
  } catch (err) {}
};

const getTokenEdition = async (tokenMint: anchor.web3.PublicKey) => {
  const [tokenMetadataAddress, bump] =
    await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        METADATA_PROGRAM_ID.toBuffer(),
        tokenMint.toBuffer(),
        Buffer.from("edition"),
      ],
      METADATA_PROGRAM_ID
    );
  return tokenMetadataAddress;
};

export const mintNft = async (
  provider: anchor.Provider,
  symbol: string,
  creator: anchor.web3.Keypair,
  destination: anchor.web3.PublicKey,
  collectionMint?: anchor.web3.PublicKey,
  sellerFeeBasisPoints: number = 10
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

  const transaction = new anchor.web3.Transaction();

  // Set Metadata
  const metadata = getTokenMetadata(mint);
  transaction.add(
    createCreateMetadataAccountV3Instruction(
      {
        metadata,
        mint,
        mintAuthority: creator.publicKey,
        updateAuthority: creator.publicKey,
        payer: creator.publicKey,
      },
      {
        createMetadataAccountArgsV3: {
          isMutable: false,
          data: {
            name: "Pretty Cool NFT",
            symbol,
            sellerFeeBasisPoints,
            uri: "https://pretty-cool-nft.xyz/metadata",
            creators: [
              {
                address: creator.publicKey,
                share: 100,
                verified: true,
              },
            ],
            collection: collectionMint
              ? { key: collectionMint, verified: false }
              : null,
            uses: null,
          },
          collectionDetails: null,
        },
      }
    )
  );

  // Create master edition
  const edition = await getTokenEdition(mint);
  transaction.add(
    createCreateMasterEditionV3Instruction(
      {
        edition,
        mint,
        updateAuthority: creator.publicKey,
        mintAuthority: creator.publicKey,
        payer: creator.publicKey,
        metadata,
      },
      { createMasterEditionArgs: { maxSupply: 0 } }
    )
  );

  // await provider.sendAndConfirm(transaction, [creator]);

  return { mint, metadata, edition };
};
