"use client";

import useSWR from "swr";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  Receipt,
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  ArrowRight,
  Clock,
  ChevronRight,
} from "lucide-react";

interface DashboardData {
  stats: {
    totalGroups: number;
    totalExpenses: number;
    totalPaid: number;
    netBalance: number;
    youOwe: number;
    owedToYou: number;
  };
  groups: Array<{
    _id: string;
    name: string;
    members: Array<{
      user: {
        _id: string;
        name: string;
        image?: string;
      };
    }>;
  }>;
  recentExpenses: Array<{
    _id: string;
    description: string;
    amount: number;
    paidBy: {
      _id: string;
      name: string;
      image?: string;
    };
    group: {
      _id: string;
      name: string;
    };
    date: string;
  }>;
  pendingSettlements: Array<{
    _id: string;
    payer: {
      _id: string;
      name: string;
      image?: string;
    };
    payee: {
      _id: string;
      name: string;
      image?: string;
    };
    amount: number;
    group: {
      _id: string;
      name: string;
    };
  }>;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DashboardPage() {
  const { data: session } = useSession();
  const { data, error, isLoading } = useSWR<DashboardData>(
    "/api/dashboard",
    fetcher
  );

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
        <p className="text-destructive">Failed to load dashboard</p>
      </div>
    );
  }

  const pendingForYou = data?.pendingSettlements.filter(
    (s) => s.payee._id === session?.user?.id
  );

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {session?.user?.name?.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground">
            {"Here's an overview of your expenses"}
          </p>
        </div>
        <Link href="/groups">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Group
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Groups
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.stats.totalGroups || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Expenses
            </CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.stats.totalExpenses || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              You Owe
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {formatCurrency(data?.stats.youOwe || 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Owed to You
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(data?.stats.owedToYou || 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Settlements Alert */}
      {pendingForYou && pendingForYou.length > 0 && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Pending Confirmations
              </CardTitle>
              <Link href="/settlements">
                <Button variant="ghost" size="sm">
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
            <CardDescription>
              {pendingForYou.length} payment{pendingForYou.length !== 1 ? "s" : ""}{" "}
              waiting for your confirmation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingForYou.slice(0, 3).map((settlement) => (
                <div
                  key={settlement._id}
                  className="flex items-center justify-between p-3 rounded-lg bg-background"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={settlement.payer.image} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {settlement.payer.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {settlement.payer.name} paid you
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {settlement.group.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">
                      {formatCurrency(settlement.amount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Groups */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Your Groups</CardTitle>
              <CardDescription>Quick access to your groups</CardDescription>
            </div>
            <Link href="/groups">
              <Button variant="ghost" size="sm">
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {!data?.groups || data.groups.length === 0 ? (
              <div className="text-center py-6">
                <Users className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-3">
                  No groups yet
                </p>
                <Link href="/groups">
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Group
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {data.groups.map((group, index) => (
                  <div key={group._id}>
                    {index > 0 && <Separator className="mb-4" />}
                    <Link href={`/groups/${group._id}`}>
                      <div className="flex items-center justify-between hover:bg-muted/50 -mx-2 px-2 py-2 rounded-lg transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="flex -space-x-2">
                            {group.members.slice(0, 3).map((member) => (
                              <Avatar
                                key={member.user._id}
                                className="h-8 w-8 border-2 border-background"
                              >
                                <AvatarImage src={member.user.image} />
                                <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                                  {member.user.name?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                          <div>
                            <p className="font-medium">{group.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {group.members.length} member
                              {group.members.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Expenses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Expenses</CardTitle>
              <CardDescription>Latest activity across groups</CardDescription>
            </div>
            <Link href="/expenses">
              <Button variant="ghost" size="sm">
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {!data?.recentExpenses || data.recentExpenses.length === 0 ? (
              <div className="text-center py-6">
                <Receipt className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  No expenses yet
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.recentExpenses.slice(0, 5).map((expense, index) => {
                  const isPayer = expense.paidBy._id === session?.user?.id;
                  return (
                    <div key={expense._id}>
                      {index > 0 && <Separator className="mb-4" />}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <Avatar className="h-9 w-9 shrink-0">
                            <AvatarImage src={expense.paidBy.image} />
                            <AvatarFallback className="bg-primary/10 text-primary text-sm">
                              {expense.paidBy.name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {expense.description}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {isPayer ? "You" : expense.paidBy.name} paid
                              {" in "}
                              <Link
                                href={`/groups/${expense.group._id}`}
                                className="text-primary hover:underline"
                              >
                                {expense.group.name}
                              </Link>
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-semibold">
                            {formatCurrency(expense.amount)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(expense.date), "MMM d")}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Balance Summary */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Balance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center p-4 rounded-lg bg-background">
              <p className="text-sm text-muted-foreground mb-1">Total Paid</p>
              <p className="text-2xl font-bold">
                {formatCurrency(data?.stats.totalPaid || 0)}
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-background">
              <p className="text-sm text-muted-foreground mb-1">Net Balance</p>
              <p
                className={`text-2xl font-bold ${
                  (data?.stats.netBalance || 0) >= 0
                    ? "text-primary"
                    : "text-destructive"
                }`}
              >
                {(data?.stats.netBalance || 0) >= 0 ? "+" : ""}
                {formatCurrency(data?.stats.netBalance || 0)}
              </p>
            </div>
            <div className="flex items-center justify-center p-4 rounded-lg bg-background">
              <Link href="/settlements">
                <Button>
                  Settle Up
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
