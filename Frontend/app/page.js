import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, FileText, BarChart3, Users, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full  border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-evenly">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">
              <Link href="/"> 
                BudgetChain
              </Link>
            </span>
          </div>
          <nav className="hidden md:flex gap-6 items-center">
            <Link
              href="/transactions"
              className="text-sm font-medium hover:underline underline-offset-4"
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
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-blue-50 dark:bg-blue-950">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Secure Departmental Blockchain Platform
                </h1>
                <p className="text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  A transparent and secure blockchain solution for government
                  departments to manage transactions, validate processes, and
                  maintain a public ledger.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button size="lg" className="gap-1">
                      Get Started <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/transactions">
                    <Button size="lg" variant="outline">
                      View Public Ledger
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto lg:mx-0 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur-xl opacity-20"></div>
                <div className="relative bg-white dark:bg-gray-950 border rounded-lg shadow-lg p-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex flex-col items-center gap-2 rounded-lg border p-4 text-center">
                      <FileText className="h-6 w-6 text-blue-600" />
                      <h3 className="font-semibold">Transparent Ledger</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        All transactions are publicly viewable and immutable
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-2 rounded-lg border p-4 text-center">
                      <BarChart3 className="h-6 w-6 text-blue-600" />
                      <h3 className="font-semibold">Department Wallets</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Secure management of departmental funds
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-2 rounded-lg border p-4 text-center">
                      <Users className="h-6 w-6 text-blue-600" />
                      <h3 className="font-semibold">Validator Network</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Democratic validation by department representatives
                      </p>
                    </div>
                    <div className="flex flex-col items-center gap-2 rounded-lg border p-4 text-center">
                      <Shield className="h-6 w-6 text-blue-600" />
                      <h3 className="font-semibold">Secure Authentication</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Department-based access control system
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  How It Works
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Our blockchain platform provides a secure and transparent way
                  for government departments to manage transactions.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3 md:gap-12">
              <Card>
                <CardHeader>
                  <CardTitle>Register Department</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Departments register with their unique ID, name, and secure
                    password to join the blockchain network.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Manage Wallet</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Each department has a secure wallet to view balances,
                    transaction history, and apply to become a validator.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Validate Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Departments can vote for validators who will verify and
                    approve transactions on the blockchain.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-gray-50 dark:bg-gray-950">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:gap-8">
          <div className="flex flex-col gap-2 md:gap-4 md:flex-1">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="text-lg font-semibold">GovChain</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              A secure blockchain platform for government departments.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:flex-1 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-500 hover:underline dark:text-gray-400"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/features"
                    className="text-gray-500 hover:underline dark:text-gray-400"
                  >
                    Features
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/documentation"
                    className="text-gray-500 hover:underline dark:text-gray-400"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/help"
                    className="text-gray-500 hover:underline dark:text-gray-400"
                  >
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-500 hover:underline dark:text-gray-400"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-gray-500 hover:underline dark:text-gray-400"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t py-6">
          <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              © 2025 GovChain. All rights reserved.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              A secure blockchain solution for government departments
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}