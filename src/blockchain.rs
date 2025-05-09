use std::collections::HashMap;
use serde::Serialize;

use crate::block::Block;
use crate::transaction::Transaction;
use crate::validators::Validators;
use crate::wallet::WalletManager;

#[derive(Debug,Clone,Serialize)]
pub struct Blockchain {
    pub main_chain: Vec<Block>,
    pub branches: HashMap<String, Vec<Block>>,
    pub validators: Validators,
    pub wallet_manager: WalletManager, 
}

impl Blockchain {
    pub fn new() -> Self {
        let validators = Validators::new();
        let genesis_block = Block::new(0, "0", "MAIN", vec![]);
        let mut wallet_manager = WalletManager::new();
        wallet_manager.create_wallet("CentralGov","abc@123", 1_000_000);
        let mut main_chain = Vec::new();
        main_chain.push(genesis_block);
        Self {
            main_chain,
            branches: HashMap::new(),
            validators,
            wallet_manager
        }        
    }

    pub fn add_transaction(&mut self, sender: &str, receiver: &str, amount: u64) -> bool{
        
        if !self.wallet_manager.wallets.contains_key(sender) || !self.wallet_manager.wallets.contains_key(receiver) {
            println!("Transaction failed: Sender or receiver does not have a valid wallet.");
            return false;
        }
    
        if sender == "CentralGovt" && !self.validators.contains(receiver) {
            println!("Transaction failed: {} is not an approved validator!", receiver);
            return false;
        }
    
        if !self.wallet_manager.send_funds(sender, receiver, amount) {
            println!("Transaction failed: Insufficient funds.");
            return false;
        }
    
        let tx = Transaction::new(sender, receiver, amount);
        let last_block = self.main_chain.last().unwrap();
        let new_block = Block::new(last_block.index + 1, &last_block.hash, "MAIN", vec![tx.clone()]);
        self.main_chain.push(new_block.clone());
    
        if sender == "CentralGov" {
            self.create_branch(receiver, new_block.clone());
            println!("Branch Created for {}",receiver);
        }
    
        println!("Transaction successful: {} -> {} | {} coins", sender, receiver, amount);

        return true;
    }
    


    pub fn create_branch(&mut self, department_id: &str, genesis_block: Block) {
        let branch_id = format!("BRANCH-{}", department_id);
        self.branches.insert(branch_id.clone(), vec![genesis_block.clone()]);
    }

    pub fn add_branch_transaction(&mut self, department_id: &str, receiver: &str, amount: u64) -> bool{

        if !self.wallet_manager.wallets.contains_key(department_id) || !self.wallet_manager.wallets.contains_key(receiver) {
            println!("Transaction failed: Sender or receiver does not have a valid wallet.");
            return false;
        }
        
        if !self.validators.contains(department_id) {
            println!("Transaction failed: {} is not a validator and cannot process transactions.", department_id);
            return false;
        }

        let branch_id = format!("BRANCH-{}", department_id);
        dbg!(branch_id.clone());
        if let Some(branch) = self.branches.get_mut(&branch_id) {

            if !self.wallet_manager.send_funds(department_id, receiver, amount) {
                println!("Transaction failed: Insufficient funds.");
                return false;
            }

            let tx = Transaction::new(department_id, receiver, amount);
            let last_block = branch.last().unwrap();
            let new_block = Block::new(last_block.index + 1, &last_block.hash, &branch_id, vec![tx.clone()]);
            branch.push(new_block);
            return true;
        } else {
            println!("Branch {} not found.", department_id);
            return false;
        }
    }

    // pub fn display_chain(&self) {
    //     println!("\n========== Main Chain ==========");
    //     for block in &self.main_chain {
    //         Block::display_block(block);
    //     }

    //     println!("\n========== Branches ==========");
    //     for (branch_id, chain) in &self.branches {
    //         println!("\n>> Branch: {}", branch_id);
    //         for block in chain {
    //             Block::display_block(block);
    //         }
    //     }
    // }
}

