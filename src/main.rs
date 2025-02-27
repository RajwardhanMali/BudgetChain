mod blockchain;
mod block;
mod transaction;
mod validators;
mod wallet;

use blockchain::Blockchain;
use serde::Deserialize;
use std::sync::{Arc, Mutex};
use tokio::net::TcpListener;
use axum::{
    routing::{get, post},
    Json, Router, extract::State,
};

#[derive(Clone)]
struct AppState {
    blockchain: Arc<Mutex<Blockchain>>,
}

#[tokio::main]
async fn main() {
    
    let blockchain = Blockchain::new();
    let shared_state = Arc::new(Mutex::new(blockchain));
    
    let app = Router::new()
        .route("/blockchain", get(get_blockchain))
        .route("/transaction", post(add_transaction))
        .route("/wallet/:address", get(get_wallet_balance))
        .route("/create-wallet/:name/:balance", post(create_wallet))
        .route("/request-validator/:name", post(request_validator))
        .route("/vote-for-validator/:voter/:candidate", post(vote_for_validator))
        .route("/branch-transaction", post(add_branch_transaction))
        .route("/display-chain", get(display_chain))
        .route("/validators", get(get_validators))
        .with_state(AppState { blockchain: shared_state });
    
    let listener = TcpListener::bind("0.0.0.0:8000").await.unwrap();
    println!("🚀 Server running on http://localhost:8000");
    axum::serve(listener, app).await.unwrap();
}

async fn get_blockchain(
    State(state): State<AppState>
) -> Json<serde_json::Value> {
    let blockchain = state.blockchain.lock().unwrap();
    Json(serde_json::to_value(&*blockchain).unwrap())
}

#[derive(Deserialize)]
struct TransactionRequest {
    sender: String,
    receiver: String,
    amount: u64,
}

async fn add_transaction(
    State(state): State<AppState>,
    Json(payload): Json<TransactionRequest>,
) -> Json<serde_json::Value> {
    let mut blockchain = state.blockchain.lock().unwrap();
    if blockchain.add_transaction(&payload.sender, &payload.receiver, payload.amount){
        return Json(serde_json::json!({"status": "Transaction successful"}))
    } else {
        return Json(serde_json::json!({"status": "Transaction failed"}))
    }
       
}

async fn get_wallet_balance(
    State(state): State<AppState>,
    axum::extract::Path(address): axum::extract::Path<String>,
) -> Json<serde_json::Value> {
    let mut blockchain = state.blockchain.lock().unwrap();
    let balance = blockchain.wallet_manager.get_wallet(&address);
    Json(serde_json::json!({ "balance": balance }))
}

async fn create_wallet(
    State(state): State<AppState>,
    axum::extract::Path((name, balance)): axum::extract::Path<(String, u64)>,
) -> Json<serde_json::Value> {
    let mut blockchain = state.blockchain.lock().unwrap();
    blockchain.wallet_manager.create_wallet(&name, balance);
    Json(serde_json::json!({
        "status": "Wallet created successfully",
        "name": name,
        "balance": balance
    }))
}

async fn request_validator(
    State(state): State<AppState>,
    axum::extract::Path(name): axum::extract::Path<String>,
) -> Json<serde_json::Value> {
    let mut blockchain = state.blockchain.lock().unwrap();
    blockchain.validators.request_validator(&name);
    Json(serde_json::json!({
        "status": "Validator request submitted",
        "candidate": name
    }))
}

async fn vote_for_validator(
    State(state): State<AppState>,
    axum::extract::Path((voter, candidate)): axum::extract::Path<(String, String)>,
) -> Json<serde_json::Value> {
    let mut blockchain = state.blockchain.lock().unwrap();
    blockchain.validators.vote_for_validator(&voter, &candidate);
    Json(serde_json::json!({
        "status": "Vote cast successfully",
        "voter": voter,
        "candidate": candidate
    }))
}

#[derive(Deserialize)]
struct BranchTransactionRequest {
    branch: String,
    vendor: String,
    amount: u64,
}

async fn add_branch_transaction(
    State(state): State<AppState>,
    Json(payload): Json<BranchTransactionRequest>,
) -> Json<serde_json::Value> {
    let mut blockchain = state.blockchain.lock().unwrap();
    if blockchain.add_branch_transaction(&payload.branch, &payload.vendor, payload.amount){
        Json(serde_json::json!({
            "status": "Branch transaction added successfully",
            "branch": payload.branch,
            "vendor": payload.vendor,
            "amount": payload.amount
        }))
    } else {
        Json(serde_json::json!({
            "status": "Transaction failed",
        }))
    }
    
}

async fn display_chain(
    State(state): State<AppState>,
) -> Json<serde_json::Value> {
    let blockchain = state.blockchain.lock().unwrap();

    let main_chain = serde_json::to_value(&blockchain.main_chain).unwrap();
    let branches = serde_json::to_value(&blockchain.branches).unwrap(); // Serialize branches

    Json(serde_json::json!({
        "main_chain": main_chain,
        "branches": branches,
        "total_main_blocks": blockchain.main_chain.len(),
        "total_branches": blockchain.branches.len()
    }))
}

async fn get_validators(
    State(state): State<AppState>,
) -> Json<serde_json::Value> {
    let blockchain = state.blockchain.lock().unwrap();
    Json(serde_json::to_value(&blockchain.validators).unwrap())
}

// Commented code left as is
// fn main() {
//     let mut blockchain = Blockchain::new();
//     blockchain.wallet_manager.create_wallet("Vendor_X", 0);
//     blockchain.wallet_manager.create_wallet("Vendor_Y", 0);

//     blockchain.validators.request_validator("Dept_A");
//     blockchain.validators.vote_for_validator("CentralGov", "Dept_A");
    
//     blockchain.wallet_manager.create_wallet("Dept_A", 0);
    
//     blockchain.add_transaction("CentralGov", "Dept_A", 100000);
//     blockchain.validators.request_validator("Dept_B");
//     blockchain.validators.request_validator("Dept_C");
    
//     blockchain.validators.vote_for_validator("Dept_A", "Dept_B");
//     blockchain.validators.vote_for_validator("CentralGov", "Dept_B");
//     blockchain.wallet_manager.create_wallet("Dept_B", 0);
//     blockchain.validators.vote_for_validator("Dept_A", "Dept_C");
//     blockchain.validators.vote_for_validator("CentralGov", "Dept_C");

//     blockchain.add_transaction("CentralGov", "Dept_B", 200000);
//     blockchain.add_branch_transaction("Dept_A", "Vendor_X", 50000);
//     blockchain.add_branch_transaction("Dept_B", "Vendor_Y", 100000);
//     dbg!(blockchain.wallet_manager.clone());

//     blockchain.display_chain();
//     println!("Final Validators: {:?}", blockchain.validators);
// }