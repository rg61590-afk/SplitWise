"use client";

import { useState } from "react";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Empty } from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
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
import { AddExpenseDialog } from "@/components/expenses/add-expense-dialog";
import { Plus, Receipt, Trash2 } from "lucide-react";

interface GroupMember {
  user: {
    _id: string;
    name: string;
    email: string;
    image?: string;
  };
  role: "admin" | "member";
}

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

export function GroupExpenses({
  groupId,
  members,
}: {
  groupId: string;
  members: GroupMember[];
}) {
  const { data: session } = useSession();
  const {
    data: expenses,
    error,
    isLoading,
    mutate,
  } = useSWR<Expense[]>(`/api/expenses?groupId=${groupId}`, fetcher);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteExpense = async () => {
    if (!expenseToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/expenses/${expenseToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete expense");
      }

      toast.success("Expense deleted successfully");
      mutate();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete expense"
      );
    } finally {
      setIsDeleting(false);
      setExpenseToDelete(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
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
        <p className="text-destructive">Failed to load expenses</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Expenses</h3>
          <p className="text-sm text-muted-foreground">
            {expenses?.length || 0} expense{expenses?.length !== 1 ? "s" : ""} in
            this group
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="cursor-pointer">
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </div>

      {!expenses || expenses.length === 0 ? (
        <Empty
          icon={Receipt}
          title="No expenses yet"
          description="Add your first expense to start tracking."
          action={
            <Button onClick={() => setIsAddOpen(true)} className="cursor-pointer">
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          }
        />
      ) : (
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-base">Recent Expenses</CardTitle>
            <CardDescription>
              Total: {formatCurrency(expenses.reduce((sum, e) => sum + e.amount, 0))}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
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
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(expense.date), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-right">
                          {userShare && !isPayer && (
                            <p className="text-sm font-medium text-destructive">
                              You owe {formatCurrency(userShare.amount)}
                            </p>
                          )}
                          {isPayer && (
                            <p className="text-sm font-medium text-primary">
                              You get back{" "}
                              {formatCurrency(
                                expense.amount -
                                  (userShare?.amount || 0)
                              )}
                            </p>
                          )}
                        </div>
                        {isPayer && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => setExpenseToDelete(expense._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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

      <AddExpenseDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        groupId={groupId}
        members={members}
        onSuccess={() => mutate()}
      />

      <AlertDialog
        open={!!expenseToDelete}
        onOpenChange={(open) => !open && setExpenseToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Expense</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this expense? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteExpense}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
            >
              {isDeleting ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
