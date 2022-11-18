# Dippies Index Protocol

Anchor implementation of the Dippies Index Protocol, a token-curated binary tree registry where participants stake on notes to increase their exposure.

## Concepts

- **Forest**
  - The forest is the base upon which trees grow.
  - A forest defines the token used to stake.
- **Trees**
  - Trees are the basis are the base for the binary tree.
  - They are linked to their respective root node.
  - Each tree has a distinct title that defines what subsequent nodes and notes are about.
- **Node**
  - A node is a component of a tree.
  - By default, nodes are not attached to a parent.
    - To attach a node to a parent, the parent must either have room for more child, or the node must have more votes than some other child to replace it.
    - Nodes are created below a parent and can only stay there, only replacements are allowed.
  - Each node has a set a tags, inherited from their parent.
  - Each node has a set of notes. Notes attached to a node have AT LEAST the same tags as the node.
- **Note**
  - A note is attached to a node.
  - A note has a set of tags inherited from the parent node it was created on.
  - A note can only be created on a leaf node, a node without children.
  - Users can vote for a note.
  - Notes are connected to a node but have two states: attached or floating.
  - By default, notes are not attached to a node.
    - To attach a note to a parent, the parent must either have room for more notes, or the note must have more votes than some other note to replace it.
    - Notes are created on a node but can also move to any other node that has AT LEAST the same tags as the note.
    - Notes can also replace any other note attached to a node if it has more votes.
- **Votes**
  - Users can vote for a note using the root token.
  - Votes on a note are transmitted to the attached node and the tree.