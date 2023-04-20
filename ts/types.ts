import { Accounts, Event, IdlAccounts } from "@project-serum/anchor";

import { Leaderboards } from "./";

export type Leaderboard = IdlAccounts<Leaderboards>["leaderboard"];
export type Entry = IdlAccounts<Leaderboards>["entry"];
export type StakeDeposit = IdlAccounts<Leaderboards>["stakeDeposit"];

export type CreateLeaderboardAccounts = Partial<
  Accounts<Leaderboards["instructions"]["0"]>
>["createLeaderboard"];
export type SetLeaderboardFeeAccounts = Partial<
  Accounts<Leaderboards["instructions"]["1"]>
>["setLeaderboardFee"];
export type CreateEntryAccounts = Partial<
  Accounts<Leaderboards["instructions"]["2"]>
>["createEntry"];
export type SwapEntriesAccounts = Partial<
  Accounts<Leaderboards["instructions"]["3"]>
>["swapEntries"];
export type CreateStakeDepositAccounts = Partial<
  Accounts<Leaderboards["instructions"]["4"]>
>["createStakeDeposit"];
export type UpdateStakeAccounts = Partial<
  Accounts<Leaderboards["instructions"]["5"]>
>["updateStake"];
export type CloseStakeDepositAccounts = Partial<
  Accounts<Leaderboards["instructions"]["6"]>
>["closeStakeDeposit"];
export type SetBribeAccounts = Partial<
  Accounts<Leaderboards["instructions"]["7"]>
>["setBribe"];
export type ClaimBribeAccounts = Partial<
  Accounts<Leaderboards["instructions"]["8"]>
>["claimBribe"];

export type NewTreeEvent = Partial<Event<Leaderboards["events"]["0"]>["data"]>;
export type NewNodeEvent = Partial<Event<Leaderboards["events"]["1"]>["data"]>;
export type NewAttachedNoteEvent = Partial<
  Event<Leaderboards["events"]["2"]>["data"]
>;
export type UpdatedStakeEvent = Partial<
  Event<Leaderboards["events"]["3"]>["data"]
>;
export type UpdatedBribeEvent = Partial<
  Event<Leaderboards["events"]["4"]>["data"]
>;
