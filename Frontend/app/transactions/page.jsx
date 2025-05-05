"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ArrowLeft, ArrowRight, Filter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getBlockchain } from "@/lib/api";

export default function PublicLedger() {
  const [transactions, setTransactions] = useState({
    mainChain: [],
    branches: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBlockchainData = async () => {
      try {
        setLoading(true);
        const data = await getBlockchain();
        setTransactions({
          mainChain: data.main_chain || [],
          branches: data.branches || {}
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to load blockchain data. Please try again later.');
        setLoading(false);
      }
    };

    loadBlockchainData();

    const interval = setInterval(loadBlockchainData, 30000);

    return () => clearInterval(interval);
  }, []);

  // Get all branch names
  const branchNames = Object.keys(transactions.branches);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full  border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-evenly">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">
              <Link href="../"> 
                BudgetChain
              </Link>
            </span>
          </div>
          <nav className="hidden md:flex gap-6 items-center">
            <Link
              href="/transactions"
              className="text-sm font-medium underline hover:underline underline-offset-4"
            >
              Public Ledger
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Register</Button>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container py-8">
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter">Public Ledger</h1>
            <p className="text-gray-500 dark:text-gray-400">
              View all transactions recorded on the blockchain, including both main chain and departmental branches.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <Card className="bg-red-50 border-red-200">
              <CardContent className="pt-6">
                <p className="text-red-600">{error}</p>
                <Button onClick={() => window.location.reload()} className="mt-4">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="main" className="w-full">
              <TabsList className="grid grid-cols-2 lg:grid-cols-4 mb-4">
                <TabsTrigger value="main">Main Chain</TabsTrigger>
                <TabsTrigger value="all-branches">All Branches</TabsTrigger>
                {branchNames.length > 0 && (
                  <TabsTrigger value="branch-selector">Select Branch</TabsTrigger>
                )}
                <TabsTrigger value="statistics">Statistics</TabsTrigger>
              </TabsList>
              
              <TabsContent value="main">
                <Card>
                  <CardHeader>
                    <CardTitle>Main Chain Transactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {transactions.mainChain.length === 0 ? (
                      <p className="text-gray-500">No transactions found in the main chain.</p>
                    ) : (
                      <div className="space-y-4">
                        {transactions.mainChain.map((block, index) => (
                          <Card key={index} className="border-l-4 border-l-blue-600">
                            <CardContent className="p-4">
                              <div className="flex flex-col gap-2">
                                <div className="flex justify-between">
                                  <span className="font-semibold">Block #{block.index}</span>
                                  <span className="text-xs text-gray-500">{new Date(block.timestamp * 1000).toLocaleString()}</span>
                                </div>
                                <div className="grid grid-cols-1 gap-3 mt-2">
                                  {block.transactions.map((tx, txIndex) => (
                                    <div key={txIndex} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                                      <div className="flex justify-between text-sm">
                                        <span className="font-medium">From: {tx.sender}</span>
                                        <ArrowRight className="h-4 w-4 text-blue-600" />
                                        <span className="font-medium">To: {tx.receiver}</span>
                                      </div>
                                      <div className="mt-1 text-right font-bold text-blue-600">
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
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="all-branches">
                <Card>
                  <CardHeader>
                    <CardTitle>All Branch Transactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {branchNames.length === 0 ? (
                      <p className="text-gray-500">No branch transactions found.</p>
                    ) : (
                      <div className="space-y-6">
                        {branchNames.map((branchName) => (
                          <div key={branchName} className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">{branchName} Branch</h3>
                            {transactions.branches[branchName].length === 0 ? (
                              <p className="text-gray-500">No transactions in this branch.</p>
                            ) : (
                              <div className="space-y-4">
                                {transactions.branches[branchName].map((block, index) => (
                                  <Card key={index} className="border-l-4 border-l-blue-600">
                                    <CardContent className="p-4">
                                      <div className="flex flex-col gap-2">
                                        <div className="flex justify-between">
                                          <span className="font-semibold">Block #{block.index}</span>
                                          <span className="text-xs text-gray-500">{new Date(block.timestamp * 1000).toLocaleString()}</span>
                                        </div>
                                        <div className="grid grid-cols-1 gap-3 mt-2">
                                          {block.transactions.map((tx, txIndex) => (
                                            <div key={txIndex} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                                              <div className="flex justify-between text-sm">
                                                <span className="font-medium">From: {tx.sender}</span>
                                                <ArrowRight className="h-4 w-4 text-blue-600" />
                                                <span className="font-medium">To: {tx.receiver}</span>
                                              </div>
                                              <div className="mt-1 text-right font-bold text-blue-600">
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
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="branch-selector">
                <Card>
                  <CardHeader>
                    <CardTitle>Branches</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {branchNames.map((branchName) => (
                        <Card key={branchName} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-4 flex flex-col gap-2">
                            <h3 className="font-semibold">{branchName}</h3>
                            <p className="text-sm text-gray-500">
                              {transactions.branches[branchName].length} blocks
                            </p>
                            <p className="text-sm text-gray-500">
                              {transactions.branches[branchName].reduce((total, block) => total + block.transactions.length, 0)} transactions
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="statistics">
                <Card>
                  <CardHeader>
                    <CardTitle>Blockchain Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4 flex flex-col items-center justify-center gap-2">
                          <span className="text-2xl font-bold text-blue-600">{transactions.mainChain.length}</span>
                          <span className="text-sm text-gray-500">Main Chain Blocks</span>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 flex flex-col items-center justify-center gap-2">
                          <span className="text-2xl font-bold text-green-600">{branchNames.length}</span>
                          <span className="text-sm text-gray-500">Total Branches</span>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4 flex flex-col items-center justify-center gap-2">
                          <span className="text-2xl font-bold text-purple-600">
                            {transactions.mainChain.reduce((total, block) => total + block.transactions.length, 0) + 
                              Object.values(transactions.branches).reduce((total, branch) => 
                                total + branch.reduce((branchTotal, block) => branchTotal + block.transactions.length, 0), 0) - 1 >= 0 ? transactions.mainChain.reduce((total, block) => total + block.transactions.length, 0) + 
                              Object.values(transactions.branches).reduce((total, branch) => 
                                total + branch.reduce((branchTotal, block) => branchTotal + block.transactions.length, 0), 0) - 1 : 0}
                          </span>
                          <span className="text-sm text-gray-500">Total Transactions</span>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
      
      <footer className="border-t bg-gray-50 dark:bg-gray-950">
        <div className="container py-6">
          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            © 2025 BudgetChain. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}