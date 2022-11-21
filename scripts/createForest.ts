import * as anchor from "@project-serum/anchor";

import { DipForest } from "../ts";

const DIPPIES_TOKEN = new anchor.web3.PublicKey(
  "DjPH6mVyLgeLc3dEF4bFTdLLzYHgA2gNYVAg6D4vPaxh"
);

const admin = new anchor.web3.PublicKey(
  "UuGEwN9aeh676ufphbavfssWVxH7BJCqacq1RYhco8e"
);

export default async function main() {
  const provider = anchor.AnchorProvider.env();
  console.log("Signer's key:", provider.publicKey.toString());

  const forest = new DipForest(
    provider.publicKey,
    DIPPIES_TOKEN,
    DIPPIES_TOKEN,
    admin,
    new anchor.BN(10 ** 10)
  );

  await provider.sendAndConfirm(
    new anchor.web3.Transaction().add(forest.instruction.createForest())
  );

  console.log("Forest:", forest.forestKey.toString());
}

main();
