import * as anchor from "@project-serum/anchor";

import { TreeDeaRoot } from "../ts";

const DIPPIES_TOKEN = new anchor.web3.PublicKey(
  "DjPH6mVyLgeLc3dEF4bFTdLLzYHgA2gNYVAg6D4vPaxh"
);

export default async function main() {
  const provider = anchor.AnchorProvider.env();
  console.log("Signer's key:", provider.publicKey.toString());

  const root = new TreeDeaRoot(
    provider.publicKey,
    provider.publicKey,
    DIPPIES_TOKEN
  );

  await provider.sendAndConfirm(
    new anchor.web3.Transaction().add(root.instruction.createRoot())
  );

  console.log("Root:", root.rootKey.toString());
}

main();
