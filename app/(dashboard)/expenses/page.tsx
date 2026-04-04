"use client";

import useSWR from "swr";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import Link from "next/link";
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
import { Empty } from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ExternalLink,
  Receipt,
  ReceiptText,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

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
  food: "bg-orange-100 text-orange-700",
  transport: "bg-blue-100 text-blue-700",
  entertainment: "bg-violet-100 text-violet-700",
  utilities: "bg-yellow-100 text-yellow-700",
  rent: "bg-rose-100 text-rose-700",
  shopping: "bg-pink-100 text-pink-700",
  health: "bg-emerald-100 text-emerald-700",
  travel: "bg-cyan-100 text-cyan-700",
  other: "bg-slate-100 text-slate-700",
};

export default function ExpensesPage() {
  const { data: session } = useSession();
  const { data: expenses, error, isLoading } = useSWR<Expense[]>(
    "/api/expenses",
    fetcher
  );

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-destructive">Failed to load expenses</p>
      </div>
    );
  }

  const totalExpenses = expenses?.reduce((sum, e) => sum + e.amount, 0) || 0;
  const totalOwed =
    expenses?.reduce((sum, e) => {
      const share = e.shares.find((s) => s.user._id === session?.user?.id);
      if (share && e.paidBy._id !== session?.user?.id) {
        return sum + share.amount;
      }
      return sum;
    }, 0) || 0;

  const totalOwedToYou =
    expenses?.reduce((sum, e) => {
      if (e.paidBy._id === session?.user?.id) {
        const yourShare = e.shares.find((s) => s.user._id === session?.user?.id);
        return sum + (e.amount - (yourShare?.amount || 0));
      }
      return sum;
    }, 0) || 0;

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="overflow-hidden rounded-[2rem] border-white/80 bg-[linear-gradient(135deg,#0f172a,#1e293b)] p-0 text-white shadow-[0_35px_120px_-55px_rgba(15,23,42,0.8)]">
          <CardContent className="relative px-7 py-7 md:px-8 md:py-8">
            <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-amber-300/10 blur-3xl" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-amber-300">
                <Sparkles className="h-3.5 w-3.5" />
                Expense ledger
              </div>
              <h1
                className="mt-4 text-4xl font-semibold tracking-[-0.04em] md:text-5xl"
                style={{ fontFamily: "var(--font-dashboard-display)" }}
              >
                Every shared payment, easier to read.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
                Browse all expense activity across your groups, see where your
                money went, and understand what still needs to come back.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
          {[
            {
              label: "Total expenses",
              value: formatCurrency(totalExpenses),
              icon: Wallet,
              tone: "bg-slate-950 text-white",
              iconWrap: "bg-white/10 text-white",
            },
            {
              label: "You owe",
              value: formatCurrency(totalOwed),
              icon: TrendingDown,
              tone: "bg-rose-50 text-rose-700",
              iconWrap: "bg-white text-rose-700",
            },
            {
              label: "Owed to you",
              value: formatCurrency(totalOwedToYou),
              icon: TrendingUp,
              tone: "bg-emerald-50 text-emerald-700",
              iconWrap: "bg-white text-emerald-700",
            },
          ].map((item) => (
            <Card
              key={item.label}
              className={`rounded-[2rem] border-white/80 ${item.tone} shadow-[0_25px_90px_-50px_rgba(15,23,42,0.35)] backdrop-blur`}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`rounded-2xl p-3 shadow-sm ${item.iconWrap}`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm opacity-80">{item.label}</p>
                    <p
                      className="text-3xl font-semibold tracking-tight"
                      style={{ fontFamily: "var(--font-dashboard-display)" }}
                    >
                      {item.value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {!expenses || expenses.length === 0 ? (
        <Empty
          className="rounded-[2rem] border border-dashed border-slate-200 bg-white/70 p-12 shadow-[0_25px_90px_-50px_rgba(15,23,42,0.22)] backdrop-blur"
          icon={Receipt}
          title="No expenses yet"
          description="Start adding expenses in your groups to see them here."
          action={
            <Link href="/groups">
              <Button className="rounded-full bg-slate-950 hover:bg-slate-900">
                Go to groups
              </Button>
            </Link>
          }
        />
      ) : (
        <Card className="rounded-[2rem] border-white/80 bg-white/80 shadow-[0_25px_90px_-50px_rgba(15,23,42,0.35)] backdrop-blur">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle
                className="text-2xl tracking-[-0.03em] text-slate-950"
                style={{ fontFamily: "var(--font-dashboard-display)" }}
              >
                Expense history
              </CardTitle>
              <CardDescription className="text-sm leading-6 text-slate-600">
                {expenses.length} expense
                {expenses.length !== 1 ? "s" : ""} across all your groups.
              </CardDescription>
            </div>
            <Button asChild variant="ghost" className="rounded-full">
              <Link href="/groups">
                Manage groups
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {expenses.map((expense) => {
              const userShare = expense.shares.find(
                (s) => s.user._id === session?.user?.id
              );
              const isPayer = expense.paidBy._id === session?.user?.id;

              return (
                <div
                  key={expense._id}
                  className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50/70 p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex min-w-0 flex-1 items-start gap-4">
                      <Avatar className="h-11 w-11 shrink-0">
                        <AvatarImage src={expense.paidBy.image} />
                        <AvatarFallback className="bg-amber-100 text-amber-700">
                          {expense.paidBy.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate text-lg font-semibold text-slate-950">
                            {expense.description}
                          </p>
                          <Badge
                            variant="secondary"
                            className={`rounded-full border-0 px-3 py-1 text-xs capitalize ${
                              categoryColors[expense.category] || categoryColors.other
                            }`}
                          >
                            {expense.category}
                          </Badge>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {isPayer ? "You" : expense.paidBy.name} paid{" "}
                          <span className="font-semibold text-slate-900">
                            {formatCurrency(expense.amount)}
                          </span>
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                          <Link
                            href={`/groups/${expense.group._id}`}
                            className="inline-flex items-center gap-1 font-medium text-emerald-700 hover:underline"
                          >
                            {expense.group.name}
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                          <span>{format(new Date(expense.date), "MMM d, yyyy")}</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 lg:min-w-[190px]">
                      {userShare && !isPayer && (
                        <div className="rounded-[1.25rem] bg-rose-50 px-4 py-3 text-right">
                          <p className="text-xs uppercase tracking-[0.18em] text-rose-500">
                            Your share
                          </p>
                          <p className="mt-1 font-semibold text-rose-700">
                            You owe {formatCurrency(userShare.amount)}
                          </p>
                        </div>
                      )}
                      {isPayer && (
                        <div className="rounded-[1.25rem] bg-emerald-50 px-4 py-3 text-right">
                          <p className="text-xs uppercase tracking-[0.18em] text-emerald-500">
                            Recovery
                          </p>
                          <p className="mt-1 font-semibold text-emerald-700">
                            You get back{" "}
                            {formatCurrency(expense.amount - (userShare?.amount || 0))}
                          </p>
                        </div>
                      )}
                      {!userShare && !isPayer && (
                        <div className="rounded-[1.25rem] bg-slate-100 px-4 py-3 text-right">
                          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                            Status
                          </p>
                          <p className="mt-1 font-semibold text-slate-700">
                            No share assigned
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
