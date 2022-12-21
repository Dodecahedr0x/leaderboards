use anchor_lang::prelude::*;

#[constant]
pub const LEADERBOARD_AUTHORITY_SEED: &str = "leaderboard-authority";

#[constant]
pub const LEADERBOARD_SEED: &str = "leaderboard";

#[constant]
pub const ENTRY_SEED: &str = "entry";

#[constant]
pub const NODE_SEED: &str = "node";

#[constant]
pub const NOTE_SEED: &str = "note";

#[constant]
pub const STAKE_SEED: &str = "stake";

#[constant]
pub const BRIBE_SEED: &str = "bribe";

#[constant]
pub const BRIBE_CLAIM_SEED: &str = "bribe-claim";

/// Indicates the maximum nuber of index per group
#[constant]
pub const MAX_ENTRIES_PER_LEADERBOARD: usize = 100;

/// Indicates the maximum depth of the tree
#[constant]
pub const MAX_TAGS: usize = 10;

/// Character length of a tag
#[constant]
pub const MAX_TAG_LENGTH: usize = 48;

/// Maximum number of notes that can be attached to a tree
#[constant]
pub const MAX_NOTES_PER_NODE: usize = 3;

/// The maximum
#[constant]
pub const MAX_CHILD_PER_NODE: usize = 3;

/// Character length of a URI
#[constant]
pub const MAX_URI_LENGTH: usize = 200;

/// Character length of a description
#[constant]
pub const MAX_DESCRIPTION_LENGTH: usize = 200;
