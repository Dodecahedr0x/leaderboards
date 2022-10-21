# Idea Tree

Anchor implementation of the Idea Tree, a token-curated binary tree registry where participants stake to control the nodes closest to the root.

## Concepts

- **Tree**
  - The tree is global structure used to search
- **Node**
  - A node is a component of the tree
  - Each node has a Tag, a Razor and a set of Notes
- **Note**
  - A note is held  by a node.
  - A note has a set of tags.
  - When searching through nodes, notes are shown to users
  - Users can vote for a note to attach it to a node.
  - A note can be replaced by another if it has the same tag as the node it will be attached to and has more vote than the previous note.
- **Tag**
  - A tag indicates what notes can be attached to the Node
- **Razor**
  - A [razor](https://rationalwiki.org/wiki/Logical_razor) is linked to a node and determines what its childrens are about.
  - The left child has the opposite tag, the right child has the tag.
- **Votes**
  - Users can vote for a note using the tree token.
  - In exchange they receive a staked token.
- **Staked Votes**
  - The staking token can be exchanged for the vote token only by withdrawing from the note it was voted on.