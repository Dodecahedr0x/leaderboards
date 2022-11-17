import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface StakeStateFields {
  staker: PublicKey
  stake: BN
  note: PublicKey
}

export interface StakeStateJSON {
  staker: string
  stake: string
  note: string
}

export class StakeState {
  readonly staker: PublicKey
  readonly stake: BN
  readonly note: PublicKey

  static readonly discriminator = Buffer.from([
    108, 10, 236, 72, 1, 88, 133, 92,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey("staker"),
    borsh.u64("stake"),
    borsh.publicKey("note"),
  ])

  constructor(fields: StakeStateFields) {
    this.staker = fields.staker
    this.stake = fields.stake
    this.note = fields.note
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<StakeState | null> {
    const info = await c.getAccountInfo(address)

    if (info === null) {
      return null
    }
    if (!info.owner.equals(PROGRAM_ID)) {
      throw new Error("account doesn't belong to this program")
    }

    return this.decode(info.data)
  }

  static async fetchMultiple(
    c: Connection,
    addresses: PublicKey[]
  ): Promise<Array<StakeState | null>> {
    const infos = await c.getMultipleAccountsInfo(addresses)

    return infos.map((info) => {
      if (info === null) {
        return null
      }
      if (!info.owner.equals(PROGRAM_ID)) {
        throw new Error("account doesn't belong to this program")
      }

      return this.decode(info.data)
    })
  }

  static decode(data: Buffer): StakeState {
    if (!data.slice(0, 8).equals(StakeState.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = StakeState.layout.decode(data.slice(8))

    return new StakeState({
      staker: dec.staker,
      stake: dec.stake,
      note: dec.note,
    })
  }

  toJSON(): StakeStateJSON {
    return {
      staker: this.staker.toString(),
      stake: this.stake.toString(),
      note: this.note.toString(),
    }
  }

  static fromJSON(obj: StakeStateJSON): StakeState {
    return new StakeState({
      staker: new PublicKey(obj.staker),
      stake: new BN(obj.stake),
      note: new PublicKey(obj.note),
    })
  }
}
