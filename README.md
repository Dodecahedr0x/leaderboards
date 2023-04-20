# Leaderboards

Anchor implementation of Leaderboards, a token-curated registry where participants stake on leaderboard's entries to increase their exposure.

## Design

- **Leaderboard**
  - Anybody can create a leaderboard
    - When creating a leaderboard, the creator mints an NFT that represents their authority over the leaderboard.
    - The creator decides at the time of creation of a constant fee that will be paid to the holder of the authority NFT when someone creates a new entry in the leaderboard.
    - The token used to pay the fee is also the token used to vote on entries
  - Leaderboards have unbounded size
  - Leaderboards have immutable parameters.
    - To help build trust in the leaderboard, its parameters can never change.
- **Entries**
  - Anybody can create new entries
    - Entry creators however need to pay a fee in the leaderboard's token
    - When creating an entry, the creator also creates an NFT and its metadata can be used as the entry's content
  - New entries are always added at the last position
- **Stake**
  - Anybody can stake on an entry
  - If an entry has a higher stake than another entry with a lower rank (lower is better), the two entries can be swapped.
