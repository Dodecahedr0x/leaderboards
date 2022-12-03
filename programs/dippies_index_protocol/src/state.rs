use crate::constants::*;
use anchor_lang::prelude::*;

#[account]
pub struct Forest {
    /// The ID of the forest
    pub id: Pubkey,

    /// The token used to vote for a tag
    pub vote_mint: Pubkey,

    /// Admin of the forest
    pub admin: Pubkey,

    /// Cost to create a tree from this forest
    pub tree_creation_fee: u64,
}

impl Forest {
    pub const LEN: usize = 8 + 3 * 32 + 8;
}

#[account]
pub struct Tree {
    /// The forest this tree grows in
    pub forest: Pubkey,

    /// The root node of the tree
    pub root_node: Pubkey,

    /// Title of the tree
    pub title: String,

    /// Total staked on this tree
    pub stake: u64,
}

impl Tree {
    pub const LEN: usize = 8 + 2 * 32 + (4 + MAX_TAG_LENGTH);
}

#[account]
pub struct Node {
    /// The tree this node belongs to
    pub tree: Pubkey,

    /// The parent of this node
    pub parent: Pubkey,

    /// The total staked on notes of this node
    pub stake: u64,

    /// The set of tags of this node
    pub tags: Vec<String>,

    /// Children nodes
    pub children: Vec<Pubkey>,

    /// The set of notes currently attached to this node
    pub notes: Vec<Pubkey>,
}

impl Node {
    pub const LEN: usize = 8 // Discriminator
        + 32 // Tree
        + 32 // Parent
        + (4 + MAX_CHILD_PER_NODE * 32) // Children
        + 8 // Stake
        + (4 + (4 + MAX_TAG_LENGTH) * MAX_TAGS) // Tags
        + (4 + MAX_NOTES_PER_NODE * 32); // Notes
}

#[account]
pub struct Note {
    /// Unique noteidetifier
    pub id: Pubkey,

    /// The tree this onte belongs to
    pub tree: Pubkey,

    /// The node this note is attached to
    pub parent: Pubkey,

    /// The stake currently on this note
    pub stake: u64,

    /// The total stake accumulated per unit of time
    pub accumulated_stake: u64,

    /// The last time this note was updated
    pub last_update: i64,

    /// The title of the note
    pub title: String,

    /// The website the note points to
    pub website: String,

    /// Thecoverimage ofthe note
    pub image: String,

    /// A short description of the website the note points to
    pub description: String,

    /// The set of tags on this node
    pub tags: Vec<String>,
}

impl Note {
    pub const LEN: usize = 8 // Discriminator
        + 32 // ID
        + 32 // Tree
        + 32 // Parent
        + 8  // Stake
        + 8  // Accumulated Stake
        + 8  // Last Update
        + (4 + MAX_TAG_LENGTH) // Title
        + (4 + MAX_URI_LENGTH) * 2 // Website and image
        + (4 + MAX_DESCRIPTION_LENGTH) // Description
        + (4 + MAX_TAGS * MAX_TAG_LENGTH); // Tags
}

#[account]
pub struct StakeState {
    /// The staker owning this account
    pub staker: Pubkey,

    /// The note staked on
    pub note: Pubkey,

    /// The amount currently staked
    pub stake: u64,

    /// The amount currently staked
    pub accumulated_stake: u64,

    /// The last time this account was updated
    pub last_update: i64,
}

impl StakeState {
    pub const LEN: usize = 8 // Discriminator
        + 32 // Staker
        + 32 // Note
        + 8  // Stake
        + 8  // Accumulated stake
        + 8; // Update
}

#[account]
pub struct Bribe {
    /// The note receiving the bribe
    pub note: Pubkey,

    /// The mint of the bribe
    pub bribe_mint: Pubkey,

    /// Claimable bribe amount
    pub amount: u64,

    /// The accumulated shares at the last update
    pub accumulated_stake: u64,

    /// The last time the bribe was updated
    pub last_update: i64,
}

impl Bribe {
    pub const LEN: usize = 8 // Discriminator
        + 32 // Note
        + 32 // Mint
        + 8  // Claimable amount
        + 8  // Accumulated stake
        + 8; // Update
}

#[account]
pub struct BribeClaim {
    /// The bribe being claimed
    pub bribe: Pubkey,

    /// The claimant
    pub claimant: Pubkey,

    /// The accumulated shares at the last update
    pub accumulated_stake: u64,

    /// The last time the bribe was updated
    pub last_update: i64,
}

impl BribeClaim {
    pub const LEN: usize = 8 // Discriminator
        + 32 // Bribe
        + 32 // Claimant
        + 8  // Accumulated stake
        + 8; // Update
}
