import { Accounts, Event, IdlAccounts } from "@project-serum/anchor";

import { DippiesIndexProtocol } from "./";

export type Leaderboard = IdlAccounts<DippiesIndexProtocol>["leaderboard"];
export type Entry = IdlAccounts<DippiesIndexProtocol>["entry"];
export type StakeDeposit = IdlAccounts<DippiesIndexProtocol>["stakeDeposit"];

export type CreateLeaderboardAccounts = Partial<
  Accounts<DippiesIndexProtocol["instructions"]["0"]>
>["createLeaderboard"];
export type SetLeaderboardFeeAccounts = Partial<
  Accounts<DippiesIndexProtocol["instructions"]["1"]>
>["setLeaderboardFee"];
export type CreateEntryAccounts = Partial<
  Accounts<DippiesIndexProtocol["instructions"]["2"]>
>["createEntry"];
export type SwapEntriesAccounts = Partial<
  Accounts<DippiesIndexProtocol["instructions"]["3"]>
>["swapEntries"];
export type CreateStakeDepositAccounts = Partial<
  Accounts<DippiesIndexProtocol["instructions"]["4"]>
>["createStakeDeposit"];
export type UpdateStakeAccounts = Partial<
  Accounts<DippiesIndexProtocol["instructions"]["5"]>
>["updateStake"];
export type CloseStakeDepositAccounts = Partial<
  Accounts<DippiesIndexProtocol["instructions"]["6"]>
>["closeStakeDeposit"];
export type SetBribeAccounts = Partial<
  Accounts<DippiesIndexProtocol["instructions"]["7"]>
>["setBribe"];
export type ClaimBribeAccounts = Partial<
  Accounts<DippiesIndexProtocol["instructions"]["8"]>
>["claimBribe"];

export type NewTreeEvent = Partial<
  Event<DippiesIndexProtocol["events"]["0"]>["data"]
>;
export type NewNodeEvent = Partial<
  Event<DippiesIndexProtocol["events"]["1"]>["data"]
>;
export type NewAttachedNoteEvent = Partial<
  Event<DippiesIndexProtocol["events"]["2"]>["data"]
>;
export type UpdatedStakeEvent = Partial<
  Event<DippiesIndexProtocol["events"]["3"]>["data"]
>;
export type UpdatedBribeEvent = Partial<
  Event<DippiesIndexProtocol["events"]["4"]>["data"]
>;
