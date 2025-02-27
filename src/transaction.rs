use sha2::{Sha256, Digest};
use chrono::Utc;

#[derive(Debug, Clone)]
pub struct Transaction {
    pub tx_id: String,
    pub sender: String,
    pub receiver: String,
    pub amount: u64,
    pub timestamp: u128,  
}

impl Transaction {
    pub fn new(sender: &str, receiver: &str, amount: u64) -> Self {
        let timestamp = Utc::now().timestamp_millis() as u128;
        let tx_id = format!("{}-{}-{}-{}", sender, receiver, amount, timestamp);
        let tx_hash = Sha256::digest(tx_id.as_bytes());
        Self {
            tx_id: format!("{:x}", tx_hash),
            sender: sender.to_string(),
            receiver: receiver.to_string(),
            amount,
            timestamp,
        }
    }
}