use serde::Serialize;
use sha2::{Sha256, Digest};
use chrono::Utc;
use crate::transaction::Transaction;

#[derive(Debug, Clone,Serialize)]
pub struct Block {
    pub index: u64,
    pub timestamp: u128,
    pub parent_hash: String,
    pub branch_id: String,
    pub transactions: Vec<Transaction>,
    pub hash: String,
}

impl Block {
    pub fn new(index: u64, parent_hash: &str, branch_id: &str, transactions: Vec<Transaction>) -> Self {
        let timestamp = Utc::now().timestamp_millis() as u128;
        let block_data = format!("{}-{}-{}-{:?}", index, parent_hash, branch_id, transactions);
        let block_hash = Sha256::digest(block_data.as_bytes());
        Self {
            index,
            timestamp,
            parent_hash: parent_hash.to_string(),
            branch_id: branch_id.to_string(),
            transactions,
            hash: format!("{:x}", block_hash),
        }
    }

    // pub fn display_block(block: &Block) {
    //     println!(
    //         "  ──────────────────────────\n  Block #{}\n  ──────────────────────────",
    //         block.index
    //     );
    //     println!("  Branch ID   : {}", block.branch_id);
    //     println!("  Parent Hash : {}", block.parent_hash.chars().collect::<String>());
    //     println!("  Hash        : {}", block.hash.chars().collect::<String>());
    //     println!("  Timestamp   : {}", block.timestamp);
    //     println!("  Transactions:");
    //     for tx in &block.transactions {
    //         println!(
    //             "    - [{}] {} -> {} | {} coins | Timestamp: {}",
    //             tx.tx_id.chars().collect::<String>(),
    //             tx.sender,
    //             tx.receiver,
    //             tx.amount,
    //             tx.timestamp
    //         );
    //     }
    // }
}
