mod blockchain;
mod block;
mod transaction;
mod validators;
mod wallet;

use blockchain::Blockchain;

fn main() {
    let mut blockchain = Blockchain::new();
    blockchain.wallet_manager.create_wallet("Vendor_X", 0);
    blockchain.wallet_manager.create_wallet("Vendor_Y", 0);

    blockchain.validators.request_validator("Dept_A");
    blockchain.validators.vote_for_validator("CentralGov", "Dept_A");
    
    blockchain.wallet_manager.create_wallet("Dept_A", 0);
    
    blockchain.add_transaction("CentralGov", "Dept_A", 100000);
    blockchain.validators.request_validator("Dept_B");
    blockchain.validators.request_validator("Dept_C");
    
    blockchain.validators.vote_for_validator("Dept_A", "Dept_B");
    blockchain.validators.vote_for_validator("CentralGov", "Dept_B");
    blockchain.wallet_manager.create_wallet("Dept_B", 0);
    blockchain.validators.vote_for_validator("Dept_A", "Dept_C");
    blockchain.validators.vote_for_validator("CentralGov", "Dept_C");

    blockchain.add_transaction("CentralGov", "Dept_B", 200000);
    blockchain.add_branch_transaction("Dept_A", "Vendor_X", 50000);
    blockchain.add_branch_transaction("Dept_B", "Vendor_Y", 100000);
    dbg!(blockchain.wallet_manager.clone());

    blockchain.display_chain();
    println!("Final Validators: {:?}", blockchain.validators);
} 

