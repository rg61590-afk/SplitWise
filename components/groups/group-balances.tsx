"use client";

import { useState } from "react";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Empty } from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowRight, CheckCircle2, Wallet } from "lucide-react";

interface GroupMember {
  user: {
    _id: string;
    name: string;
    email: string;
    image?: string;
  };
  role: "admin" | "member";
}

interface Balance {
  from: string;
  fromName: string;
  fromImage?: string;
  to: string;
  toName: string;
  toImage?: string;
  amount: number;
}

interface MemberBalance {
  userId: string;
  name: string;
  email: string;
  image?: string;
  totalPaid: number;
  totalOwed: number;
  netBalance: number;
}

interface BalanceData {
  memberBalances: MemberBalance[];
  simplifiedDebts: Balance[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function GroupBalances({
  groupId,
  members,
}: {
  groupId: string;
  members: GroupMember[];
}) {
  const { data: session } = useSession();
  const {
    data: balanceData,
    error,
    isLoading,
    mutate,
  } = useSWR<BalanceData>(`/api/groups/${groupId}/balances`, fetcher);

  const [settleDebt, setSettleDebt] = useState<Balance | null>(null);
  const [isSettling, setIsSettling] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleSettle = async () => {
    if (!settleDebt) return;

    setIsSettling(true);
    try {
      const response = await fetch("/api/settlements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payeeId: settleDebt.to,
          amount: settleDebt.amount,
          groupId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create settlement");
      }

      toast.success("Settlement request sent!");
      mutate();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create settlement"
      );
    } finally {
      setIsSettling(false);
      setSettleDebt(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[30vh]">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[30vh]">
        <p className="text-destructive">Failed to load balances</p>
      </div>
    );
  }

  const currentUserBalance = balanceData?.memberBalances.find(
    (b) => b.userId === session?.user?.id
  );

  const userDebts = balanceData?.simplifiedDebts.filter(
    (d) => d.from === session?.user?.id
  ) || [];

  const userCredits = balanceData?.simplifiedDebts.filter(
    (d) => d.to === session?.user?.id
  ) || [];

  return (
    <div className="space-y-6">
      {/* Your Balance Summary */}
      {currentUserBalance && (
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Your Balance</CardTitle>
            <CardDescription>Summary of your expenses in this group</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">You paid</p>
                <p className="text-lg font-semibold text-primary">
                  {formatCurrency(currentUserBalance.totalPaid)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Your share</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(currentUserBalance.totalOwed)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Net balance</p>
                <p
                  className={`text-lg font-semibold ${
                    currentUserBalance.netBalance >= 0
                      ? "text-primary"
                      : "text-destructive"
                  }`}
                >
                  {currentUserBalance.netBalance >= 0 ? "+" : ""}
                  {formatCurrency(currentUserBalance.netBalance)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Simplified Debts */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Settlements Needed</h3>

        {!balanceData?.simplifiedDebts ||
        balanceData.simplifiedDebts.length === 0 ? (
          <Empty
            icon={CheckCircle2}
            title="All settled up!"
            description="No outstanding balances in this group."
          />
        ) : (
          <div className="space-y-4">
            {/* Debts you owe */}
            {userDebts.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-destructive">
                    You Owe
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userDebts.map((debt, index) => (
                    <div key={`${debt.from}-${debt.to}`}>
                      {index > 0 && <Separator className="mb-4" />}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={debt.toImage} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {debt.toName?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{debt.toName}</p>
                            <p className="text-sm text-destructive">
                              {formatCurrency(debt.amount)}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => setSettleDebt(debt)}
                        >
                          Settle Up
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Money owed to you */}
            {userCredits.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-primary">
                    Owed to You
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userCredits.map((credit, index) => (
                    <div key={`${credit.from}-${credit.to}`}>
                      {index > 0 && <Separator className="mb-4" />}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={credit.fromImage} />
                            <AvatarFallback className="bg-muted text-muted-foreground">
                              {credit.fromName?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{credit.fromName}</p>
                            <p className="text-sm text-primary">
                              {formatCurrency(credit.amount)}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">Pending</Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Other debts */}
            {balanceData.simplifiedDebts.filter(
              (d) => d.from !== session?.user?.id && d.to !== session?.user?.id
            ).length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Other Balances</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {balanceData.simplifiedDebts
                    .filter(
                      (d) =>
                        d.from !== session?.user?.id &&
                        d.to !== session?.user?.id
                    )
                    .map((debt, index) => (
                      <div key={`${debt.from}-${debt.to}`}>
                        {index > 0 && <Separator className="mb-4" />}
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={debt.fromImage} />
                            <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                              {debt.fromName?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={debt.toImage} />
                            <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                              {debt.toName?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">
                            {debt.fromName} owes {debt.toName}{" "}
                            <span className="font-medium text-foreground">
                              {formatCurrency(debt.amount)}
                            </span>
                          </span>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Member Balances Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Member Balances</CardTitle>
          <CardDescription>
            Overview of what each member has paid and owes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {balanceData?.memberBalances.map((balance, index) => (
              <div key={balance.userId}>
                {index > 0 && <Separator className="mb-4" />}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={balance.image} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {balance.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {balance.name}
                        {balance.userId === session?.user?.id && (
                          <span className="text-muted-foreground ml-1">(You)</span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Paid: {formatCurrency(balance.totalPaid)} | Share:{" "}
                        {formatCurrency(balance.totalOwed)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-medium ${
                        balance.netBalance >= 0 ? "text-primary" : "text-destructive"
                      }`}
                    >
                      {balance.netBalance >= 0 ? "+" : ""}
                      {formatCurrency(balance.netBalance)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {balance.netBalance >= 0 ? "gets back" : "owes"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Settle Dialog */}
      <Dialog open={!!settleDebt} onOpenChange={(open) => !open && setSettleDebt(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Settle Up</DialogTitle>
            <DialogDescription>
              Record a payment to {settleDebt?.toName}
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <div className="flex items-center justify-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {session?.user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-center">
                <ArrowRight className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-primary">
                  {settleDebt && formatCurrency(settleDebt.amount)}
                </span>
              </div>
              <Avatar className="h-12 w-12">
                <AvatarImage src={settleDebt?.toImage} />
                <AvatarFallback className="bg-muted">
                  {settleDebt?.toName?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              This will send a settlement request to {settleDebt?.toName}. They
              will need to confirm the payment.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSettleDebt(null)}
              disabled={isSettling}
            >
              Cancel
            </Button>
            <Button onClick={handleSettle} disabled={isSettling}>
              {isSettling ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Sending...
                </>
              ) : (
                "Send Settlement"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
