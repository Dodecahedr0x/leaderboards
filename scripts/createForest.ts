import * as anchor from "@project-serum/anchor";

import {
  DIP_PROGRAM_ID,
  DipIdl,
  DippiesIndexProtocol,
  getCreateForestAccounts,
  getForestAddress,
} from "../ts";

import { Program } from "@project-serum/anchor";

const DIPPIES_TOKEN = new anchor.web3.PublicKey(
  "DjPH6mVyLgeLc3dEF4bFTdLLzYHgA2gNYVAg6D4vPaxh"
);

const admin = new anchor.web3.PublicKey(
  "UuGEwN9aeh676ufphbavfssWVxH7BJCqacq1RYhco8e"
);

export default async function main() {
  const provider = anchor.AnchorProvider.env();
  let program = new Program<DippiesIndexProtocol>(
    DipIdl as any,
    DIP_PROGRAM_ID,
    provider
  );
  console.log("Signer's key:", provider.publicKey.toString());

  const treeCreationFee = new anchor.BN(1000000);

  const forestKey = getForestAddress(admin);

  await provider.connection.confirmTransaction(
    await program.methods
      .createForest(admin, admin, treeCreationFee)
      .accounts(
        getCreateForestAccounts(
          admin,
          DIPPIES_TOKEN,
          program.provider.publicKey
        )
      )
      .rpc({ skipPreflight: true })
  );

  console.log("Forest:", forestKey.toString());
}

main();
