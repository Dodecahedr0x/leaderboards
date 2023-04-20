export type DippiesIndexProtocol = {
  "version": "0.1.0",
  "name": "dippies_index_protocol",
  "constants": [
    {
      "name": "LEADERBOARD_AUTHORITY_SEED",
      "type": "string",
      "value": "\"leaderboard-authority\""
    },
    {
      "name": "LEADERBOARD_SEED",
      "type": "string",
      "value": "\"leaderboard\""
    },
    {
      "name": "ENTRY_SEED",
      "type": "string",
      "value": "\"entry\""
    },
    {
      "name": "STAKE_SEED",
      "type": "string",
      "value": "\"stake\""
    },
    {
      "name": "BRIBE_SEED",
      "type": "string",
      "value": "\"bribe\""
    },
    {
      "name": "BRIBE_CLAIM_SEED",
      "type": "string",
      "value": "\"bribe-claim\""
    }
  ],
  "instructions": [
    {
      "name": "createLeaderboard",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "leaderboardAuthority",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The account that manages tokens"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "leaderboard-authority"
              },
              {
                "kind": "arg",
                "type": "publicKey",
                "path": "id"
              }
            ]
          }
        },
        {
          "name": "leaderboard",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The leaderboard"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "leaderboard"
              },
              {
                "kind": "arg",
                "type": "publicKey",
                "path": "id"
              }
            ]
          }
        },
        {
          "name": "adminMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The token representing the leaderboard",
            "Its holder has admin authority over the leaderboard"
          ]
        },
        {
          "name": "voteMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The token used to vote on the leaderboard"
          ]
        },
        {
          "name": "voteAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The account storing vote tokens"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Common Solana programs"
          ]
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "publicKey"
        },
        {
          "name": "entryCreationFee",
          "type": "u64"
        }
      ]
    },
    {
      "name": "setLeaderboardFee",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "adminMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The token representing the leaderboard",
            "Its holder has admin authority over the leaderboard"
          ]
        },
        {
          "name": "adminMintAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "leaderboard",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The forest"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "leaderboard"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Leaderboard",
                "path": "leaderboard.id"
              }
            ]
          },
          "relations": [
            "admin_mint"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Common Solana programs"
          ]
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "entryCreationFee",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createEntry",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "adminMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The token representing the leaderboard",
            "Its holder has admin authority over the leaderboard"
          ]
        },
        {
          "name": "adminMintAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "leaderboardAuthority",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The account that manages tokens"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "leaderboard-authority"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Leaderboard",
                "path": "leaderboard.id"
              }
            ]
          }
        },
        {
          "name": "leaderboard",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The leaderboard"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "leaderboard"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Leaderboard",
                "path": "leaderboard.id"
              }
            ]
          },
          "relations": [
            "admin_mint",
            "vote_mint"
          ]
        },
        {
          "name": "voteMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Mint of the token used to stake"
          ]
        },
        {
          "name": "creatorAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "adminVoteAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "entry",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "entry"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Leaderboard",
                "path": "leaderboard.id"
              },
              {
                "kind": "account",
                "type": "u32",
                "account": "Leaderboard",
                "path": "leaderboard.entries"
              }
            ]
          }
        },
        {
          "name": "contentMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The token representing the entry"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Common Solana programs"
          ]
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "swapEntries",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "leaderboard",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The leaderboard"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "leaderboard"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Leaderboard",
                "path": "leaderboard.id"
              }
            ]
          }
        },
        {
          "name": "climbingEntry",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The incomming entry"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "entry"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Leaderboard",
                "path": "leaderboard.id"
              },
              {
                "kind": "account",
                "type": "u32",
                "account": "Entry",
                "path": "climbing_entry.rank"
              }
            ]
          }
        },
        {
          "name": "fallingEntry",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The outgoing entry",
            "It has to already be on the leaderboard"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "entry"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Leaderboard",
                "path": "leaderboard.id"
              },
              {
                "kind": "account",
                "type": "u32",
                "account": "Entry",
                "path": "falling_entry.rank"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Common Solana programs"
          ]
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "createStakeDeposit",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "staker",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "leaderboardAuthority",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The account that manages tokens"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "leaderboard-authority"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Leaderboard",
                "path": "leaderboard.id"
              }
            ]
          }
        },
        {
          "name": "leaderboard",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The leaderboard"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "leaderboard"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Leaderboard",
                "path": "leaderboard.id"
              }
            ]
          },
          "relations": [
            "vote_mint"
          ]
        },
        {
          "name": "voteMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The token used to vote"
          ]
        },
        {
          "name": "entry",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The entry staked on"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "entry"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Leaderboard",
                "path": "leaderboard.id"
              },
              {
                "kind": "account",
                "type": "u32",
                "account": "Entry",
                "path": "entry.rank"
              }
            ]
          }
        },
        {
          "name": "stakeDeposit",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The account storing vote tokens"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "stake"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Entry",
                "path": "entry"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "staker"
              }
            ]
          }
        },
        {
          "name": "stakerAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The account storing vote tokens of the staker"
          ]
        },
        {
          "name": "voteAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The account storing vote tokens"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Common Solana programs"
          ]
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "updateStake",
      "accounts": [
        {
          "name": "staker",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "leaderboardAuthority",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The account that manages tokens"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "leaderboard-authority"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Leaderboard",
                "path": "leaderboard.id"
              }
            ]
          }
        },
        {
          "name": "leaderboard",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The leaderboard"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "leaderboard"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Leaderboard",
                "path": "leaderboard.id"
              }
            ]
          },
          "relations": [
            "vote_mint"
          ]
        },
        {
          "name": "voteMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The token used to vote for nodes and tags"
          ]
        },
        {
          "name": "entry",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The entry"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "entry"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Leaderboard",
                "path": "leaderboard.id"
              },
              {
                "kind": "account",
                "type": "u32",
                "account": "Entry",
                "path": "entry.rank"
              }
            ]
          }
        },
        {
          "name": "stakeDeposit",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The state of the staker's deposit"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "stake"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Entry",
                "path": "entry"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "staker"
              }
            ]
          },
          "relations": [
            "staker"
          ]
        },
        {
          "name": "stakerAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The account storing vote tokens of the staker"
          ]
        },
        {
          "name": "voteAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The account storing vote tokens of the leaderboard"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Common Solana programs"
          ]
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "stake",
          "type": "i128"
        }
      ]
    },
    {
      "name": "closeStakeDeposit",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "staker",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "leaderboard",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The leaderboard"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "leaderboard"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Leaderboard",
                "path": "leaderboard.id"
              }
            ]
          }
        },
        {
          "name": "entry",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The entry"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "entry"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Leaderboard",
                "path": "leaderboard.id"
              },
              {
                "kind": "account",
                "type": "u32",
                "account": "Entry",
                "path": "entry.rank"
              }
            ]
          }
        },
        {
          "name": "stakeDeposit",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The state of the staker's deposit"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "stake"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Entry",
                "path": "entry"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "staker"
              }
            ]
          },
          "relations": [
            "staker"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Common Solana programs"
          ]
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "setBribe",
      "accounts": [
        {
          "name": "briber",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "leaderboardAuthority",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The account that manages tokens"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "leaderboard-authority"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Leaderboard",
                "path": "leaderboard.id"
              }
            ]
          }
        },
        {
          "name": "leaderboard",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The leaderboard"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "leaderboard"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Leaderboard",
                "path": "leaderboard.id"
              }
            ]
          }
        },
        {
          "name": "entry",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The entry"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "entry"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Leaderboard",
                "path": "leaderboard"
              },
              {
                "kind": "account",
                "type": "u32",
                "account": "Entry",
                "path": "entry.rank"
              }
            ]
          }
        },
        {
          "name": "bribe",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The bribe"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "bribe"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Entry",
                "path": "entry"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "bribe_mint"
              }
            ]
          }
        },
        {
          "name": "bribeMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The token used to bribe"
          ]
        },
        {
          "name": "briberAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The account paying the bribe"
          ]
        },
        {
          "name": "bribeAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The account storing the bribe"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Common Solana programs"
          ]
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "claimBribe",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "staker",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "leaderboardAuthority",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The account that manages tokens"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "leaderboard-authority"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Leaderboard",
                "path": "leaderboard.id"
              }
            ]
          }
        },
        {
          "name": "leaderboard",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "leaderboard"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Leaderboard",
                "path": "leaderboard.id"
              }
            ]
          }
        },
        {
          "name": "entry",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "entry"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Leaderboard",
                "path": "leaderboard.id"
              },
              {
                "kind": "account",
                "type": "u32",
                "account": "Entry",
                "path": "entry.rank"
              }
            ]
          }
        },
        {
          "name": "stakeState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The account storing vote tokens"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "stake"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Entry",
                "path": "entry"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "staker"
              }
            ]
          }
        },
        {
          "name": "bribe",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The bribe"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "bribe"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Entry",
                "path": "entry"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "bribe_mint"
              }
            ]
          }
        },
        {
          "name": "bribeClaim",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The bribe claim"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "bribe-claim"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Entry",
                "path": "entry"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "bribe_mint"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "staker"
              }
            ]
          }
        },
        {
          "name": "bribeMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The token used to bribe"
          ]
        },
        {
          "name": "stakerAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The account receiving the bribe"
          ]
        },
        {
          "name": "bribeAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The account storing the bribe"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Common Solana programs"
          ]
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "bribeClaim",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bribe",
            "docs": [
              "The bribe being claimed"
            ],
            "type": "publicKey"
          },
          {
            "name": "claimant",
            "docs": [
              "The claimant"
            ],
            "type": "publicKey"
          },
          {
            "name": "accumulatedStake",
            "docs": [
              "The accumulated shares at the last update"
            ],
            "type": "u64"
          },
          {
            "name": "lastUpdate",
            "docs": [
              "The last time the bribe was updated"
            ],
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "bribe",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "entry",
            "docs": [
              "The entry receiving the bribe"
            ],
            "type": "publicKey"
          },
          {
            "name": "bribeMint",
            "docs": [
              "The mint of the bribe"
            ],
            "type": "publicKey"
          },
          {
            "name": "amount",
            "docs": [
              "Claimable bribe amount"
            ],
            "type": "u64"
          },
          {
            "name": "accumulatedStake",
            "docs": [
              "The accumulated shares at the last update"
            ],
            "type": "u64"
          },
          {
            "name": "lastUpdate",
            "docs": [
              "The last time the bribe was updated"
            ],
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "entry",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "leaderboard",
            "docs": [
              "The leaderboard this entry is from"
            ],
            "type": "publicKey"
          },
          {
            "name": "rank",
            "docs": [
              "The current rank of the entry"
            ],
            "type": "u32"
          },
          {
            "name": "content",
            "docs": [
              "The content of the entry"
            ],
            "type": {
              "defined": "EntryContent"
            }
          }
        ]
      }
    },
    {
      "name": "leaderboard",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "docs": [
              "The ID of the leaderboard"
            ],
            "type": "publicKey"
          },
          {
            "name": "adminMint",
            "docs": [
              "The owner of this mint can update the fee"
            ],
            "type": "publicKey"
          },
          {
            "name": "voteMint",
            "docs": [
              "The token used to create and vote on entries"
            ],
            "type": "publicKey"
          },
          {
            "name": "entryCreationFee",
            "docs": [
              "Cost to create a new entry in this leaderboard"
            ],
            "type": "u64"
          },
          {
            "name": "entries",
            "docs": [
              "Number of entries"
            ],
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "stakeDeposit",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "staker",
            "docs": [
              "The staker owning this account"
            ],
            "type": "publicKey"
          },
          {
            "name": "entry",
            "docs": [
              "The entry staked on"
            ],
            "type": "publicKey"
          },
          {
            "name": "stake",
            "docs": [
              "The amount currently staked"
            ],
            "type": "u64"
          },
          {
            "name": "accumulatedStake",
            "docs": [
              "The amount currently staked"
            ],
            "type": "u64"
          },
          {
            "name": "lastUpdate",
            "docs": [
              "The last time this account was updated"
            ],
            "type": "i64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "EntryContent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "contentMint",
            "docs": [
              "Content NFT"
            ],
            "type": "publicKey"
          },
          {
            "name": "stake",
            "docs": [
              "Total currently staked on this entry"
            ],
            "type": "u64"
          },
          {
            "name": "lastUpdate",
            "docs": [
              "Last time the stake was updated"
            ],
            "type": "i64"
          },
          {
            "name": "accumulatedStake",
            "docs": [
              "Total staked accumulated on this entry"
            ],
            "type": "u64"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "NewEntry",
      "fields": [
        {
          "name": "leaderboard",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "entry",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "NewNode",
      "fields": [
        {
          "name": "forest",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tree",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "node",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "NewAttachedNote",
      "fields": [
        {
          "name": "forest",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tree",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "node",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "note",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "UpdatedStake",
      "fields": [
        {
          "name": "leaderboard",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "entry",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "stake",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "ClosedStake",
      "fields": [
        {
          "name": "staker",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "stake",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "UpdatedBribe",
      "fields": [
        {
          "name": "leaderboard",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "entry",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "bribeMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "NotAdmin",
      "msg": "Not the admin"
    },
    {
      "code": 6001,
      "name": "NotOnLeaderboard",
      "msg": "The entry is not on the leaderboard"
    },
    {
      "code": 6002,
      "name": "InvalidReplacement",
      "msg": "Highest stake entry must have a lower index"
    },
    {
      "code": 6003,
      "name": "InvalidAdminMint",
      "msg": "Admin mint should be an NFT"
    },
    {
      "code": 6004,
      "name": "StringTooLong",
      "msg": "Given string is too long"
    },
    {
      "code": 6005,
      "name": "NodeFull",
      "msg": "Node is already full"
    },
    {
      "code": 6006,
      "name": "NodeNotFull",
      "msg": "Node is not full yet"
    },
    {
      "code": 6007,
      "name": "NotAChild",
      "msg": "Target node is not a child"
    },
    {
      "code": 6008,
      "name": "AlreadyAChild",
      "msg": "Target node is already a child"
    },
    {
      "code": 6009,
      "name": "NotEnoughStake",
      "msg": "Not enough stake to replace"
    },
    {
      "code": 6010,
      "name": "NotEmptyStakeDeposit",
      "msg": "The stake deposit account needs to be empty"
    },
    {
      "code": 6011,
      "name": "InvalidNode",
      "msg": "Invalid node"
    },
    {
      "code": 6012,
      "name": "TagsMismatch",
      "msg": "Tags do not match"
    },
    {
      "code": 6013,
      "name": "NotChildNote",
      "msg": "Target note is not a child of the node"
    },
    {
      "code": 6014,
      "name": "NotOnNode",
      "msg": "Target note is not attached to the node"
    },
    {
      "code": 6015,
      "name": "AlreadyOnNode",
      "msg": "Target note is already on the node"
    }
  ]
};

export const IDL: DippiesIndexProtocol = {
  "version": "0.1.0",
  "name": "dippies_index_protocol",
  "constants": [
    {
      "name": "LEADERBOARD_AUTHORITY_SEED",
      "type": "string",
      "value": "\"leaderboard-authority\""
    },
    {
      "name": "LEADERBOARD_SEED",
      "type": "string",
      "value": "\"leaderboard\""
    },
    {
      "name": "ENTRY_SEED",
      "type": "string",
      "value": "\"entry\""
    },
    {
      "name": "STAKE_SEED",
      "type": "string",
      "value": "\"stake\""
    },
    {
      "name": "BRIBE_SEED",
      "type": "string",
      "value": "\"bribe\""
    },
    {
      "name": "BRIBE_CLAIM_SEED",
      "type": "string",
      "value": "\"bribe-claim\""
    }
  ],
  "instructions": [
    {
      "name": "createLeaderboard",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "leaderboardAuthority",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The account that manages tokens"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "leaderboard-authority"
              },
              {
                "kind": "arg",
                "type": "publicKey",
                "path": "id"
              }
            ]
          }
        },
        {
          "name": "leaderboard",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The leaderboard"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "leaderboard"
              },
              {
                "kind": "arg",
                "type": "publicKey",
                "path": "id"
              }
            ]
          }
        },
        {
          "name": "adminMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The token representing the leaderboard",
            "Its holder has admin authority over the leaderboard"
          ]
        },
        {
          "name": "voteMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The token used to vote on the leaderboard"
          ]
        },
        {
          "name": "voteAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The account storing vote tokens"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Common Solana programs"
          ]
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "publicKey"
        },
        {
          "name": "entryCreationFee",
          "type": "u64"
        }
      ]
    },
    {
      "name": "setLeaderboardFee",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "adminMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The token representing the leaderboard",
            "Its holder has admin authority over the leaderboard"
          ]
        },
        {
          "name": "adminMintAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "leaderboard",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The forest"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "leaderboard"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Leaderboard",
                "path": "leaderboard.id"
              }
            ]
          },
          "relations": [
            "admin_mint"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Common Solana programs"
          ]
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "entryCreationFee",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createEntry",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "adminMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The token representing the leaderboard",
            "Its holder has admin authority over the leaderboard"
          ]
        },
        {
          "name": "adminMintAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "leaderboardAuthority",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The account that manages tokens"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "leaderboard-authority"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Leaderboard",
                "path": "leaderboard.id"
              }
            ]
          }
        },
        {
          "name": "leaderboard",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The leaderboard"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "leaderboard"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Leaderboard",
                "path": "leaderboard.id"
              }
            ]
          },
          "relations": [
            "admin_mint",
            "vote_mint"
          ]
        },
        {
          "name": "voteMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Mint of the token used to stake"
          ]
        },
        {
          "name": "creatorAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "adminVoteAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "entry",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "entry"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Leaderboard",
                "path": "leaderboard.id"
              },
              {
                "kind": "account",
                "type": "u32",
                "account": "Leaderboard",
                "path": "leaderboard.entries"
              }
            ]
          }
        },
        {
          "name": "contentMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The token representing the entry"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Common Solana programs"
          ]
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "swapEntries",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "leaderboard",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The leaderboard"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "leaderboard"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Leaderboard",
                "path": "leaderboard.id"
              }
            ]
          }
        },
        {
          "name": "climbingEntry",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The incomming entry"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "entry"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Leaderboard",
                "path": "leaderboard.id"
              },
              {
                "kind": "account",
                "type": "u32",
                "account": "Entry",
                "path": "climbing_entry.rank"
              }
            ]
          }
        },
        {
          "name": "fallingEntry",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The outgoing entry",
            "It has to already be on the leaderboard"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "entry"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Leaderboard",
                "path": "leaderboard.id"
              },
              {
                "kind": "account",
                "type": "u32",
                "account": "Entry",
                "path": "falling_entry.rank"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Common Solana programs"
          ]
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "createStakeDeposit",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "staker",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "leaderboardAuthority",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The account that manages tokens"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "leaderboard-authority"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Leaderboard",
                "path": "leaderboard.id"
              }
            ]
          }
        },
        {
          "name": "leaderboard",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The leaderboard"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "leaderboard"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Leaderboard",
                "path": "leaderboard.id"
              }
            ]
          },
          "relations": [
            "vote_mint"
          ]
        },
        {
          "name": "voteMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The token used to vote"
          ]
        },
        {
          "name": "entry",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The entry staked on"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "entry"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Leaderboard",
                "path": "leaderboard.id"
              },
              {
                "kind": "account",
                "type": "u32",
                "account": "Entry",
                "path": "entry.rank"
              }
            ]
          }
        },
        {
          "name": "stakeDeposit",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The account storing vote tokens"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "stake"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Entry",
                "path": "entry"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "staker"
              }
            ]
          }
        },
        {
          "name": "stakerAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The account storing vote tokens of the staker"
          ]
        },
        {
          "name": "voteAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The account storing vote tokens"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Common Solana programs"
          ]
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "updateStake",
      "accounts": [
        {
          "name": "staker",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "leaderboardAuthority",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The account that manages tokens"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "leaderboard-authority"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Leaderboard",
                "path": "leaderboard.id"
              }
            ]
          }
        },
        {
          "name": "leaderboard",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The leaderboard"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "leaderboard"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Leaderboard",
                "path": "leaderboard.id"
              }
            ]
          },
          "relations": [
            "vote_mint"
          ]
        },
        {
          "name": "voteMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The token used to vote for nodes and tags"
          ]
        },
        {
          "name": "entry",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The entry"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "entry"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Leaderboard",
                "path": "leaderboard.id"
              },
              {
                "kind": "account",
                "type": "u32",
                "account": "Entry",
                "path": "entry.rank"
              }
            ]
          }
        },
        {
          "name": "stakeDeposit",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The state of the staker's deposit"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "stake"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Entry",
                "path": "entry"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "staker"
              }
            ]
          },
          "relations": [
            "staker"
          ]
        },
        {
          "name": "stakerAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The account storing vote tokens of the staker"
          ]
        },
        {
          "name": "voteAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The account storing vote tokens of the leaderboard"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Common Solana programs"
          ]
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "stake",
          "type": "i128"
        }
      ]
    },
    {
      "name": "closeStakeDeposit",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "staker",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "leaderboard",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The leaderboard"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "leaderboard"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Leaderboard",
                "path": "leaderboard.id"
              }
            ]
          }
        },
        {
          "name": "entry",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The entry"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "entry"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Leaderboard",
                "path": "leaderboard.id"
              },
              {
                "kind": "account",
                "type": "u32",
                "account": "Entry",
                "path": "entry.rank"
              }
            ]
          }
        },
        {
          "name": "stakeDeposit",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The state of the staker's deposit"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "stake"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Entry",
                "path": "entry"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "staker"
              }
            ]
          },
          "relations": [
            "staker"
          ]
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Common Solana programs"
          ]
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "setBribe",
      "accounts": [
        {
          "name": "briber",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "leaderboardAuthority",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The account that manages tokens"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "leaderboard-authority"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Leaderboard",
                "path": "leaderboard.id"
              }
            ]
          }
        },
        {
          "name": "leaderboard",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The leaderboard"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "leaderboard"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Leaderboard",
                "path": "leaderboard.id"
              }
            ]
          }
        },
        {
          "name": "entry",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The entry"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "entry"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Leaderboard",
                "path": "leaderboard"
              },
              {
                "kind": "account",
                "type": "u32",
                "account": "Entry",
                "path": "entry.rank"
              }
            ]
          }
        },
        {
          "name": "bribe",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The bribe"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "bribe"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Entry",
                "path": "entry"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "bribe_mint"
              }
            ]
          }
        },
        {
          "name": "bribeMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The token used to bribe"
          ]
        },
        {
          "name": "briberAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The account paying the bribe"
          ]
        },
        {
          "name": "bribeAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The account storing the bribe"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Common Solana programs"
          ]
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "claimBribe",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "staker",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "leaderboardAuthority",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The account that manages tokens"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "leaderboard-authority"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Leaderboard",
                "path": "leaderboard.id"
              }
            ]
          }
        },
        {
          "name": "leaderboard",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "leaderboard"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Leaderboard",
                "path": "leaderboard.id"
              }
            ]
          }
        },
        {
          "name": "entry",
          "isMut": false,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "entry"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Leaderboard",
                "path": "leaderboard.id"
              },
              {
                "kind": "account",
                "type": "u32",
                "account": "Entry",
                "path": "entry.rank"
              }
            ]
          }
        },
        {
          "name": "stakeState",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The account storing vote tokens"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "stake"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Entry",
                "path": "entry"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "staker"
              }
            ]
          }
        },
        {
          "name": "bribe",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The bribe"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "bribe"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Entry",
                "path": "entry"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "bribe_mint"
              }
            ]
          }
        },
        {
          "name": "bribeClaim",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The bribe claim"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "bribe-claim"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Entry",
                "path": "entry"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Mint",
                "path": "bribe_mint"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "staker"
              }
            ]
          }
        },
        {
          "name": "bribeMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The token used to bribe"
          ]
        },
        {
          "name": "stakerAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The account receiving the bribe"
          ]
        },
        {
          "name": "bribeAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The account storing the bribe"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Common Solana programs"
          ]
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "bribeClaim",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bribe",
            "docs": [
              "The bribe being claimed"
            ],
            "type": "publicKey"
          },
          {
            "name": "claimant",
            "docs": [
              "The claimant"
            ],
            "type": "publicKey"
          },
          {
            "name": "accumulatedStake",
            "docs": [
              "The accumulated shares at the last update"
            ],
            "type": "u64"
          },
          {
            "name": "lastUpdate",
            "docs": [
              "The last time the bribe was updated"
            ],
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "bribe",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "entry",
            "docs": [
              "The entry receiving the bribe"
            ],
            "type": "publicKey"
          },
          {
            "name": "bribeMint",
            "docs": [
              "The mint of the bribe"
            ],
            "type": "publicKey"
          },
          {
            "name": "amount",
            "docs": [
              "Claimable bribe amount"
            ],
            "type": "u64"
          },
          {
            "name": "accumulatedStake",
            "docs": [
              "The accumulated shares at the last update"
            ],
            "type": "u64"
          },
          {
            "name": "lastUpdate",
            "docs": [
              "The last time the bribe was updated"
            ],
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "entry",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "leaderboard",
            "docs": [
              "The leaderboard this entry is from"
            ],
            "type": "publicKey"
          },
          {
            "name": "rank",
            "docs": [
              "The current rank of the entry"
            ],
            "type": "u32"
          },
          {
            "name": "content",
            "docs": [
              "The content of the entry"
            ],
            "type": {
              "defined": "EntryContent"
            }
          }
        ]
      }
    },
    {
      "name": "leaderboard",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "docs": [
              "The ID of the leaderboard"
            ],
            "type": "publicKey"
          },
          {
            "name": "adminMint",
            "docs": [
              "The owner of this mint can update the fee"
            ],
            "type": "publicKey"
          },
          {
            "name": "voteMint",
            "docs": [
              "The token used to create and vote on entries"
            ],
            "type": "publicKey"
          },
          {
            "name": "entryCreationFee",
            "docs": [
              "Cost to create a new entry in this leaderboard"
            ],
            "type": "u64"
          },
          {
            "name": "entries",
            "docs": [
              "Number of entries"
            ],
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "stakeDeposit",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "staker",
            "docs": [
              "The staker owning this account"
            ],
            "type": "publicKey"
          },
          {
            "name": "entry",
            "docs": [
              "The entry staked on"
            ],
            "type": "publicKey"
          },
          {
            "name": "stake",
            "docs": [
              "The amount currently staked"
            ],
            "type": "u64"
          },
          {
            "name": "accumulatedStake",
            "docs": [
              "The amount currently staked"
            ],
            "type": "u64"
          },
          {
            "name": "lastUpdate",
            "docs": [
              "The last time this account was updated"
            ],
            "type": "i64"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "EntryContent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "contentMint",
            "docs": [
              "Content NFT"
            ],
            "type": "publicKey"
          },
          {
            "name": "stake",
            "docs": [
              "Total currently staked on this entry"
            ],
            "type": "u64"
          },
          {
            "name": "lastUpdate",
            "docs": [
              "Last time the stake was updated"
            ],
            "type": "i64"
          },
          {
            "name": "accumulatedStake",
            "docs": [
              "Total staked accumulated on this entry"
            ],
            "type": "u64"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "NewEntry",
      "fields": [
        {
          "name": "leaderboard",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "entry",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "NewNode",
      "fields": [
        {
          "name": "forest",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tree",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "node",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "NewAttachedNote",
      "fields": [
        {
          "name": "forest",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "tree",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "node",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "note",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "UpdatedStake",
      "fields": [
        {
          "name": "leaderboard",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "entry",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "stake",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "ClosedStake",
      "fields": [
        {
          "name": "staker",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "stake",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "UpdatedBribe",
      "fields": [
        {
          "name": "leaderboard",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "entry",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "bribeMint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "NotAdmin",
      "msg": "Not the admin"
    },
    {
      "code": 6001,
      "name": "NotOnLeaderboard",
      "msg": "The entry is not on the leaderboard"
    },
    {
      "code": 6002,
      "name": "InvalidReplacement",
      "msg": "Highest stake entry must have a lower index"
    },
    {
      "code": 6003,
      "name": "InvalidAdminMint",
      "msg": "Admin mint should be an NFT"
    },
    {
      "code": 6004,
      "name": "StringTooLong",
      "msg": "Given string is too long"
    },
    {
      "code": 6005,
      "name": "NodeFull",
      "msg": "Node is already full"
    },
    {
      "code": 6006,
      "name": "NodeNotFull",
      "msg": "Node is not full yet"
    },
    {
      "code": 6007,
      "name": "NotAChild",
      "msg": "Target node is not a child"
    },
    {
      "code": 6008,
      "name": "AlreadyAChild",
      "msg": "Target node is already a child"
    },
    {
      "code": 6009,
      "name": "NotEnoughStake",
      "msg": "Not enough stake to replace"
    },
    {
      "code": 6010,
      "name": "NotEmptyStakeDeposit",
      "msg": "The stake deposit account needs to be empty"
    },
    {
      "code": 6011,
      "name": "InvalidNode",
      "msg": "Invalid node"
    },
    {
      "code": 6012,
      "name": "TagsMismatch",
      "msg": "Tags do not match"
    },
    {
      "code": 6013,
      "name": "NotChildNote",
      "msg": "Target note is not a child of the node"
    },
    {
      "code": 6014,
      "name": "NotOnNode",
      "msg": "Target note is not attached to the node"
    },
    {
      "code": 6015,
      "name": "AlreadyOnNode",
      "msg": "Target note is already on the node"
    }
  ]
};
