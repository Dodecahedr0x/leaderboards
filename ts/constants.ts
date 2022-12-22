import { PublicKey } from "@solana/web3.js";
import idl from "./dippies_index_protocol.json";

export const DIP_PROGRAM_ID: PublicKey = new PublicKey(
  "C2WzwqdpPaiRP6H9C11331nLhyKtq2WA7hse25ajvJyb"
);

export const LEADERBOARD_AUTHORITY_SEED = idl.constants[0].value.replaceAll(
  '"',
  ""
);
export const LEADERBOARD_SEED = idl.constants[1].value.replaceAll('"', "");
export const ENTRY_SEED = idl.constants[2].value.replaceAll('"', "");
export const STAKE_SEED = idl.constants[3].value.replaceAll('"', "");
export const BRIBE_SEED = idl.constants[4].value.replaceAll('"', "");
export const BRIBE_CLAIM_SEED = idl.constants[5].value.replaceAll('"', "");
