use std::collections::HashMap;

use serde::Serialize;

#[derive(Debug, Clone,Serialize)]
pub struct Wallet {
    pub address: String,
    balance: u64,
}

impl Wallet {
    pub fn new(address: &str, initial_balance: u64) -> Self {
        Self {
            address: address.to_string(),
            balance: initial_balance,
        }
    }

    pub fn check_balance(&self) -> u64 {
        self.balance
    }

    pub fn send_funds(&mut self, amount: u64) -> bool {
        if self.balance < amount {
            println!("Transaction failed: Insufficient funds in {}", self.address);
            return false;
        }
        self.balance -= amount;
        true
    }

    pub fn receive_funds(&mut self, amount: u64) {
        self.balance += amount;
    }


}

#[derive(Debug,Clone,Serialize)]
pub struct WalletManager {
    pub wallets: HashMap<String, Wallet>,
}

impl WalletManager {
    pub fn new() -> Self {
        Self {
            wallets: HashMap::new(),
        }
    }

    pub fn send_funds(&mut self, sender: &str, receiver: &str, amount: u64) -> bool{

        if !self.wallets.contains_key(sender) || !self.wallets.contains_key(receiver) {
            println!("Transaction failed: Invalid sender or receiver.");
            return false;
        }

        {
            let sender_wallet = self.wallets.get_mut(sender).unwrap();
            if !sender_wallet.send_funds(amount) {
                return false;
            }
        } 

        {
            let receiver_wallet = self.wallets.get_mut(receiver).unwrap();
            receiver_wallet.receive_funds(amount);
        } 

        println!("Transaction successful: {} -> {} | {} coins", sender, receiver, amount);
        return true;
    }

    pub fn create_wallet(&mut self, address: &str, initial_balance: u64) {
        self.wallets.insert(address.to_string(), Wallet::new(address, initial_balance));
    }

    pub fn get_wallet(&mut self, address: &str) -> &Wallet{
        return self.wallets.get(address).unwrap();
    }

    pub fn get_balance(&mut self, address: &str)-> u64{

        let wallet = self.get_wallet(address);

        return wallet.check_balance()
    }
}
