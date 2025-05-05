use std::collections::HashMap;

use serde::Serialize;

#[derive(Debug, Clone,Serialize)]
pub struct Wallet {
    pub address: String,
    balance: u64,
    password: String
}

impl Wallet {
    pub fn new(address: &str,password: &str, initial_balance: u64) -> Self {
        Self {
            address: address.to_string(),
            balance: initial_balance,
            password: password.to_string(),
        }
    }

    pub fn check_balance(&self) -> u64 {
        self.balance
    }

    pub fn get_pass(&self) -> String{
        self.password.to_string()
    }

    pub fn authenticate(&self, password: &str) -> bool {
        self.password == password
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

    pub fn create_wallet(&mut self, address: &str,password: &str, initial_balance: u64) {
        self.wallets.insert(address.to_string(), Wallet::new(address,password,initial_balance));
    }

    pub fn get_wallet(&mut self, address: &str, password: &str) -> Option<Wallet>{

        let w = self.wallets.get(address);

        if w.is_some() {
            if w.unwrap().authenticate(password){
                return Some(w.unwrap().clone());
            } else {
                return None;
            }
        } else {
            return  None;
        }
        
    }

    pub fn get_balance(&mut self, address: &str, password: &str)-> u64{

        let wallet = self.get_wallet(address,password);

        return wallet.unwrap().check_balance()
    }
}
