"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Shield, Search, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ValidatorApplicationModal } from "@/components/validator-application-modal";

// Dummy data for validators
const validators = [
  {
    id: "DEPT-FIN-001",
    name: "Finance Department",
    status: "Active",
    since: "2024-12-10",
    transactions: 156,
    votes: 8,
    avatar: "FD",
  },
  {
    id: "DEPT-HLT-001",
    name: "Health Department",
    status: "Active",
    since: "2025-01-15",
    transactions: 89,
    votes: 7,
    avatar: "HD",
  },
  {
    id: "DEPT-TRN-001",
    name: "Transport Department",
    status: "Pending",
    since: "2025-03-01",
    transactions: 42,
    votes: 3,
    avatar: "TD",
  },
  {
    id: "DEPT-INF-001",
    name: "Infrastructure Department",
    status: "Pending",
    since: "2025-03-05",
    transactions: 37,
    votes: 4,
    avatar: "ID",
  },
  {
    id: "DEPT-AGR-001",
    name: "Agriculture Department",
    status: "Inactive",
    since: "2025-02-20",
    transactions: 28,
    votes: 2,
    avatar: "AD",
  },
];

// Dummy data for current department
const departmentInfo = {
  id: "DEPT-EDU-001",
  name: "Education Department",
  isValidator: false,
  canVote: true,
  votesRemaining: 3,
  votedFor: ["DEPT-FIN-001", "DEPT-HLT-001"],
};

export default function ValidatorsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredValidators = validators.filter(
    (validator) =>
      validator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      validator.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVote = (validatorId) => {
    console.log(`Voted for ${validatorId}`);
    // In a real app, this would send a vote transaction to the blockchain
  };

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
              href="/walletTransaction"
              className="text-sm font-medium hover:text-blue-600"
            >
              Transactions
            </Link>
            <Link
              href="/validators"
              className="text-sm font-medium text-blue-600"
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
                Network Validators
              </h1>
              <p className="text-gray-500">
                View and vote for validators on the blockchain network
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <ValidatorApplicationModal />
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Voting Status</CardTitle>
              <CardDescription>
                As a department, you can vote for validators to secure the
                network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Validator Status</h4>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`${
                        departmentInfo.isValidator
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-50 text-gray-700"
                      }`}
                    >
                      {departmentInfo.isValidator
                        ? "Active Validator"
                        : "Not a Validator"}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Votes Cast</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">
                      {departmentInfo.votedFor.length}
                    </span>
                    <span className="text-gray-500">of</span>
                    <span className="text-lg font-bold">
                      {departmentInfo.votedFor.length +
                        departmentInfo.votesRemaining}
                    </span>
                  </div>
                  <Progress
                    value={
                      (departmentInfo.votedFor.length /
                        (departmentInfo.votedFor.length +
                          departmentInfo.votesRemaining)) *
                      100
                    }
                    className="h-2"
                  />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Votes Remaining</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">
                      {departmentInfo.votesRemaining}
                    </span>
                    <span className="text-gray-500">votes available</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="relative mb-6">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search validators by name or ID"
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Validators</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>All Validators</CardTitle>
                  <CardDescription>
                    Complete list of active and pending validators
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredValidators.map((validator) => (
                      <div key={validator.id} className="rounded-lg border p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback
                                className={`${
                                  validator.status === "Active"
                                    ? "bg-green-100 text-green-600"
                                    : validator.status === "Pending"
                                    ? "bg-amber-100 text-amber-600"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {validator.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">{validator.name}</h4>
                              <p className="text-sm text-gray-500">
                                {validator.id}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={`${
                                  validator.status === "Active"
                                    ? "bg-green-50 text-green-700"
                                    : validator.status === "Pending"
                                    ? "bg-amber-50 text-amber-700"
                                    : "bg-gray-50 text-gray-700"
                                }`}
                              >
                                {validator.status === "Active" && (
                                  <CheckCircle2 className="mr-1 h-3 w-3" />
                                )}
                                {validator.status === "Pending" && (
                                  <Clock className="mr-1 h-3 w-3" />
                                )}
                                {validator.status === "Inactive" && (
                                  <AlertCircle className="mr-1 h-3 w-3" />
                                )}
                                {validator.status}
                              </Badge>
                              <Badge variant="outline">
                                {validator.votes} votes
                              </Badge>
                              <Badge variant="outline">
                                {validator.transactions} transactions
                              </Badge>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={
                                departmentInfo.votesRemaining === 0 ||
                                departmentInfo.votedFor.includes(validator.id)
                              }
                              onClick={() => handleVote(validator.id)}
                            >
                              {departmentInfo.votedFor.includes(validator.id)
                                ? "Voted"
                                : "Vote"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="active" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Active Validators</CardTitle>
                  <CardDescription>
                    Currently active validators on the network
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredValidators
                      .filter((validator) => validator.status === "Active")
                      .map((validator) => (
                        <div
                          key={validator.id}
                          className="rounded-lg border p-4"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-green-100 text-green-600">
                                  {validator.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium">
                                  {validator.name}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {validator.id}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-4">
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className="bg-green-50 text-green-700"
                                >
                                  <CheckCircle2 className="mr-1 h-3 w-3" />
                                  Active
                                </Badge>
                                <Badge variant="outline">
                                  {validator.votes} votes
                                </Badge>
                                <Badge variant="outline">
                                  {validator.transactions} transactions
                                </Badge>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={
                                  departmentInfo.votesRemaining === 0 ||
                                  departmentInfo.votedFor.includes(validator.id)
                                }
                                onClick={() => handleVote(validator.id)}
                              >
                                {departmentInfo.votedFor.includes(validator.id)
                                  ? "Voted"
                                  : "Vote"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Validators</CardTitle>
                  <CardDescription>
                    Departments applying to become validators
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredValidators
                      .filter((validator) => validator.status === "Pending")
                      .map((validator) => (
                        <div
                          key={validator.id}
                          className="rounded-lg border p-4"
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-amber-100 text-amber-600">
                                  {validator.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium">
                                  {validator.name}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {validator.id}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-4">
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className="bg-amber-50 text-amber-700"
                                >
                                  <Clock className="mr-1 h-3 w-3" />
                                  Pending
                                </Badge>
                                <Badge variant="outline">
                                  {validator.votes} votes
                                </Badge>
                                <Badge variant="outline">
                                  {validator.transactions} transactions
                                </Badge>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={
                                  departmentInfo.votesRemaining === 0 ||
                                  departmentInfo.votedFor.includes(validator.id)
                                }
                                onClick={() => handleVote(validator.id)}
                              >
                                {departmentInfo.votedFor.includes(validator.id)
                                  ? "Voted"
                                  : "Vote"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
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
