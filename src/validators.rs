use std::collections::{HashMap, HashSet};
use serde::Serialize;

#[derive(Debug,Clone,Serialize)]
pub struct Validators {
    pub validators: HashSet<String>,
    pub pending_requests: HashMap<String, HashSet<String>>,
}

impl Validators {
    pub fn new() -> Self {
        let mut validators = HashSet::new();
        validators.insert("CentralGov".to_string());
        Self {
            validators,
            pending_requests: HashMap::new(),
        }
    }

    pub fn contains(&mut self, agency: &str) -> bool {
        return self.validators.contains(agency)
    }

    pub fn get_pending_request(&self) -> Vec<String> {

        if self.pending_requests.len() > 0 {
            self.pending_requests.keys().cloned().collect()
        } else {
            Vec::new()
        }
        
    }    

    pub fn request_validator(&mut self, agency: &str) {
        if self.validators.contains(agency) {
            println!("{} is already a validator!", agency);
            return;
        }
        self.pending_requests.entry(agency.to_string()).or_insert(HashSet::new());
        println!("{} has requested to become a validator.", agency);
    }

    pub fn vote_for_validator(&mut self, voter: &str, candidate: &str) {
        if !self.validators.contains(voter) {
            println!("{} is not a validator and cannot vote!", voter);
            return;
        }
        if let Some(votes) = self.pending_requests.get_mut(candidate) {
            votes.insert(voter.to_string());
            println!("{} voted for {} to become a validator.", voter, candidate);
            self.check_validator_approval(candidate);
        } else {
            println!("No active request for {}.", candidate);
        }
    }

    fn check_validator_approval(&mut self, candidate: &str) {
        if let Some(votes) = self.pending_requests.get(candidate) {
            let required_votes = (self.validators.len() as f64 * (2.0 / 3.0)).ceil() as usize;
            if votes.len() >= required_votes {
                self.validators.insert(candidate.to_string());
                self.pending_requests.remove(candidate);
                println!("{} has been approved as a validator!", candidate);
            }
        }
    }
}
