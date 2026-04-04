"use client";

import { useState } from "react";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { toast } from "sonner";
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
import { Empty } from "@/components/ui/empty";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeftRight,
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  Sparkles,
  X,
} from "lucide-react";

interface Settlement {
  _id: string;
  payer: {
    _id: string;
    name: string;
    email: string;
    image?: string;
  };
  payee: {
    _id: string;
    name: string;
    email: string;
    image?: string;
  };
  amount: number;
  group: {
    _id: string;
    name: string;
  };
  status: "pending" | "completed";
  completedAt?: string;
  createdAt: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SettlementsPage() {
  const { data: session } = useSession();
  const { data: settlements, error, isLoading, mutate } = useSWR<Settlement[]>(
    "/api/settlements",
    fetcher
  );

  const [confirmSettlement, setConfirmSettlement] = useState<Settlement | null>(
    null
  );
  const [cancelSettlement, setCancelSettlement] = useState<Settlement | null>(
    null
  );
  const [isConfirming, setIsConfirming] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);

  const handleConfirm = async () => {
    if (!confirmSettlement) return;

    setIsConfirming(true);
    try {
      const response = await fetch(`/api/settlements/${confirmSettlement._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to confirm settlement");
      }

      toast.success("Settlement confirmed!");
      mutate();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to confirm settlement"
      );
    } finally {
      setIsConfirming(false);
      setConfirmSettlement(null);
    }
  };

  const handleCancel = async () => {
    if (!cancelSettlement) return;

    setIsCancelling(true);
    try {
      const response = await fetch(`/api/settlements/${cancelSettlement._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to cancel settlement");
      }

      toast.success("Settlement cancelled");
      mutate();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to cancel settlement"
      );
    } finally {
      setIsCancelling(false);
      setCancelSettlement(null);
    }
  };

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
        <p className="text-destructive">Failed to load settlements</p>
      </div>
    );
  }

  const pendingSettlements =
    settlements?.filter((s) => s.status === "pending") || [];
  const completedSettlements =
    settlements?.filter((s) => s.status === "completed") || [];

  const pendingConfirmation = pendingSettlements.filter(
    (s) => s.payee._id === session?.user?.id
  );
  const pendingSent = pendingSettlements.filter(
    (s) => s.payer._id === session?.user?.id
  );

  const renderSettlement = (settlement: Settlement) => {
    const isPayer = settlement.payer._id === session?.user?.id;
    const isPayee = settlement.payee._id === session?.user?.id;

    return (
      <div
        key={settlement._id}
        className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50/70 p-5"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-1 items-start gap-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src={settlement.payer.image} />
                <AvatarFallback className="bg-emerald-100 text-emerald-700 text-sm">
                  {settlement.payer.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <ArrowRight className="h-4 w-4 text-slate-300" />
              <Avatar className="h-10 w-10">
                <AvatarImage src={settlement.payee.image} />
                <AvatarFallback className="bg-slate-200 text-slate-700 text-sm">
                  {settlement.payee.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-base text-slate-700">
                <span className="font-semibold text-slate-950">
                  {isPayer ? "You" : settlement.payer.name}
                </span>
                {" paid "}
                <span className="font-semibold text-slate-950">
                  {isPayee ? "you" : settlement.payee.name}
                </span>
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <Link
                  href={`/groups/${settlement?.group?._id}`}
                  className="inline-flex items-center gap-1 font-medium text-emerald-700 hover:underline"
                >
                  {settlement?.group?.name}
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
                <span>{format(new Date(settlement.createdAt), "MMM d, yyyy")}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            <div className="rounded-[1.25rem] bg-white px-4 py-3 text-right shadow-sm">
              <p className="font-semibold text-slate-950">
                {formatCurrency(settlement.amount)}
              </p>
              <Badge
                variant="secondary"
                className={`mt-2 rounded-full border-0 px-3 py-1 text-xs ${
                  settlement.status === "completed"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {settlement.status === "completed" ? (
                  <>
                    <CheckCircle2 className="mr-1 h-3 w-3" />
                    Confirmed
                  </>
                ) : (
                  <>
                    <Clock className="mr-1 h-3 w-3" />
                    Pending
                  </>
                )}
              </Badge>
            </div>

            {settlement.status === "pending" && isPayee && (
              <Button
                size="sm"
                className="rounded-full bg-slate-950 hover:bg-slate-900"
                onClick={() => setConfirmSettlement(settlement)}
              >
                Confirm
              </Button>
            )}

            {settlement.status === "pending" && isPayer && (
              <Button
                size="sm"
                variant="ghost"
                className="rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => setCancelSettlement(settlement)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="overflow-hidden rounded-[2rem] border-white/80 bg-[linear-gradient(135deg,#0f172a,#1e293b)] p-0 text-white shadow-[0_35px_120px_-55px_rgba(15,23,42,0.8)]">
          <CardContent className="relative px-7 py-7 md:px-8 md:py-8">
            <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-emerald-300/10 blur-3xl" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-emerald-300">
                <Sparkles className="h-3.5 w-3.5" />
                Settlement queue
              </div>
              <h1
                className="mt-4 text-4xl font-semibold tracking-[-0.04em] md:text-5xl"
                style={{ fontFamily: "var(--font-dashboard-display)" }}
              >
                Move open balances toward done.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
                Review pending transfers, confirm completed payments, and keep
                your group balances clean.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
          {[
            {
              label: "Waiting for you",
              value: pendingConfirmation.length,
              tone: "bg-amber-50 text-amber-700",
            },
            {
              label: "Sent by you",
              value: pendingSent.length,
              tone: "bg-sky-50 text-sky-700",
            },
            {
              label: "Completed",
              value: completedSettlements.length,
              tone: "bg-emerald-50 text-emerald-700",
            },
          ].map((item) => (
            <Card
              key={item.label}
              className={`rounded-[2rem] border-white/80 ${item.tone} shadow-[0_25px_90px_-50px_rgba(15,23,42,0.35)] backdrop-blur`}
            >
              <CardContent className="p-6">
                <p className="text-sm opacity-80">{item.label}</p>
                <p
                  className="mt-2 text-3xl font-semibold tracking-tight"
                  style={{ fontFamily: "var(--font-dashboard-display)" }}
                >
                  {item.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {pendingConfirmation.length > 0 && (
        <Card className="rounded-[2rem] border-amber-200 bg-amber-50/80 shadow-[0_25px_90px_-50px_rgba(15,23,42,0.22)] backdrop-blur">
          <CardHeader>
            <CardTitle
              className="flex items-center gap-2 text-2xl tracking-[-0.03em] text-slate-950"
              style={{ fontFamily: "var(--font-dashboard-display)" }}
            >
              <Clock className="h-5 w-5 text-amber-700" />
              Waiting for your confirmation
            </CardTitle>
            <CardDescription className="text-sm leading-6 text-slate-600">
              These payments are marked done and need your final confirmation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingConfirmation.map(renderSettlement)}
          </CardContent>
        </Card>
      )}

      {!settlements || settlements.length === 0 ? (
        <Empty
          className="rounded-[2rem] border border-dashed border-slate-200 bg-white/70 p-12 shadow-[0_25px_90px_-50px_rgba(15,23,42,0.22)] backdrop-blur"
          icon={ArrowLeftRight}
          title="No settlements yet"
          description="Settlements will appear here when you settle up with group members."
          action={
            <Link href="/groups">
              <Button className="rounded-full bg-slate-950 hover:bg-slate-900">
                Go to groups
              </Button>
            </Link>
          }
        />
      ) : (
        <Tabs defaultValue="all" className="space-y-5">
          <TabsList className="h-auto rounded-full border border-white/80 bg-white/80 p-1 shadow-[0_20px_70px_-45px_rgba(15,23,42,0.28)] backdrop-blur">
            <TabsTrigger value="all" className="rounded-full px-5">
              All
            </TabsTrigger>
            <TabsTrigger value="pending" className="rounded-full px-5">
              Pending ({pendingSettlements.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="rounded-full px-5">
              Completed ({completedSettlements.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card className="rounded-[2rem] border-white/80 bg-white/80 shadow-[0_25px_90px_-50px_rgba(15,23,42,0.35)] backdrop-blur">
              <CardHeader>
                <CardTitle
                  className="text-2xl tracking-[-0.03em] text-slate-950"
                  style={{ fontFamily: "var(--font-dashboard-display)" }}
                >
                  All settlements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {settlements.map(renderSettlement)}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending">
            {pendingSettlements.length === 0 ? (
              <Empty
                className="rounded-[2rem] border border-dashed border-slate-200 bg-white/70 p-12 shadow-[0_25px_90px_-50px_rgba(15,23,42,0.22)] backdrop-blur"
                icon={CheckCircle2}
                title="No pending settlements"
                description="All current settlement requests have been resolved."
              />
            ) : (
              <Card className="rounded-[2rem] border-white/80 bg-white/80 shadow-[0_25px_90px_-50px_rgba(15,23,42,0.35)] backdrop-blur">
                <CardHeader>
                  <CardTitle
                    className="text-2xl tracking-[-0.03em] text-slate-950"
                    style={{ fontFamily: "var(--font-dashboard-display)" }}
                  >
                    Pending settlements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pendingSettlements.map(renderSettlement)}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed">
            {completedSettlements.length === 0 ? (
              <Empty
                className="rounded-[2rem] border border-dashed border-slate-200 bg-white/70 p-12 shadow-[0_25px_90px_-50px_rgba(15,23,42,0.22)] backdrop-blur"
                icon={ArrowLeftRight}
                title="No completed settlements"
                description="Completed settlements will appear here once confirmed."
              />
            ) : (
              <Card className="rounded-[2rem] border-white/80 bg-white/80 shadow-[0_25px_90px_-50px_rgba(15,23,42,0.35)] backdrop-blur">
                <CardHeader>
                  <CardTitle
                    className="text-2xl tracking-[-0.03em] text-slate-950"
                    style={{ fontFamily: "var(--font-dashboard-display)" }}
                  >
                    Completed settlements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {completedSettlements.map(renderSettlement)}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}

      <AlertDialog
        open={!!confirmSettlement}
        onOpenChange={(open) => !open && setConfirmSettlement(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm settlement</AlertDialogTitle>
            <AlertDialogDescription>
              Are you confirming that {confirmSettlement?.payer.name} paid you{" "}
              <span className="font-semibold text-foreground">
                {confirmSettlement && formatCurrency(confirmSettlement.amount)}
              </span>
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isConfirming}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} disabled={isConfirming}>
              {isConfirming ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Confirming...
                </>
              ) : (
                "Confirm payment"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!cancelSettlement}
        onOpenChange={(open) => !open && setCancelSettlement(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel settlement</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this settlement request? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>
              No, keep it
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              disabled={isCancelling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isCancelling ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Cancelling...
                </>
              ) : (
                "Cancel settlement"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
