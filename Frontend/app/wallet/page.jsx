"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ValidatorApplicationModal } from "@/components/validator-application-modal";

// Dummy data
const walletInfo = {
  id: "DEPT-EDU-001",
  name: "Education Department",
  balance: 125000,
  pendingBalance: 5000,
  isValidator: false,
  validatorVotes: 3,
  validatorRequirement: 5,
  transactionsCount: 42,
};

const walletTransactions = [
  {
    id: "TX78901",
    date: "2025-03-15",
    amount: 5000,
    type: "Received",
    from: "Finance Department",
    to: "Education Department",
    status: "Completed",
  },
  {
    id: "TX78902",
    date: "2025-03-14",
    amount: 2500,
    type: "Sent",
    from: "Education Department",
    to: "Health Department",
    status: "Completed",
  },
  {
    id: "TX78903",
    date: "2025-03-12",
    amount: 1200,
    type: "Received",
    from: "Transport Department",
    to: "Education Department",
    status: "Completed",
  },
  {
    id: "TX78904",
    date: "2025-03-10",
    amount: 3000,
    type: "Sent",
    from: "Education Department",
    to: "Infrastructure Department",
    status: "Completed",
  },
  {
    id: "TX78909",
    date: "2025-03-18",
    amount: 1500,
    type: "Sent",
    from: "Education Department",
    to: "Health Department",
    status: "Pending",
  },
];

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-evenly">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">GovChain</span>
          </Link>
          <nav className="hidden md:flex gap-6 items-center">
            <Link
              href="/dashboard"
              className="text-sm font-medium hover:text-blue-600"
            >
              Dashboard
            </Link>
            <Link
              href="/transactions"
              className="text-sm font-medium hover:text-blue-600"
            >
              Transactions
            </Link>
            <Link href="/wallet" className="text-sm font-medium text-blue-600">
              Wallet
            </Link>
            <Link
              href="/validators"
              className="text-sm font-medium hover:text-blue-600"
            >
              Validators
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Logout</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-8 bg-gray-50 dark:bg-gray-900">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Department Wallet
              </h1>
              <p className="text-gray-500">
                {walletInfo.name} ({walletInfo.id})
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-2">
              <Button variant="outline">Receive Funds</Button>
              <Button>Send Funds</Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Available Balance
                </CardTitle>
                <Wallet className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{walletInfo.balance.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500">Updated just now</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Balance
                </CardTitle>
                <Clock className="h-4 w-4 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{walletInfo.pendingBalance.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500">Awaiting confirmation</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Validator Status
                </CardTitle>
                <Shield className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {walletInfo.isValidator ? "Active" : "Inactive"}
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>{walletInfo.validatorVotes} votes</span>
                    <span>{walletInfo.validatorRequirement} required</span>
                  </div>
                  <Progress
                    value={
                      (walletInfo.validatorVotes /
                        walletInfo.validatorRequirement) *
                      100
                    }
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs
            defaultValue="transactions"
            className="space-y-4"
            onValueChange={setActiveTab}
          >
            <TabsList>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="validator">Validator Application</TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>
                    Your department's transaction history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {walletTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between border-b pb-4"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`rounded-full p-2 ${
                              transaction.type === "Received"
                                ? "bg-green-100 text-green-600"
                                : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            {transaction.type === "Received" ? (
                              <ArrowDownLeft className="h-4 w-4" />
                            ) : (
                              <ArrowUpRight className="h-4 w-4" />
                            )}
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">
                              {transaction.type === "Received"
                                ? `Received from ${transaction.from}`
                                : `Sent to ${transaction.to}`}
                            </p>
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-gray-500">
                                {transaction.date}
                              </p>
                              <p className="text-xs text-gray-500">•</p>
                              <p className="text-xs text-gray-500">
                                {transaction.id}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex items-center gap-1 ${
                              transaction.status === "Completed"
                                ? "text-green-600"
                                : "text-amber-600"
                            }`}
                          >
                            {transaction.status === "Completed" ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              <Clock className="h-4 w-4" />
                            )}
                            <span className="text-xs">
                              {transaction.status}
                            </span>
                          </div>
                          <div
                            className={`text-sm font-medium ${
                              transaction.type === "Received"
                                ? "text-green-600"
                                : "text-blue-600"
                            }`}
                          >
                            {transaction.type === "Received" ? "+" : "-"}₹
                            {transaction.amount.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">Export Transaction History</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="validator" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Become a Validator</CardTitle>
                  <CardDescription>
                    Apply to become a validator on the blockchain network
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
                      <h4 className="font-medium">What is a Validator?</h4>
                      <p className="mt-2 text-sm">
                        Validators play a crucial role in verifying transactions
                        and maintaining the integrity of the blockchain network.
                        As a validator, your department will help secure the
                        network and ensure all transactions are legitimate.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Requirements:</h4>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <div
                            className={`rounded-full p-1 ${
                              walletInfo.balance >= 100000
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {walletInfo.balance >= 100000 ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              <AlertCircle className="h-4 w-4" />
                            )}
                          </div>
                          <span className="text-sm">
                            Minimum balance of ₹100,000
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div
                            className={`rounded-full p-1 ${
                              walletInfo.transactionsCount >= 5
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {walletInfo.transactionsCount >= 5 ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              <AlertCircle className="h-4 w-4" />
                            )}
                          </div>
                          <span className="text-sm">
                            At least 5 completed transactions
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="rounded-full p-1 bg-green-100 text-green-600">
                            <CheckCircle2 className="h-4 w-4" />
                          </div>
                          <span className="text-sm">
                            Department must be registered for at least 30 days
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Current Votes:</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-green-100 text-green-600">
                                FD
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">Finance Department</span>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700"
                          >
                            Voted
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-green-100 text-green-600">
                                HD
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">Health Department</span>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700"
                          >
                            Voted
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-green-100 text-green-600">
                                TD
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">
                              Transport Department
                            </span>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700"
                          >
                            Voted
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-gray-500">
                    {walletInfo.validatorVotes} of{" "}
                    {walletInfo.validatorRequirement} votes received
                  </div>
                  {walletInfo.isValidator ? (
                    <Button variant="destructive">Resign as Validator</Button>
                  ) : (
                    <ValidatorApplicationModal />
                  )}
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <footer className="border-t py-4 bg-background">
        <div className="container flex justify-between text-xs text-gray-500">
          <div>© 2025 GovChain. All rights reserved.</div>
          <div>Last block: #45,231 | Network status: Healthy</div>
        </div>
      </footer>
    </div>
  );
}
