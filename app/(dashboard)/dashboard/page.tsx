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
import {
  ArrowRight,
  ArrowUpRight,
  CircleDollarSign,
  Clock3,
  Layers3,
  Plus,
  ReceiptText,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
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
        <p className="text-destructive">Failed to load dashboard</p>
      </div>
    );
  }

  const pendingForYou =
    data?.pendingSettlements.filter((s) => s.payee._id === session?.user?.id) ||
    [];

  const stats = [
    {
      label: "Active groups",
      value: data?.stats.totalGroups || 0,
      note: "Shared circles currently tracking expenses",
      icon: Users,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Logged expenses",
      value: data?.stats.totalExpenses || 0,
      note: "Bills, subscriptions, trips, and more",
      icon: ReceiptText,
      tone: "bg-amber-50 text-amber-700",
    },
    {
      label: "You owe",
      value: formatCurrency(data?.stats.youOwe || 0),
      note: "Open amount waiting to be settled",
      icon: TrendingDown,
      tone: "bg-rose-50 text-rose-700",
    },
    {
      label: "Owed to you",
      value: formatCurrency(data?.stats.owedToYou || 0),
      note: "Money expected back across groups",
      icon: TrendingUp,
      tone: "bg-sky-50 text-sky-700",
    },
  ];

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="overflow-hidden rounded-[2rem] border-white/80 bg-[linear-gradient(135deg,#0f172a,#1e293b)] p-0 text-white shadow-[0_35px_120px_-55px_rgba(15,23,42,0.8)]">
          <CardContent className="relative px-7 py-7 md:px-8 md:py-8">
            <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-emerald-400/10 blur-3xl" />
            <div className="relative flex flex-col gap-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="max-w-2xl">
                  <Badge className="rounded-full border-0 bg-white/10 px-3 py-1 text-emerald-300 hover:bg-white/10">
                    Calm overview
                  </Badge>
                  <h1
                    className="mt-4 text-4xl font-semibold tracking-[-0.04em] md:text-5xl"
                    style={{ fontFamily: "var(--font-dashboard-display)" }}
                  >
                    Welcome back, {session?.user?.name?.split(" ")[0]}.
                  </h1>
                  <p className="mt-4 max-w-xl text-base leading-7 text-slate-300 md:text-lg">
                    Your money picture is cleaner today. Review what changed,
                    what still needs settling, and where your groups stand.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
                  <Button
                    asChild
                    className="rounded-full bg-white text-slate-950 hover:bg-slate-100"
                  >
                    <Link href="/groups">
                      <Plus className="mr-2 h-4 w-4" />
                      New group
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-full border-white/15 bg-white/5 text-white "
                  >
                    <Link href="/settlements">
                      Review settlements
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-slate-400">Total paid by you</p>
                  <p
                    className="mt-2 text-3xl font-semibold tracking-tight"
                    style={{ fontFamily: "var(--font-dashboard-display)" }}
                  >
                    {formatCurrency(data?.stats.totalPaid || 0)}
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-slate-400">Net balance</p>
                  <p
                    className={`mt-2 text-3xl font-semibold tracking-tight ${
                      (data?.stats.netBalance || 0) >= 0
                        ? "text-emerald-300"
                        : "text-rose-300"
                    }`}
                    style={{ fontFamily: "var(--font-dashboard-display)" }}
                  >
                    {(data?.stats.netBalance || 0) >= 0 ? "+" : ""}
                    {formatCurrency(data?.stats.netBalance || 0)}
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(135deg,rgba(16,185,129,0.18),rgba(250,204,21,0.12))] p-5">
                  <p className="text-sm text-slate-200">Pending confirmations</p>
                  <p
                    className="mt-2 text-3xl font-semibold tracking-tight"
                    style={{ fontFamily: "var(--font-dashboard-display)" }}
                  >
                    {pendingForYou.length}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-white/80 bg-white/80 shadow-[0_25px_90px_-50px_rgba(15,23,42,0.35)] backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle
              className="text-2xl tracking-[-0.03em] text-slate-950"
              style={{ fontFamily: "var(--font-dashboard-display)" }}
            >
              Next best action
            </CardTitle>
            <CardDescription className="text-sm leading-6 text-slate-600">
              Keep the group moving by resolving the most important item first.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingForYou.length > 0 ? (
              pendingForYou.slice(0, 3).map((settlement) => (
                <div
                  key={settlement._id}
                  className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50/80 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={settlement.payer.image} />
                        <AvatarFallback className="bg-emerald-100 text-emerald-700">
                          {settlement.payer.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-slate-900">
                          {settlement.payer.name} says payment is done
                        </p>
                        <p className="text-sm text-slate-500">
                          {settlement?.group?.name}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-emerald-700">
                      {formatCurrency(settlement.amount)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50/70 p-6 text-center">
                <Clock3 className="mx-auto h-10 w-10 text-slate-300" />
                <p className="mt-4 font-medium text-slate-900">
                  No confirmations waiting
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Your current settlements are up to date.
                </p>
              </div>
            )}

            <Button
              asChild
              variant="outline"
              className="w-full rounded-full border-slate-200 bg-white hover:bg-slate-50"
            >
              <Link href="/settlements">
                Open settlements
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="rounded-[1.75rem] border-white/80 bg-white/80 shadow-[0_20px_70px_-45px_rgba(15,23,42,0.28)] backdrop-blur"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <p
                    className="mt-3 text-3xl font-semibold tracking-tight text-slate-950"
                    style={{ fontFamily: "var(--font-dashboard-display)" }}
                  >
                    {stat.value}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {stat.note}
                  </p>
                </div>
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${stat.tone}`}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="rounded-[2rem] border-white/80 bg-white/80 shadow-[0_25px_90px_-50px_rgba(15,23,42,0.35)] backdrop-blur">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle
                className="text-2xl tracking-[-0.03em] text-slate-950"
                style={{ fontFamily: "var(--font-dashboard-display)" }}
              >
                Your groups
              </CardTitle>
              <CardDescription className="text-sm leading-6 text-slate-600">
                Quick access to the circles currently sharing bills with you.
              </CardDescription>
            </div>
            <Button asChild variant="ghost" className="rounded-full">
              <Link href="/groups">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {!data?.groups || data.groups.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50/70 p-8 text-center">
                <Users className="mx-auto h-10 w-10 text-slate-300" />
                <p className="mt-4 font-medium text-slate-900">No groups yet</p>
                <p className="mt-2 text-sm text-slate-500">
                  Create your first group to start splitting expenses.
                </p>
                <Button asChild className="mt-5 rounded-full bg-slate-950 hover:bg-slate-900">
                  <Link href="/groups">
                    <Plus className="mr-2 h-4 w-4" />
                    Create group
                  </Link>
                </Button>
              </div>
            ) : (
              data.groups.slice(0, 4).map((group) => (
                <Link key={group._id} href={`/groups/${group._id}`}>
                  <div className="group rounded-[1.5rem] border border-slate-200/80 bg-slate-50/70 p-4 transition-all hover:-translate-y-0.5 hover:bg-white">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                          {group.members.slice(0, 3).map((member) => (
                            <Avatar
                              key={member.user._id}
                              className="h-9 w-9 border-2 border-white"
                            >
                              <AvatarImage src={member.user.image} />
                              <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs">
                                {member.user.name?.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{group?.name}</p>
                          <p className="text-sm text-slate-500">
                            {group?.members?.length} member
                            {group?.members?.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-emerald-600" />
                    </div>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-white/80 bg-white/80 shadow-[0_25px_90px_-50px_rgba(15,23,42,0.35)] backdrop-blur">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle
                className="text-2xl tracking-[-0.03em] text-slate-950"
                style={{ fontFamily: "var(--font-dashboard-display)" }}
              >
                Recent activity
              </CardTitle>
              <CardDescription className="text-sm leading-6 text-slate-600">
                Latest expenses across the groups you are part of.
              </CardDescription>
            </div>
            <Button asChild variant="ghost" className="rounded-full">
              <Link href="/expenses">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {!data?.recentExpenses || data.recentExpenses.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50/70 p-8 text-center">
                <ReceiptText className="mx-auto h-10 w-10 text-slate-300" />
                <p className="mt-4 font-medium text-slate-900">
                  No expenses logged yet
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Activity will show up here once your groups start spending.
                </p>
              </div>
            ) : (
              data.recentExpenses.slice(0, 5).map((expense) => {
                const isPayer = expense.paidBy._id === session?.user?.id;

                return (
                  <div
                    key={expense._id}
                    className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50/70 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 flex-1 items-start gap-3">
                        <Avatar className="h-10 w-10 shrink-0">
                          <AvatarImage src={expense.paidBy.image} />
                          <AvatarFallback className="bg-sky-100 text-sky-700">
                            {expense.paidBy.name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-slate-900">
                            {expense.description}
                          </p>
                          <p className="text-sm text-slate-500">
                            {isPayer ? "You" : expense.paidBy.name} paid in{" "}
                            <Link
                              href={`/groups/${expense.group._id}`}
                              className="font-medium text-emerald-700 hover:underline"
                            >
                              {expense.group.name}
                            </Link>
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-semibold text-slate-900">
                          {formatCurrency(expense.amount)}
                        </p>
                        <p className="text-xs text-slate-500">
                          {format(new Date(expense.date), "MMM d")}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="rounded-[2rem] border-white/80 bg-white/80 shadow-[0_25px_90px_-50px_rgba(15,23,42,0.35)] backdrop-blur">
          <CardHeader>
            <CardTitle
              className="text-2xl tracking-[-0.03em] text-slate-950"
              style={{ fontFamily: "var(--font-dashboard-display)" }}
            >
              Balance summary
            </CardTitle>
            <CardDescription className="text-sm leading-6 text-slate-600">
              A quick read on how much is flowing out, coming back, and sitting
              unresolved.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white/10 p-3">
                  <Wallet className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Total paid</p>
                  <p className="text-xl font-semibold">
                    {formatCurrency(data?.stats.totalPaid || 0)}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-[1.5rem] bg-emerald-50 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white p-3 text-emerald-700 shadow-sm">
                  <CircleDollarSign className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-emerald-700/70">Expected back</p>
                  <p className="text-xl font-semibold text-emerald-700">
                    {formatCurrency(data?.stats.owedToYou || 0)}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-[1.5rem] bg-rose-50 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white p-3 text-rose-700 shadow-sm">
                  <TrendingDown className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-rose-700/70">Still to pay</p>
                  <p className="text-xl font-semibold text-rose-700">
                    {formatCurrency(data?.stats.youOwe || 0)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-white/80 bg-white/80 shadow-[0_25px_90px_-50px_rgba(15,23,42,0.35)] backdrop-blur">
          <CardHeader>
            <CardTitle
              className="text-2xl tracking-[-0.03em] text-slate-950"
              style={{ fontFamily: "var(--font-dashboard-display)" }}
            >
              Workspace pulse
            </CardTitle>
            <CardDescription className="text-sm leading-6 text-slate-600">
              A lightweight read of how active your shared money workflows are.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                label: "Group activity",
                value: `${data?.stats.totalGroups || 0} live`,
                icon: Layers3,
              },
              {
                label: "Recent expense flow",
                value: `${data?.recentExpenses.length || 0} recent`,
                icon: ReceiptText,
              },
              {
                label: "Settlement queue",
                value: `${data?.pendingSettlements.length || 0} pending`,
                icon: Clock3,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-[1.5rem] border border-slate-200/80 bg-slate-50/70 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-white p-3 shadow-sm">
                    <item.icon className="h-5 w-5 text-slate-700" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{item.label}</p>
                    <p className="text-sm text-slate-500">{item.value}</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-300" />
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
