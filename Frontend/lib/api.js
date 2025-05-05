const API_BASE_URL = "http://localhost:8000"; // Update if using a different port

export async function getBlockchain() {
    const response = await fetch(`${API_BASE_URL}/blockchain`);
    return response.json();
}

export async function addTransaction(sender, receiver, amount) {
    const response = await fetch(`${API_BASE_URL}/transaction`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json", 
            "Accept": "application/json"
        },
        body: JSON.stringify({ 
            sender, 
            receiver, 
            amount: Number(amount)  // ✅ Convert to number
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to add branch transaction: ${errorData.message || response.statusText}`);
    }

    return response.json();
}

export async function createWallet(name, password) {
    
    const response = await fetch(`${API_BASE_URL}/create-wallet/${name}/${password}`, {
        method: "POST",
    });

    if (!response.ok) {
        throw new Error("Failed to create wallet. Try again.");
    } else
    return response.json();
}

export async function requestValidator(name) {
    const response = await fetch(`${API_BASE_URL}/request-validator/${name}`, {
        method: "POST",
    });
    return response.json();
}

export async function voteForValidator(voter, candidate) {
    const response = await fetch(`${API_BASE_URL}/vote-for-validator/${voter}/${candidate}`, {
        method: "POST",
    });
    return response.json();
}

export async function addBranchTransaction(branch, vendor, amount) {
    const response = await fetch(`${API_BASE_URL}/branch-transaction`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json", 
            "Accept": "application/json"
        },
        body: JSON.stringify({ 
            branch, 
            vendor, 
            amount: Number(amount)  // ✅ Convert to number
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to add branch transaction: ${errorData.message || response.statusText}`);
    }

    return response.json();
}


export async function displayChain() {
    const response = await fetch(`${API_BASE_URL}/display-chain`);
    return response.json();
}

export async function getValidators() {
    const response = await fetch(`${API_BASE_URL}/validators`);
    return response.json();
}

export async function getWallet(address, password) {
    const response = await fetch(`${API_BASE_URL}/wallet/${address}/${password}`);
    return response.json();
}

export async function getBalance(address, password) {
    const response = await fetch(`${API_BASE_URL}/balance/${address}/${password}`);
    return response.json();
}

export async function getPendingRequests() {
    return fetchAPI("/pending-requests");
}
