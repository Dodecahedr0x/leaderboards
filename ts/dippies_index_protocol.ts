export type DippiesIndexProtocol = {
  "version": "0.1.0",
  "name": "dippies_index_protocol",
  "constants": [
    {
      "name": "FOREST_AUTHORITY_SEED",
      "type": "string",
      "value": "\"forest-authority\""
    },
    {
      "name": "FOREST_SEED",
      "type": "string",
      "value": "\"forest\""
    },
    {
      "name": "TREE_SEED",
      "type": "string",
      "value": "\"tree\""
    },
    {
      "name": "NODE_SEED",
      "type": "string",
      "value": "\"node\""
    },
    {
      "name": "NOTE_SEED",
      "type": "string",
      "value": "\"note\""
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
    },
    {
      "name": "MAX_TAGS",
      "type": {
        "defined": "usize"
      },
      "value": "10"
    },
    {
      "name": "MAX_TAG_LENGTH",
      "type": {
        "defined": "usize"
      },
      "value": "48"
    },
    {
      "name": "MAX_NOTES_PER_NODE",
      "type": {
        "defined": "usize"
      },
      "value": "3"
    },
    {
      "name": "MAX_CHILD_PER_NODE",
      "type": {
        "defined": "usize"
      },
      "value": "3"
    },
    {
      "name": "MAX_URI_LENGTH",
      "type": {
        "defined": "usize"
      },
      "value": "200"
    },
    {
      "name": "MAX_DESCRIPTION_LENGTH",
      "type": {
        "defined": "usize"
      },
      "value": "200"
    }
  ],
  "instructions": [
    {
      "name": "createForest",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "forestAuthority",
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
                "value": "forest-authority"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest"
              }
            ]
          }
        },
        {
          "name": "forest",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The forest"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "forest"
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
          "name": "voteMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The token used to vote for nodes and tags"
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
          "name": "admin",
          "type": "publicKey"
        },
        {
          "name": "treeCreationFee",
          "type": "u64"
        }
      ]
    },
    {
      "name": "setForest",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "forest",
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
                "value": "forest"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest.id"
              }
            ]
          }
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
          "name": "admin",
          "type": "publicKey"
        },
        {
          "name": "treeCreationFee",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createTree",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "forestAuthority",
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
                "value": "forest-authority"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest"
              }
            ]
          }
        },
        {
          "name": "forest",
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
                "value": "forest"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest.id"
              }
            ]
          }
        },
        {
          "name": "voteMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Mint of the token used to pay the tree creation fee"
          ]
        },
        {
          "name": "creatorAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "adminAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tree",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The tree"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest"
              },
              {
                "kind": "arg",
                "type": "string",
                "path": "title"
              }
            ]
          }
        },
        {
          "name": "rootNode",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The root node of the new tree"
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
          "name": "title",
          "type": "string"
        }
      ]
    },
    {
      "name": "createNode",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "forest",
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
                "value": "forest"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest.id"
              }
            ]
          }
        },
        {
          "name": "tree",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The tree"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest"
              },
              {
                "kind": "account",
                "type": "string",
                "account": "Tree",
                "path": "tree.title"
              }
            ]
          }
        },
        {
          "name": "parentNode",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The parent node to attach to"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "node"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Node",
                "path": "parent_node.parent"
              },
              {
                "kind": "account",
                "type": {
                  "vec": "string"
                },
                "account": "Node",
                "path": "parent_node.tags"
              }
            ]
          }
        },
        {
          "name": "node",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The new node"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "node"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Node",
                "path": "parent_node"
              },
              {
                "kind": "arg",
                "type": "string",
                "path": "tag"
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
      "args": [
        {
          "name": "tag",
          "type": "string"
        }
      ]
    },
    {
      "name": "attachNode",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "forest",
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
                "value": "forest"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest.id"
              }
            ]
          }
        },
        {
          "name": "tree",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The tree"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest"
              },
              {
                "kind": "account",
                "type": "string",
                "account": "Tree",
                "path": "tree.title"
              }
            ]
          }
        },
        {
          "name": "parentNode",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The parent node to attach to"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "node"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Node",
                "path": "parent_node.parent"
              },
              {
                "kind": "account",
                "type": {
                  "vec": "string"
                },
                "account": "Node",
                "path": "parent_node.tags"
              }
            ]
          }
        },
        {
          "name": "node",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The attached node"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "node"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Node",
                "path": "parent_node"
              },
              {
                "kind": "account",
                "type": {
                  "vec": "string"
                },
                "account": "Node",
                "path": "node.tags"
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
      "name": "replaceNode",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "forest",
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
                "value": "forest"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest.id"
              }
            ]
          }
        },
        {
          "name": "tree",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The tree"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest"
              },
              {
                "kind": "account",
                "type": "string",
                "account": "Tree",
                "path": "tree.title"
              }
            ]
          }
        },
        {
          "name": "parentNode",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The parent node to attach to"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "node"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Node",
                "path": "parent_node.parent"
              },
              {
                "kind": "account",
                "type": {
                  "vec": "string"
                },
                "account": "Node",
                "path": "parent_node.tags"
              }
            ]
          }
        },
        {
          "name": "node",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The attached node"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "node"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Node",
                "path": "parent_node"
              },
              {
                "kind": "account",
                "type": {
                  "vec": "string"
                },
                "account": "Node",
                "path": "node.tags"
              }
            ]
          }
        },
        {
          "name": "weakerNode",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The weaker node being replaced"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "node"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Node",
                "path": "parent_node"
              },
              {
                "kind": "account",
                "type": {
                  "vec": "string"
                },
                "account": "Node",
                "path": "weaker_node.tags"
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
      "name": "createNote",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "forest",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The global forest"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "forest"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest.id"
              }
            ]
          }
        },
        {
          "name": "tree",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The tree"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest"
              },
              {
                "kind": "account",
                "type": "string",
                "account": "Tree",
                "path": "tree.title"
              }
            ]
          }
        },
        {
          "name": "node",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The node to attach to"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "node"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Node",
                "path": "node.parent"
              },
              {
                "kind": "account",
                "type": {
                  "vec": "string"
                },
                "account": "Node",
                "path": "node.tags"
              }
            ]
          }
        },
        {
          "name": "note",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The new note"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "note"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
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
      "args": [
        {
          "name": "id",
          "type": "publicKey"
        },
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "website",
          "type": "string"
        },
        {
          "name": "image",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        }
      ]
    },
    {
      "name": "attachNote",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "forest",
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
                "value": "forest"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest.id"
              }
            ]
          }
        },
        {
          "name": "tree",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The tree"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest"
              },
              {
                "kind": "account",
                "type": "string",
                "account": "Tree",
                "path": "tree.title"
              }
            ]
          }
        },
        {
          "name": "node",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The parent node to attach to"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "node"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Node",
                "path": "node.parent"
              },
              {
                "kind": "account",
                "type": {
                  "vec": "string"
                },
                "account": "Node",
                "path": "node.tags"
              }
            ]
          }
        },
        {
          "name": "note",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The attached note"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "note"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Note",
                "path": "note.id"
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
      "name": "createStake",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "forestAuthority",
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
                "value": "forest-authority"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest"
              }
            ]
          }
        },
        {
          "name": "forest",
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
                "value": "forest"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest.id"
              }
            ]
          }
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
          "name": "tree",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The tree"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest"
              },
              {
                "kind": "account",
                "type": "string",
                "account": "Tree",
                "path": "tree.title"
              }
            ]
          }
        },
        {
          "name": "node",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The node the note is attached to"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "node"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Node",
                "path": "node.parent"
              },
              {
                "kind": "account",
                "type": {
                  "vec": "string"
                },
                "account": "Node",
                "path": "node.tags"
              }
            ]
          }
        },
        {
          "name": "note",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The attached note"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "note"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Note",
                "path": "note.id"
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
                "account": "Note",
                "path": "note"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "signer"
              }
            ]
          }
        },
        {
          "name": "stakerAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The account storing vote tokens"
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
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "forestAuthority",
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
                "value": "forest-authority"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest"
              }
            ]
          }
        },
        {
          "name": "forest",
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
                "value": "forest"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest.id"
              }
            ]
          }
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
          "name": "tree",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The tree"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest"
              },
              {
                "kind": "account",
                "type": "string",
                "account": "Tree",
                "path": "tree.title"
              }
            ]
          }
        },
        {
          "name": "node",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The node the note is attached to"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "node"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Node",
                "path": "node.parent"
              },
              {
                "kind": "account",
                "type": {
                  "vec": "string"
                },
                "account": "Node",
                "path": "node.tags"
              }
            ]
          }
        },
        {
          "name": "note",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The attached note"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "note"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Note",
                "path": "note.id"
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
                "account": "Note",
                "path": "note"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "signer"
              }
            ]
          }
        },
        {
          "name": "stakerAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The account storing vote tokens"
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
      "name": "closeStake",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "forest",
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
                "value": "forest"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest.id"
              }
            ]
          }
        },
        {
          "name": "tree",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The tree"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest"
              },
              {
                "kind": "account",
                "type": "string",
                "account": "Tree",
                "path": "tree.title"
              }
            ]
          }
        },
        {
          "name": "note",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The attached note"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "note"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Note",
                "path": "note.id"
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
                "account": "Note",
                "path": "note"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "signer"
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
      "name": "moveNote",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "forest",
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
                "value": "forest"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest.id"
              }
            ]
          }
        },
        {
          "name": "tree",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The tree"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest"
              },
              {
                "kind": "account",
                "type": "string",
                "account": "Tree",
                "path": "tree.title"
              }
            ]
          }
        },
        {
          "name": "sourceNode",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The node the note is currently attached to"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "node"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Node",
                "path": "source_node.parent"
              },
              {
                "kind": "account",
                "type": {
                  "vec": "string"
                },
                "account": "Node",
                "path": "source_node.tags"
              }
            ]
          }
        },
        {
          "name": "destinationNode",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The node the note will be attached to"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "node"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Node",
                "path": "destination_node.parent"
              },
              {
                "kind": "account",
                "type": {
                  "vec": "string"
                },
                "account": "Node",
                "path": "destination_node.tags"
              }
            ]
          }
        },
        {
          "name": "note",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The new note"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "note"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Note",
                "path": "note.id"
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
        }
      ],
      "args": []
    },
    {
      "name": "replaceNote",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "forest",
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
                "value": "forest"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest.id"
              }
            ]
          }
        },
        {
          "name": "tree",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The tree"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest"
              },
              {
                "kind": "account",
                "type": "string",
                "account": "Tree",
                "path": "tree.title"
              }
            ]
          }
        },
        {
          "name": "node",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The node the note will be attached to"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "node"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Node",
                "path": "node.parent"
              },
              {
                "kind": "account",
                "type": {
                  "vec": "string"
                },
                "account": "Node",
                "path": "node.tags"
              }
            ]
          }
        },
        {
          "name": "note",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The new note"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "note"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Note",
                "path": "note.id"
              }
            ]
          }
        },
        {
          "name": "weakNote",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The new note"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "note"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Note",
                "path": "weak_note.id"
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
        }
      ],
      "args": []
    },
    {
      "name": "setBribe",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "forestAuthority",
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
                "value": "forest-authority"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest"
              }
            ]
          }
        },
        {
          "name": "forest",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The global forest"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "forest"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest.id"
              }
            ]
          }
        },
        {
          "name": "tree",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The tree"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest"
              },
              {
                "kind": "account",
                "type": "string",
                "account": "Tree",
                "path": "tree.title"
              }
            ]
          }
        },
        {
          "name": "node",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The node to attach to"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "node"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Node",
                "path": "node.parent"
              },
              {
                "kind": "account",
                "type": {
                  "vec": "string"
                },
                "account": "Node",
                "path": "node.tags"
              }
            ]
          }
        },
        {
          "name": "note",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The bribed note"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "note"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Note",
                "path": "note.id"
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
                "account": "Note",
                "path": "note"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "signer"
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
                "account": "Note",
                "path": "note"
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
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "forestAuthority",
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
                "value": "forest-authority"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest"
              }
            ]
          }
        },
        {
          "name": "forest",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The global forest"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "forest"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest.id"
              }
            ]
          }
        },
        {
          "name": "tree",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The tree"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest"
              },
              {
                "kind": "account",
                "type": "string",
                "account": "Tree",
                "path": "tree.title"
              }
            ]
          }
        },
        {
          "name": "node",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The node to attach to"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "node"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Node",
                "path": "node.parent"
              },
              {
                "kind": "account",
                "type": {
                  "vec": "string"
                },
                "account": "Node",
                "path": "node.tags"
              }
            ]
          }
        },
        {
          "name": "note",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The bribed note"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "note"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Note",
                "path": "note.id"
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
                "account": "Note",
                "path": "note"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "signer"
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
                "account": "Note",
                "path": "note"
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
                "account": "Note",
                "path": "note"
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
                "path": "signer"
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
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "forest",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "docs": [
              "The ID of the forest"
            ],
            "type": "publicKey"
          },
          {
            "name": "voteMint",
            "docs": [
              "The token used to vote for a tag"
            ],
            "type": "publicKey"
          },
          {
            "name": "admin",
            "docs": [
              "Admin of the forest"
            ],
            "type": "publicKey"
          },
          {
            "name": "treeCreationFee",
            "docs": [
              "Cost to create a tree from this forest"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "tree",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "forest",
            "docs": [
              "The forest this tree grows in"
            ],
            "type": "publicKey"
          },
          {
            "name": "rootNode",
            "docs": [
              "The root node of the tree"
            ],
            "type": "publicKey"
          },
          {
            "name": "title",
            "docs": [
              "Title of the tree"
            ],
            "type": "string"
          },
          {
            "name": "stake",
            "docs": [
              "Total staked on this tree"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "node",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tree",
            "docs": [
              "The tree this node belongs to"
            ],
            "type": "publicKey"
          },
          {
            "name": "parent",
            "docs": [
              "The parent of this node"
            ],
            "type": "publicKey"
          },
          {
            "name": "stake",
            "docs": [
              "The total staked on notes of this node"
            ],
            "type": "u64"
          },
          {
            "name": "tags",
            "docs": [
              "The set of tags of this node"
            ],
            "type": {
              "vec": "string"
            }
          },
          {
            "name": "children",
            "docs": [
              "Children nodes"
            ],
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "notes",
            "docs": [
              "The set of notes currently attached to this node"
            ],
            "type": {
              "vec": "publicKey"
            }
          }
        ]
      }
    },
    {
      "name": "note",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "docs": [
              "Unique noteidetifier"
            ],
            "type": "publicKey"
          },
          {
            "name": "tree",
            "docs": [
              "The tree this onte belongs to"
            ],
            "type": "publicKey"
          },
          {
            "name": "parent",
            "docs": [
              "The node this note is attached to"
            ],
            "type": "publicKey"
          },
          {
            "name": "stake",
            "docs": [
              "The stake currently on this note"
            ],
            "type": "u64"
          },
          {
            "name": "accumulatedStake",
            "docs": [
              "The total stake accumulated per unit of time"
            ],
            "type": "u64"
          },
          {
            "name": "lastUpdate",
            "docs": [
              "The last time this note was updated"
            ],
            "type": "i64"
          },
          {
            "name": "title",
            "docs": [
              "The title of the note"
            ],
            "type": "string"
          },
          {
            "name": "website",
            "docs": [
              "The website the note points to"
            ],
            "type": "string"
          },
          {
            "name": "image",
            "docs": [
              "Thecoverimage ofthe note"
            ],
            "type": "string"
          },
          {
            "name": "description",
            "docs": [
              "A short description of the website the note points to"
            ],
            "type": "string"
          },
          {
            "name": "tags",
            "docs": [
              "The set of tags on this node"
            ],
            "type": {
              "vec": "string"
            }
          }
        ]
      }
    },
    {
      "name": "stakeState",
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
            "name": "note",
            "docs": [
              "The note staked on"
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
    },
    {
      "name": "bribe",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "note",
            "docs": [
              "The note receiving the bribe"
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
    }
  ],
  "events": [
    {
      "name": "NewTree",
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
          "name": "title",
          "type": "string",
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
      "name": "UpdatedBribe",
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
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "StringTooLong",
      "msg": "Given string is too long"
    },
    {
      "code": 6001,
      "name": "NodeFull",
      "msg": "Node is already full"
    },
    {
      "code": 6002,
      "name": "NodeNotFull",
      "msg": "Node is not full yet"
    },
    {
      "code": 6003,
      "name": "NotAChild",
      "msg": "Target node is not a child"
    },
    {
      "code": 6004,
      "name": "AlreadyAChild",
      "msg": "Target node is already a child"
    },
    {
      "code": 6005,
      "name": "NotEnoughStake",
      "msg": "Not enough stake to replace"
    },
    {
      "code": 6006,
      "name": "InvalidNode",
      "msg": "Invalid node"
    },
    {
      "code": 6007,
      "name": "TagsMismatch",
      "msg": "Tags do not match"
    },
    {
      "code": 6008,
      "name": "NotChildNote",
      "msg": "Target note is not a child of the node"
    },
    {
      "code": 6009,
      "name": "NotOnNode",
      "msg": "Target note is not attached to the node"
    },
    {
      "code": 6010,
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
      "name": "FOREST_AUTHORITY_SEED",
      "type": "string",
      "value": "\"forest-authority\""
    },
    {
      "name": "FOREST_SEED",
      "type": "string",
      "value": "\"forest\""
    },
    {
      "name": "TREE_SEED",
      "type": "string",
      "value": "\"tree\""
    },
    {
      "name": "NODE_SEED",
      "type": "string",
      "value": "\"node\""
    },
    {
      "name": "NOTE_SEED",
      "type": "string",
      "value": "\"note\""
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
    },
    {
      "name": "MAX_TAGS",
      "type": {
        "defined": "usize"
      },
      "value": "10"
    },
    {
      "name": "MAX_TAG_LENGTH",
      "type": {
        "defined": "usize"
      },
      "value": "48"
    },
    {
      "name": "MAX_NOTES_PER_NODE",
      "type": {
        "defined": "usize"
      },
      "value": "3"
    },
    {
      "name": "MAX_CHILD_PER_NODE",
      "type": {
        "defined": "usize"
      },
      "value": "3"
    },
    {
      "name": "MAX_URI_LENGTH",
      "type": {
        "defined": "usize"
      },
      "value": "200"
    },
    {
      "name": "MAX_DESCRIPTION_LENGTH",
      "type": {
        "defined": "usize"
      },
      "value": "200"
    }
  ],
  "instructions": [
    {
      "name": "createForest",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "forestAuthority",
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
                "value": "forest-authority"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest"
              }
            ]
          }
        },
        {
          "name": "forest",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The forest"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "forest"
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
          "name": "voteMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The token used to vote for nodes and tags"
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
          "name": "admin",
          "type": "publicKey"
        },
        {
          "name": "treeCreationFee",
          "type": "u64"
        }
      ]
    },
    {
      "name": "setForest",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "forest",
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
                "value": "forest"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest.id"
              }
            ]
          }
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
          "name": "admin",
          "type": "publicKey"
        },
        {
          "name": "treeCreationFee",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createTree",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "forestAuthority",
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
                "value": "forest-authority"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest"
              }
            ]
          }
        },
        {
          "name": "forest",
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
                "value": "forest"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest.id"
              }
            ]
          }
        },
        {
          "name": "voteMint",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "Mint of the token used to pay the tree creation fee"
          ]
        },
        {
          "name": "creatorAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "adminAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tree",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The tree"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest"
              },
              {
                "kind": "arg",
                "type": "string",
                "path": "title"
              }
            ]
          }
        },
        {
          "name": "rootNode",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The root node of the new tree"
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
          "name": "title",
          "type": "string"
        }
      ]
    },
    {
      "name": "createNode",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "forest",
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
                "value": "forest"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest.id"
              }
            ]
          }
        },
        {
          "name": "tree",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The tree"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest"
              },
              {
                "kind": "account",
                "type": "string",
                "account": "Tree",
                "path": "tree.title"
              }
            ]
          }
        },
        {
          "name": "parentNode",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The parent node to attach to"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "node"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Node",
                "path": "parent_node.parent"
              },
              {
                "kind": "account",
                "type": {
                  "vec": "string"
                },
                "account": "Node",
                "path": "parent_node.tags"
              }
            ]
          }
        },
        {
          "name": "node",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The new node"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "node"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Node",
                "path": "parent_node"
              },
              {
                "kind": "arg",
                "type": "string",
                "path": "tag"
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
      "args": [
        {
          "name": "tag",
          "type": "string"
        }
      ]
    },
    {
      "name": "attachNode",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "forest",
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
                "value": "forest"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest.id"
              }
            ]
          }
        },
        {
          "name": "tree",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The tree"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest"
              },
              {
                "kind": "account",
                "type": "string",
                "account": "Tree",
                "path": "tree.title"
              }
            ]
          }
        },
        {
          "name": "parentNode",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The parent node to attach to"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "node"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Node",
                "path": "parent_node.parent"
              },
              {
                "kind": "account",
                "type": {
                  "vec": "string"
                },
                "account": "Node",
                "path": "parent_node.tags"
              }
            ]
          }
        },
        {
          "name": "node",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The attached node"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "node"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Node",
                "path": "parent_node"
              },
              {
                "kind": "account",
                "type": {
                  "vec": "string"
                },
                "account": "Node",
                "path": "node.tags"
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
      "name": "replaceNode",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "forest",
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
                "value": "forest"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest.id"
              }
            ]
          }
        },
        {
          "name": "tree",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The tree"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest"
              },
              {
                "kind": "account",
                "type": "string",
                "account": "Tree",
                "path": "tree.title"
              }
            ]
          }
        },
        {
          "name": "parentNode",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The parent node to attach to"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "node"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Node",
                "path": "parent_node.parent"
              },
              {
                "kind": "account",
                "type": {
                  "vec": "string"
                },
                "account": "Node",
                "path": "parent_node.tags"
              }
            ]
          }
        },
        {
          "name": "node",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The attached node"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "node"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Node",
                "path": "parent_node"
              },
              {
                "kind": "account",
                "type": {
                  "vec": "string"
                },
                "account": "Node",
                "path": "node.tags"
              }
            ]
          }
        },
        {
          "name": "weakerNode",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The weaker node being replaced"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "node"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Node",
                "path": "parent_node"
              },
              {
                "kind": "account",
                "type": {
                  "vec": "string"
                },
                "account": "Node",
                "path": "weaker_node.tags"
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
      "name": "createNote",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "forest",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The global forest"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "forest"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest.id"
              }
            ]
          }
        },
        {
          "name": "tree",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The tree"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest"
              },
              {
                "kind": "account",
                "type": "string",
                "account": "Tree",
                "path": "tree.title"
              }
            ]
          }
        },
        {
          "name": "node",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The node to attach to"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "node"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Node",
                "path": "node.parent"
              },
              {
                "kind": "account",
                "type": {
                  "vec": "string"
                },
                "account": "Node",
                "path": "node.tags"
              }
            ]
          }
        },
        {
          "name": "note",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The new note"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "note"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
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
      "args": [
        {
          "name": "id",
          "type": "publicKey"
        },
        {
          "name": "title",
          "type": "string"
        },
        {
          "name": "website",
          "type": "string"
        },
        {
          "name": "image",
          "type": "string"
        },
        {
          "name": "description",
          "type": "string"
        }
      ]
    },
    {
      "name": "attachNote",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "forest",
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
                "value": "forest"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest.id"
              }
            ]
          }
        },
        {
          "name": "tree",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The tree"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest"
              },
              {
                "kind": "account",
                "type": "string",
                "account": "Tree",
                "path": "tree.title"
              }
            ]
          }
        },
        {
          "name": "node",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The parent node to attach to"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "node"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Node",
                "path": "node.parent"
              },
              {
                "kind": "account",
                "type": {
                  "vec": "string"
                },
                "account": "Node",
                "path": "node.tags"
              }
            ]
          }
        },
        {
          "name": "note",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The attached note"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "note"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Note",
                "path": "note.id"
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
      "name": "createStake",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "forestAuthority",
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
                "value": "forest-authority"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest"
              }
            ]
          }
        },
        {
          "name": "forest",
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
                "value": "forest"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest.id"
              }
            ]
          }
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
          "name": "tree",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The tree"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest"
              },
              {
                "kind": "account",
                "type": "string",
                "account": "Tree",
                "path": "tree.title"
              }
            ]
          }
        },
        {
          "name": "node",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The node the note is attached to"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "node"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Node",
                "path": "node.parent"
              },
              {
                "kind": "account",
                "type": {
                  "vec": "string"
                },
                "account": "Node",
                "path": "node.tags"
              }
            ]
          }
        },
        {
          "name": "note",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The attached note"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "note"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Note",
                "path": "note.id"
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
                "account": "Note",
                "path": "note"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "signer"
              }
            ]
          }
        },
        {
          "name": "stakerAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The account storing vote tokens"
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
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "forestAuthority",
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
                "value": "forest-authority"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest"
              }
            ]
          }
        },
        {
          "name": "forest",
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
                "value": "forest"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest.id"
              }
            ]
          }
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
          "name": "tree",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The tree"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest"
              },
              {
                "kind": "account",
                "type": "string",
                "account": "Tree",
                "path": "tree.title"
              }
            ]
          }
        },
        {
          "name": "node",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The node the note is attached to"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "node"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Node",
                "path": "node.parent"
              },
              {
                "kind": "account",
                "type": {
                  "vec": "string"
                },
                "account": "Node",
                "path": "node.tags"
              }
            ]
          }
        },
        {
          "name": "note",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The attached note"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "note"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Note",
                "path": "note.id"
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
                "account": "Note",
                "path": "note"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "signer"
              }
            ]
          }
        },
        {
          "name": "stakerAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The account storing vote tokens"
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
      "name": "closeStake",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "forest",
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
                "value": "forest"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest.id"
              }
            ]
          }
        },
        {
          "name": "tree",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The tree"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest"
              },
              {
                "kind": "account",
                "type": "string",
                "account": "Tree",
                "path": "tree.title"
              }
            ]
          }
        },
        {
          "name": "note",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The attached note"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "note"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Note",
                "path": "note.id"
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
                "account": "Note",
                "path": "note"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "signer"
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
      "name": "moveNote",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "forest",
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
                "value": "forest"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest.id"
              }
            ]
          }
        },
        {
          "name": "tree",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The tree"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest"
              },
              {
                "kind": "account",
                "type": "string",
                "account": "Tree",
                "path": "tree.title"
              }
            ]
          }
        },
        {
          "name": "sourceNode",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The node the note is currently attached to"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "node"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Node",
                "path": "source_node.parent"
              },
              {
                "kind": "account",
                "type": {
                  "vec": "string"
                },
                "account": "Node",
                "path": "source_node.tags"
              }
            ]
          }
        },
        {
          "name": "destinationNode",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The node the note will be attached to"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "node"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Node",
                "path": "destination_node.parent"
              },
              {
                "kind": "account",
                "type": {
                  "vec": "string"
                },
                "account": "Node",
                "path": "destination_node.tags"
              }
            ]
          }
        },
        {
          "name": "note",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The new note"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "note"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Note",
                "path": "note.id"
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
        }
      ],
      "args": []
    },
    {
      "name": "replaceNote",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "forest",
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
                "value": "forest"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest.id"
              }
            ]
          }
        },
        {
          "name": "tree",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The tree"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest"
              },
              {
                "kind": "account",
                "type": "string",
                "account": "Tree",
                "path": "tree.title"
              }
            ]
          }
        },
        {
          "name": "node",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The node the note will be attached to"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "node"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Node",
                "path": "node.parent"
              },
              {
                "kind": "account",
                "type": {
                  "vec": "string"
                },
                "account": "Node",
                "path": "node.tags"
              }
            ]
          }
        },
        {
          "name": "note",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The new note"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "note"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Note",
                "path": "note.id"
              }
            ]
          }
        },
        {
          "name": "weakNote",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The new note"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "note"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Note",
                "path": "weak_note.id"
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
        }
      ],
      "args": []
    },
    {
      "name": "setBribe",
      "accounts": [
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "forestAuthority",
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
                "value": "forest-authority"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest"
              }
            ]
          }
        },
        {
          "name": "forest",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The global forest"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "forest"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest.id"
              }
            ]
          }
        },
        {
          "name": "tree",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The tree"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest"
              },
              {
                "kind": "account",
                "type": "string",
                "account": "Tree",
                "path": "tree.title"
              }
            ]
          }
        },
        {
          "name": "node",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The node to attach to"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "node"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Node",
                "path": "node.parent"
              },
              {
                "kind": "account",
                "type": {
                  "vec": "string"
                },
                "account": "Node",
                "path": "node.tags"
              }
            ]
          }
        },
        {
          "name": "note",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The bribed note"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "note"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Note",
                "path": "note.id"
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
                "account": "Note",
                "path": "note"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "signer"
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
                "account": "Note",
                "path": "note"
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
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "forestAuthority",
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
                "value": "forest-authority"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest"
              }
            ]
          }
        },
        {
          "name": "forest",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The global forest"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "forest"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest.id"
              }
            ]
          }
        },
        {
          "name": "tree",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The tree"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Forest",
                "path": "forest"
              },
              {
                "kind": "account",
                "type": "string",
                "account": "Tree",
                "path": "tree.title"
              }
            ]
          }
        },
        {
          "name": "node",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "The node to attach to"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "node"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Node",
                "path": "node.parent"
              },
              {
                "kind": "account",
                "type": {
                  "vec": "string"
                },
                "account": "Node",
                "path": "node.tags"
              }
            ]
          }
        },
        {
          "name": "note",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "The bribed note"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "note"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Tree",
                "path": "tree"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "account": "Note",
                "path": "note.id"
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
                "account": "Note",
                "path": "note"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "signer"
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
                "account": "Note",
                "path": "note"
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
                "account": "Note",
                "path": "note"
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
                "path": "signer"
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
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "forest",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "docs": [
              "The ID of the forest"
            ],
            "type": "publicKey"
          },
          {
            "name": "voteMint",
            "docs": [
              "The token used to vote for a tag"
            ],
            "type": "publicKey"
          },
          {
            "name": "admin",
            "docs": [
              "Admin of the forest"
            ],
            "type": "publicKey"
          },
          {
            "name": "treeCreationFee",
            "docs": [
              "Cost to create a tree from this forest"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "tree",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "forest",
            "docs": [
              "The forest this tree grows in"
            ],
            "type": "publicKey"
          },
          {
            "name": "rootNode",
            "docs": [
              "The root node of the tree"
            ],
            "type": "publicKey"
          },
          {
            "name": "title",
            "docs": [
              "Title of the tree"
            ],
            "type": "string"
          },
          {
            "name": "stake",
            "docs": [
              "Total staked on this tree"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "node",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tree",
            "docs": [
              "The tree this node belongs to"
            ],
            "type": "publicKey"
          },
          {
            "name": "parent",
            "docs": [
              "The parent of this node"
            ],
            "type": "publicKey"
          },
          {
            "name": "stake",
            "docs": [
              "The total staked on notes of this node"
            ],
            "type": "u64"
          },
          {
            "name": "tags",
            "docs": [
              "The set of tags of this node"
            ],
            "type": {
              "vec": "string"
            }
          },
          {
            "name": "children",
            "docs": [
              "Children nodes"
            ],
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "notes",
            "docs": [
              "The set of notes currently attached to this node"
            ],
            "type": {
              "vec": "publicKey"
            }
          }
        ]
      }
    },
    {
      "name": "note",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "docs": [
              "Unique noteidetifier"
            ],
            "type": "publicKey"
          },
          {
            "name": "tree",
            "docs": [
              "The tree this onte belongs to"
            ],
            "type": "publicKey"
          },
          {
            "name": "parent",
            "docs": [
              "The node this note is attached to"
            ],
            "type": "publicKey"
          },
          {
            "name": "stake",
            "docs": [
              "The stake currently on this note"
            ],
            "type": "u64"
          },
          {
            "name": "accumulatedStake",
            "docs": [
              "The total stake accumulated per unit of time"
            ],
            "type": "u64"
          },
          {
            "name": "lastUpdate",
            "docs": [
              "The last time this note was updated"
            ],
            "type": "i64"
          },
          {
            "name": "title",
            "docs": [
              "The title of the note"
            ],
            "type": "string"
          },
          {
            "name": "website",
            "docs": [
              "The website the note points to"
            ],
            "type": "string"
          },
          {
            "name": "image",
            "docs": [
              "Thecoverimage ofthe note"
            ],
            "type": "string"
          },
          {
            "name": "description",
            "docs": [
              "A short description of the website the note points to"
            ],
            "type": "string"
          },
          {
            "name": "tags",
            "docs": [
              "The set of tags on this node"
            ],
            "type": {
              "vec": "string"
            }
          }
        ]
      }
    },
    {
      "name": "stakeState",
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
            "name": "note",
            "docs": [
              "The note staked on"
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
    },
    {
      "name": "bribe",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "note",
            "docs": [
              "The note receiving the bribe"
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
    }
  ],
  "events": [
    {
      "name": "NewTree",
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
          "name": "title",
          "type": "string",
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
      "name": "UpdatedBribe",
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
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "StringTooLong",
      "msg": "Given string is too long"
    },
    {
      "code": 6001,
      "name": "NodeFull",
      "msg": "Node is already full"
    },
    {
      "code": 6002,
      "name": "NodeNotFull",
      "msg": "Node is not full yet"
    },
    {
      "code": 6003,
      "name": "NotAChild",
      "msg": "Target node is not a child"
    },
    {
      "code": 6004,
      "name": "AlreadyAChild",
      "msg": "Target node is already a child"
    },
    {
      "code": 6005,
      "name": "NotEnoughStake",
      "msg": "Not enough stake to replace"
    },
    {
      "code": 6006,
      "name": "InvalidNode",
      "msg": "Invalid node"
    },
    {
      "code": 6007,
      "name": "TagsMismatch",
      "msg": "Tags do not match"
    },
    {
      "code": 6008,
      "name": "NotChildNote",
      "msg": "Target note is not a child of the node"
    },
    {
      "code": 6009,
      "name": "NotOnNode",
      "msg": "Target note is not attached to the node"
    },
    {
      "code": 6010,
      "name": "AlreadyOnNode",
      "msg": "Target note is already on the node"
    }
  ]
};
