"use client";

import useSWR from "swr";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Empty } from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Receipt, ExternalLink } from "lucide-react";

interface ExpenseShare {
  user: {
    _id: string;
    name: string;
    email: string;
  };
  amount: number;
  isPaid: boolean;
}

interface Expense {
  _id: string;
  description: string;
  amount: number;
  paidBy: {
    _id: string;
    name: string;
    email: string;
    image?: string;
  };
  group: {
    _id: string;
    name: string;
  };
  shares: ExpenseShare[];
  category: string;
  date: string;
  createdAt: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const categoryColors: Record<string, string> = {
  food: "bg-orange-500/10 text-orange-600",
  transport: "bg-blue-500/10 text-blue-600",
  entertainment: "bg-purple-500/10 text-purple-600",
  utilities: "bg-yellow-500/10 text-yellow-600",
  rent: "bg-red-500/10 text-red-600",
  shopping: "bg-pink-500/10 text-pink-600",
  health: "bg-green-500/10 text-green-600",
  travel: "bg-cyan-500/10 text-cyan-600",
  other: "bg-gray-500/10 text-gray-600",
};

export default function ExpensesPage() {
  const { data: session } = useSession();
  const { data: expenses, error, isLoading } = useSWR<Expense[]>("/api/expenses", fetcher);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-destructive">Failed to load expenses</p>
      </div>
    );
  }

  const totalExpenses = expenses?.reduce((sum, e) => sum + e.amount, 0) || 0;
  const totalOwed = expenses?.reduce((sum, e) => {
    const share = e.shares.find((s) => s.user._id === session?.user?.id);
    if (share && e.paidBy._id !== session?.user?.id) {
      return sum + share.amount;
    }
    return sum;
  }, 0) || 0;

  const totalOwedToYou = expenses?.reduce((sum, e) => {
    if (e.paidBy._id === session?.user?.id) {
      const yourShare = e.shares.find((s) => s.user._id === session?.user?.id);
      return sum + (e.amount - (yourShare?.amount || 0));
    }
    return sum;
  }, 0) || 0;

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">All Expenses</h1>
        <p className="text-muted-foreground">
          View all your expenses across groups
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Expenses</CardDescription>
            <CardTitle className="text-2xl">{formatCurrency(totalExpenses)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>You Owe</CardDescription>
            <CardTitle className="text-2xl text-destructive">
              {formatCurrency(totalOwed)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Owed to You</CardDescription>
            <CardTitle className="text-2xl text-primary">
              {formatCurrency(totalOwedToYou)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {!expenses || expenses.length === 0 ? (
        <Empty
          icon={Receipt}
          title="No expenses yet"
          description="Start adding expenses in your groups to see them here."
          action={
            <Link href="/groups">
              <Button>Go to Groups</Button>
            </Link>
          }
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Expense History</CardTitle>
            <CardDescription>
              {expenses.length} expense{expenses.length !== 1 ? "s" : ""} total
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenses.map((expense, index) => {
                const userShare = expense.shares.find(
                  (s) => s.user._id === session?.user?.id
                );
                const isPayer = expense.paidBy._id === session?.user?.id;

                return (
                  <div key={expense._id}>
                    {index > 0 && <Separator className="mb-4" />}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <Avatar className="h-10 w-10 shrink-0">
                          <AvatarImage src={expense.paidBy.image} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {expense.paidBy.name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium truncate">
                              {expense.description}
                            </span>
                            <Badge
                              variant="secondary"
                              className={`text-xs capitalize ${
                                categoryColors[expense.category] || categoryColors.other
                              }`}
                            >
                              {expense.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {isPayer ? "You" : expense.paidBy.name} paid{" "}
                            <span className="font-medium text-foreground">
                              {formatCurrency(expense.amount)}
                            </span>
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Link
                              href={`/groups/${expense.group._id}`}
                              className="text-xs text-primary hover:underline flex items-center gap-1"
                            >
                              {expense.group.name}
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(expense.date), "MMM d, yyyy")}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        {userShare && !isPayer && (
                          <p className="text-sm font-medium text-destructive">
                            You owe {formatCurrency(userShare.amount)}
                          </p>
                        )}
                        {isPayer && (
                          <p className="text-sm font-medium text-primary">
                            You get back{" "}
                            {formatCurrency(expense.amount - (userShare?.amount || 0))}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
