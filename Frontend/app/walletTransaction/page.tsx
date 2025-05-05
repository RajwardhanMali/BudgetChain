"use client";

import { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import UserContext from "@/context/UserContext";
import * as API from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  ArrowLeft,
  ArrowRight,
  Filter,
  Wallet,
  FileText,
  BarChart3,
  LogOut,
  Bell,
  Settings,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NewTransactionModal } from "@/components/new-transaction-modal";
import { ValidatorApplicationModal } from "@/components/validator-application-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);

  // State for API data
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState({
    mainChain: [],
    branches: {},
  });
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const [validators, setValidators] = useState([]);
  const [networkStatus, setNetworkStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [walletInfo, setWalletInfo] = useState(null);
  const [isValidator, setIsValidator] = useState(false);
  const [validatorVotes, setValidatorVotes] = useState(0);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [branchName, setBranchName] = useState(null);

  // Function to fetch blockchain data
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get blockchain data (includes recent transactions)
      const data = await API.getBlockchain();
      console.log("Fetched Blockchain Data:", data);

      // Ensure `transactions` is set properly
      setTransactions({
        mainChain: data?.main_chain ?? [],
        branches: data?.branches ?? {},
      });

      // Debugging inside useEffect instead of immediately after setTransactions
      console.log("Transactions State (Before Update):", transactions);

      // Get wallet balance
      if (user?.address && user?.password) {
        const balanceData = await API.getBalance(user.address, user.password);
        setBalance(balanceData.balance ?? 0);

        // Get wallet details
        const walletData = await API.getWallet(user.address, user.password);
        setWalletInfo(walletData);
      }

      // Get validators
      const validatorsData = await API.getValidators();
      setValidators(validatorsData.validators ?? []);
      setPendingRequests(Object.keys(validatorsData.pending_requests) ?? []);
      console.log("validators:",validatorsData.validators);
      // Check if current user is a validator
      const isCurrentUserValidator =
        validatorsData.validators?.includes(user?.address);
      setIsValidator(isCurrentUserValidator);

      // Count validator votes if applicable
      setValidatorVotes(validatorsData?.candidateVotes?.[user?.address] ?? 0);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to vote for validator
  const handleVoteForValidator = async (candidateAddress) => {
    if (!user || !user.address || !candidateAddress) {
      setError("Invalid voter or candidate address");
      return;
    }

    try {
      await API.voteForValidator(user.address, candidateAddress);
      fetchDashboardData();
    } catch (err) {
      console.error("Error voting for validator:", err);
      setError("Failed to vote for validator. Please try again.");
    }
  };

  // Function to apply as validator
  const handleValidatorApplication = async () => {
    if (!user || !user.address) {
      setError("User address not found");
      return;
    }
    try {
      await API.requestValidator(user.address);
      fetchDashboardData();
    } catch (err) {
      console.error("Error applying as validator:", err);
      setError("Failed to apply as validator. Please try again.");
    }
  };

  // Function to initiate a new transaction
  const handleNewTransaction = async (receiverAddress, amount) => {
    if (!user || !user.address || !receiverAddress || !amount) {
      setError("Invalid transaction details");
      return;
    }

    try {
      let ans = await API.addTransaction(
        user.address,
        receiverAddress,
        amount
      );
      setMessage("Transaction successful!");
      setMessageType("success"); // ✅ Mark as success
      fetchDashboardData();
    } catch (err) {
      setMessage(`Transaction failed: ${error.message}`);
      setMessageType("error"); // ❌ Mark as error
      console.error("Error creating transaction:", err);
      setError("Failed to create transaction. Please try again.");
    }
  };

  // Calculate total transactions count
  const getTotalTransactionsCount = () => {
    let count = 0;
  
    // Count transactions from the main chain
    if (Array.isArray(transactions?.mainChain)) {
      count += transactions.mainChain.reduce(
        (total, block) => total + (Array.isArray(block.transactions) ? block.transactions.length : 0),
        0
      );
    }
  
    // Count transactions from all branches
    if (transactions?.branches) {
      Object.values(transactions.branches).forEach((branchBlocks) => {
        if (Array.isArray(branchBlocks)) {
          count += branchBlocks.reduce(
            (total, block) => total + (Array.isArray(block.transactions) ? block.transactions.length : 0),
            0
          );
        }
      });
    }
  
    console.log("Total transactions count:", count); // ✅ Debugging log
    return count - 1 < 0 ? 0 : count - 1;
  };
  

  // Get user's branch transactions or an empty array if not found
  const getUserBranchTransactions = () => {
    if (!user?.address || !transactions.branches) return [];
    return transactions.branches[user.address] || [];
  };

  // Get initials for avatar
  const getInitials = () => {
    if (!user || !user.address) return "GC";
    return user.address.substring(0, 2).toUpperCase();
  };

  useEffect(() => {
    console.log("Transactions State (After Update):", transactions);
    console.log("request", pendingRequests);
  }, [transactions, pendingRequests]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000); // Remove after 5 sec
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Fetch data on component mount and when user changes
  useEffect(() => {
    if (user?.address) {
      fetchDashboardData();
      setBranchName("BRANCH-" + user.address);
      console.log("User:", user.address);
    }
  }, [user]);

  const branchNames = Object.keys(transactions.branches);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
  <div className="container flex h-10 items-center justify-between px-4">
    {/* Logo & Title */}
    <div className="flex items-center gap-3">
      <Shield className="h-7 w-7 text-blue-600" />
      <span className="text-2xl font-bold">BudgetChain</span>
    </div>

    {/* Actions (Refresh, Notifications, Profile) */}
    <div className="flex items-center gap-6">
      {/* Refresh Button */}
      <Button variant="ghost" size="icon" onClick={fetchDashboardData} title="Refresh data">
        <RefreshCw className="h-6 w-6" />
      </Button>

      {/* Notification Bell */}
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-6 w-6" />
        <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-600"></span>
      </Button>

      {/* Profile Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="p-2">
          <DropdownMenuLabel className="truncate max-w-56">{user?.address}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Settings className="mr-2 h-5 w-5" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/")}>
            <LogOut className="mr-2 h-5 w-5" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
</header>

      <main className="flex-1 p-4 md:p-8 bg-gray-50 dark:bg-gray-900">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-gray-500 truncate max-w-md">
                Welcome back, {user?.address || "User"}
              </p>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs
            defaultValue="overview"
            className="space-y-4"
            onValueChange={setActiveTab}
            value={activeTab}
          >
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="wallet">Wallet</TabsTrigger>
              <TabsTrigger value="validators">Validators</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
      <Wallet className="h-4 w-4 text-blue-600" />
    </CardHeader>
    <CardContent>
      {loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        <>
          <div className="text-2xl font-bold">₹{balance?.toLocaleString() || "0"}</div>
          <p className="text-xs text-gray-500">Updated {new Date().toLocaleDateString()}</p>
        </>
      )}
    </CardContent>
  </Card>

  {/* Transactions Card (Total Transactions Count) */}
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
      <FileText className="h-4 w-4 text-blue-600" />
    </CardHeader>
    <CardContent>
      {loading ? (
        <Skeleton className="h-8 w-16" />
      ) : (
        <>
          <div className="text-2xl font-bold">
            {getTotalTransactionsCount()}
          </div>
          <p className="text-xs text-gray-500">Total transactions recorded</p>
        </>
      )}
    </CardContent>
  </Card>

  {/* Validator Status Card */}
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Validator Status</CardTitle>
      <Shield className="h-4 w-4 text-blue-600" />
    </CardHeader>
    <CardContent>
      {loading ? (
        <Skeleton className="h-8 w-20" />
      ) : (
        <>
          <div className="text-2xl font-bold">
            {validators.includes(user?.address) ? "Active Validator" : "Not a Validator"}
          </div>
          <p className="text-xs text-gray-500">
            {validators.includes(user?.address)
              ? "You are a validator"
              : `${validatorVotes} votes received`}
          </p>
        </>
      )}
    </CardContent>
  </Card>

  {/* Network Status Card */}
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">Network Status</CardTitle>
      <BarChart3 className="h-4 w-4 text-blue-600" />
    </CardHeader>
    <CardContent>
      {loading ? (
        <Skeleton className="h-8 w-20" />
      ) : (
        <>
          <div className="text-2xl font-bold">{networkStatus?.status || "Healthy"}</div>
          <p className="text-xs text-gray-500">{validators.length} active validators</p>
        </>
      )}
    </CardContent>
  </Card>
              </div>

              <div className="grid gap-4">
                <Card className="col-span-1">
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>
                      Your latest blockchain transactions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {branchNames.length === 0 ? (
                      <p className="text-gray-500 text-center py-6">
                        No recent transactions found.
                      </p>
                    ) : (
                      <div className="space-y-6">
                        {transactions?.branches?.[branchName]?.length > 0 ? (
                          <div className="space-y-4">
                            {transactions.branches[branchName]
                              .flatMap((block) => block.transactions || [])
                              .slice(-3) // Get the last 3 transactions
                              .reverse() // Show newest first
                              .map((tx, txIndex) => (
                                <Card
                                  key={txIndex}
                                  className="border-l-4 border-l-green-600 shadow-md"
                                >
                                  <CardContent className="p-4">
                                    <div className="flex justify-between items-center">
                                      <div className="text-sm font-medium">
                                        <span className="text-gray-700 dark:text-gray-300">
                                          From:
                                        </span>{" "}
                                        {tx.sender}
                                      </div>
                                      <ArrowRight className="h-4 w-4 text-green-600" />
                                      <div className="text-sm font-medium">
                                        <span className="text-gray-700 dark:text-gray-300">
                                          To:
                                        </span>{" "}
                                        {tx.receiver}
                                      </div>
                                    </div>
                                    <div className="mt-2 text-right text-lg font-bold text-green-600">
                                      {tx.amount.toLocaleString()} units
                                    </div>
                                    <div className="text-xs text-gray-500 mt-2">
                                      {new Date(
                                        tx.timestamp * 1000
                                      ).toLocaleString()}
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-center py-6">
                            No recent transactions found.
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab("transactions")}
                    >
                      View All Transactions
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            {/* Transactions Tab */}
            <TabsContent value="transactions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>
                    View all your department's blockchain transactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {branchNames.length === 0 ? (
                    <p className="text-gray-500">
                      No branch transactions found.
                    </p>
                  ) : (
                    <div className="space-y-6">
                      {!transactions.branches[branchName] ? (
                        <p className="text-gray-500">
                          No transactions in this branch.
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {transactions.branches[branchName].map(
                            (block, index) => (
                              <Card
                                key={index}
                                className="border-l-4 border-l-green-600"
                              >
                                <CardContent className="p-4">
                                  <div className="flex flex-col gap-2">
                                    <div className="flex justify-between">
                                      <span className="font-semibold">
                                        Block #{block.index}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {new Date(
                                          block.timestamp * 1000
                                        ).toLocaleString()}
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3 mt-2">
                                      {block.transactions.map((tx, txIndex) => (
                                        <div
                                          key={txIndex}
                                          className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md"
                                        >
                                          <div className="flex justify-between text-sm">
                                            <span className="font-medium">
                                              From: {tx.sender}
                                            </span>
                                            <ArrowRight className="h-4 w-4 text-green-600" />
                                            <span className="font-medium">
                                              To: {tx.receiver}
                                            </span>
                                          </div>
                                          <div className="mt-1 text-right font-bold text-green-600">
                                            {tx.amount.toLocaleString()} units
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-2 truncate">
                                      Hash: {block.hash}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" onClick={fetchDashboardData}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Wallet Tab */}
            <TabsContent value="wallet" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Wallet Details</CardTitle>
                  <CardDescription>
                    Manage your blockchain wallet and funds
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Balance & Transaction Section */}
                    <div className="p-6 border rounded-lg bg-blue-50 dark:bg-blue-950">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        {/* Current Balance Display */}
                        <div>
                          <h3 className="text-lg font-medium">
                            Current Balance
                          </h3>
                          <p className="text-3xl font-bold mt-2">
                            ₹{balance?.toLocaleString() || "0"}
                          </p>
                        </div>

                        {/* Transaction Button */}
                        <div className="flex gap-2">
                          <NewTransactionModal
                            onTransactionComplete={fetchDashboardData}
                            onSubmit={handleNewTransaction}
                            userAddress={user?.address}
                          />
                        </div>
                      </div>

                      {/* Transaction Message (Success or Error) */}
                      {message && (
                        <div
                          className={`p-3 text-center mt-4 rounded-md ${
                            messageType === "success"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {message}
                        </div>
                      )}
                    </div>

                    {/* Wallet Information */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">
                        Wallet Information
                      </h3>
                      <div className="grid gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 border rounded-lg">
                            <p className="text-sm text-gray-500">Address</p>
                            <p className="text-sm font-medium break-all">
                              {user?.address || "N/A"}
                            </p>
                          </div>
                          <div className="p-4 border rounded-lg">
                            <p className="text-sm text-gray-500">Created On</p>
                            <p className="text-sm font-medium">
                              {walletInfo?.createdAt ||
                                new Date().toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 border rounded-lg">
                            <p className="text-sm text-gray-500">Department</p>
                            <p className="text-sm font-medium">
                              {walletInfo?.department || "Not specified"}
                            </p>
                          </div>
                          <div className="p-4 border rounded-lg">
                            <p className="text-sm text-gray-500">Status</p>
                            <p className="text-sm font-medium flex items-center">
                              <span className="h-2 w-2 rounded-full bg-green-600 mr-2"></span>
                              Active
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div>
                      <h3 className="text-lg font-medium mb-4">
                        Recent Activity
                      </h3>
                      <div className="space-y-2">
                        {loading ? (
                          <div className="space-y-4">
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-16 w-full" />
                          </div>
                        ) : transactions.length > 0 ? (
                          transactions.slice(0, 3).map((transaction) => (
                            <div
                              key={transaction.id}
                              className="flex justify-between items-center p-3 border rounded-lg"
                            >
                              <div>
                                <p className="text-sm font-medium">
                                  {transaction.type}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {transaction.date}
                                </p>
                              </div>
                              <div
                                className={`text-sm font-medium ${
                                  transaction.type === "Received"
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {transaction.type === "Received" ? "+" : "-"}₹
                                {transaction.amount.toLocaleString()}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            No recent activity
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button variant="outline" onClick={fetchDashboardData}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh Wallet
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Validators Tab */}
            <TabsContent
              value="validators"
              className="space-y-4 transition-opacity duration-300 ease-in-out"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Network Validators</CardTitle>
                  <CardDescription>
                    Current validators securing the blockchain network
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  ) : (
                    <>
                      <div>
                        <h3 className="text-lg font-medium mb-2">
                          Active Validators
                        </h3>
                        {validators.length > 0 ? (
                          <div className="space-y-4">
                            {validators.map((validator, index) => (
                              <div
                                key={validator.address || index}
                                className="rounded-lg border p-4"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                      <AvatarFallback className="bg-green-100 text-green-600">
                                        {validator
                                          ?.substring(0, 2)
                                          .toUpperCase() || "VA"}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="text-sm font-medium">
                                        {validator || "Validator"}
                                      </p>
                                      <p className="text-xs text-gray-500 truncate max-w-xs">
                                        {validator.address}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                                    <div className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                                      Active
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500">
                            No active validators found.
                          </p>
                        )}
                      </div>

                      <div className="mt-6">
                        <h3 className="text-lg font-medium mb-2">
                          Pending Validator Requests
                        </h3>
                        {pendingRequests.length > 0 ? (
                          <div className="space-y-4">
                            {pendingRequests.length > 0 ? (
                              <div className="space-y-4">
                                {pendingRequests
                                  .filter(
                                    (candidate) => candidate !== user?.address
                                  ) // Exclude current user
                                  .map((candidate, index) => {
                                    const hasVoted = candidateVotes?.[
                                      candidate
                                    ]?.includes(user?.address); // Check if user has voted

                                    return (
                                      <div
                                        key={candidate || index}
                                        className="rounded-lg border p-4"
                                      >
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                                          <div>
                                            <p className="text-sm font-medium">
                                              {candidate}
                                            </p>
                                          </div>
                                          {hasVoted ? (
                                            <span className="text-xs text-gray-500">
                                              Voted
                                            </span> // Mark as voted
                                          ) : (
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() =>
                                                handleVoteForValidator(
                                                  candidate
                                                )
                                              }
                                            >
                                              Vote
                                            </Button>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                              </div>
                            ) : (
                              <p className="text-gray-500">
                                No pending validator requests.
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-gray-500">
                            No pending validator requests.
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
                  <Button variant="outline" onClick={fetchDashboardData}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh Validators
                  </Button>
                  {!isValidator ? (
                    <ValidatorApplicationModal
                      onSubmit={handleValidatorApplication}
                    />
                  ) : null}
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <footer className="border-t py-4 bg-background">
        <div className="container flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500">
          <div>© 2025 GovChain. All rights reserved.</div>
          <div>
            Last block: #{networkStatus?.lastBlock || "N/A"} | Network status:{" "}
            {networkStatus?.status || "Unknown"}
          </div>
        </div>
      </footer>
    </div>
  );
}
