"use client";

import { useState } from "react";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Empty } from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
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
import { ArrowRight, CheckCircle2, Clock, ExternalLink, ArrowLeftRight, X } from "lucide-react";

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

  const [confirmSettlement, setConfirmSettlement] = useState<Settlement | null>(null);
  const [cancelSettlement, setCancelSettlement] = useState<Settlement | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

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
      <div className="flex items-center justify-center h-[50vh]">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-destructive">Failed to load settlements</p>
      </div>
    );
  }

  const pendingSettlements = settlements?.filter((s) => s.status === "pending") || [];
  const completedSettlements = settlements?.filter((s) => s.status === "completed") || [];

  // Settlements where current user needs to confirm (payee)
  const pendingConfirmation = pendingSettlements.filter(
    (s) => s.payee._id === session?.user?.id
  );

  // Settlements user initiated (payer)
  const pendingSent = pendingSettlements.filter(
    (s) => s.payer._id === session?.user?.id
  );

  const renderSettlement = (settlement: Settlement) => {
    const isPayer = settlement.payer._id === session?.user?.id;
    const isPayee = settlement.payee._id === session?.user?.id;

    return (
      <div key={settlement._id} className="flex items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Avatar className="h-9 w-9">
              <AvatarImage src={settlement.payer.image} />
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                {settlement.payer.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <Avatar className="h-9 w-9">
              <AvatarImage src={settlement.payee.image} />
              <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                {settlement.payee.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm">
              <span className="font-medium">
                {isPayer ? "You" : settlement.payer.name}
              </span>
              {" paid "}
              <span className="font-medium">
                {isPayee ? "you" : settlement.payee.name}
              </span>
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <Link
                href={`/groups/${settlement.group._id}`}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                {settlement.group.name}
                <ExternalLink className="h-3 w-3" />
              </Link>
              <span className="text-xs text-muted-foreground">
                {format(new Date(settlement.createdAt), "MMM d, yyyy")}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <p className="font-semibold text-primary">
              {formatCurrency(settlement.amount)}
            </p>
            <Badge
              variant={settlement.status === "completed" ? "default" : "secondary"}
              className="text-xs"
            >
              {settlement.status === "completed" ? (
                <>
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Confirmed
                </>
              ) : (
                <>
                  <Clock className="h-3 w-3 mr-1" />
                  Pending
                </>
              )}
            </Badge>
          </div>
          {settlement.status === "pending" && (
            <>
              {isPayee && (
                <Button size="sm" onClick={() => setConfirmSettlement(settlement)}>
                  Confirm
                </Button>
              )}
              {isPayer && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setCancelSettlement(settlement)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settlements</h1>
        <p className="text-muted-foreground">
          Track and manage payment settlements
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Confirmation</CardDescription>
            <CardTitle className="text-2xl">{pendingConfirmation.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Payments waiting for your confirmation
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Sent</CardDescription>
            <CardTitle className="text-2xl">{pendingSent.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Payments you sent awaiting confirmation
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-2xl">{completedSettlements.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Successfully completed settlements
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Confirmation Alert */}
      {pendingConfirmation.length > 0 && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Waiting for Your Confirmation
            </CardTitle>
            <CardDescription>
              These payments need your confirmation
            </CardDescription>
          </CardHeader>
          <CardContent className="divide-y">
            {pendingConfirmation.map(renderSettlement)}
          </CardContent>
        </Card>
      )}

      {!settlements || settlements.length === 0 ? (
        <Empty
          icon={ArrowLeftRight}
          title="No settlements yet"
          description="Settlements will appear here when you settle up with group members."
          action={
            <Link href="/groups">
              <Button>Go to Groups</Button>
            </Link>
          }
        />
      ) : (
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({pendingSettlements.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedSettlements.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">All Settlements</CardTitle>
              </CardHeader>
              <CardContent className="divide-y">
                {settlements.map(renderSettlement)}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending">
            {pendingSettlements.length === 0 ? (
              <Empty
                icon={CheckCircle2}
                title="No pending settlements"
                description="All settlements have been confirmed."
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pending Settlements</CardTitle>
                </CardHeader>
                <CardContent className="divide-y">
                  {pendingSettlements.map(renderSettlement)}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed">
            {completedSettlements.length === 0 ? (
              <Empty
                icon={ArrowLeftRight}
                title="No completed settlements"
                description="Completed settlements will appear here."
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Completed Settlements</CardTitle>
                </CardHeader>
                <CardContent className="divide-y">
                  {completedSettlements.map(renderSettlement)}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Confirm Settlement Dialog */}
      <AlertDialog
        open={!!confirmSettlement}
        onOpenChange={(open) => !open && setConfirmSettlement(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Settlement</AlertDialogTitle>
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
                "Confirm Payment"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Settlement Dialog */}
      <AlertDialog
        open={!!cancelSettlement}
        onOpenChange={(open) => !open && setCancelSettlement(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Settlement</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this settlement request? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>No, keep it</AlertDialogCancel>
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
                "Cancel Settlement"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
