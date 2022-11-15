import * as anchor from "@project-serum/anchor";

import {
  MINT_SIZE,
  createAssociatedTokenAccountInstruction,
  createInitializeMint2Instruction,
  createInitializeMintInstruction,
  createMint,
  createMintToCheckedInstruction,
  createMintToInstruction,
  getAssociatedTokenAddress,
  getAssociatedTokenAddressSync,
  getMinimumBalanceForRentExemptMint,
} from "@solana/spl-token";

import { SystemProgram } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@project-serum/anchor/dist/cjs/utils/token";

const AUTHORITY_SEED = "authority";
const COLLECTION_SEED = "collection";
const COLLECTION_MINT_SEED = "collection-mint";

const DIPPIES_KEY = new anchor.web3.PublicKey(
  "UuGEwN9aeh676ufphbavfssWVxH7BJCqacq1RYhco8e"
);
const DIPPIES_COLLECTION_MINT = new anchor.web3.PublicKey(
  "318p2nhXSiKSPhsQhCtBL1fXNgjUUGPAXG5dbQqSCEpw"
);
const DIPPIES_DAO_KEY = new anchor.web3.PublicKey(
  "3h2CFnu8w7NRemnX9ybVeXsXAP3agkMuC1Kz8TnERYUi"
);

export class AccountMetaData {
  pubkey: anchor.web3.PublicKey;
  isSigner: boolean;
  isWritable: boolean;

  constructor(args: {
    pubkey: anchor.web3.PublicKey;
    isSigner: boolean;
    isWritable: boolean;
  }) {
    this.pubkey = args.pubkey;
    this.isSigner = !!args.isSigner;
    this.isWritable = !!args.isWritable;
  }
}

export class InstructionData {
  programId: anchor.web3.PublicKey;
  accounts: AccountMetaData[];
  data: Uint8Array;

  constructor(args: {
    programId: anchor.web3.PublicKey;
    accounts: AccountMetaData[];
    data: Uint8Array;
  }) {
    this.programId = args.programId;
    this.accounts = args.accounts;
    this.data = args.data;
  }
}

export default async function main() {
  const provider = anchor.AnchorProvider.env();
  console.log("Signer's key:", provider.publicKey.toString());

  const mint = anchor.web3.Keypair.generate();

  const lamports = await getMinimumBalanceForRentExemptMint(
    provider.connection
  );
  await provider.sendAndConfirm(
    new anchor.web3.Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: provider.publicKey,
        newAccountPubkey: mint.publicKey,
        space: MINT_SIZE,
        lamports,
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeMintInstruction(
        mint.publicKey,
        6,
        provider.publicKey,
        provider.publicKey,
        TOKEN_PROGRAM_ID
      ),
      createAssociatedTokenAccountInstruction(
        provider.publicKey,
        getAssociatedTokenAddressSync(mint.publicKey, provider.publicKey),
        provider.publicKey,
        mint.publicKey
      ),
      createMintToInstruction(
        mint.publicKey,
        getAssociatedTokenAddressSync(mint.publicKey, provider.publicKey),
        provider.publicKey,
        10 ** 10
      )
    ),
    [mint]
  );

  console.log("Mint:", mint.publicKey.toString());
}

main();
