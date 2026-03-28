"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, IndianRupee } from "lucide-react";

interface GroupMember {
  user: {
    _id: string;
    name: string;
    email: string;
    image?: string;
  };
  role: "admin" | "member";
}

interface AddExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  members: GroupMember[];
  onSuccess: () => void;
}

const categories = [
  { value: "food", label: "Food & Drinks" },
  { value: "transport", label: "Transport" },
  { value: "entertainment", label: "Entertainment" },
  { value: "utilities", label: "Utilities" },
  { value: "rent", label: "Rent" },
  { value: "shopping", label: "Shopping" },
  { value: "health", label: "Health" },
  { value: "travel", label: "Travel" },
  { value: "other", label: "Other" },
];

export function AddExpenseDialog({
  open,
  onOpenChange,
  groupId,
  members,
  onSuccess,
}: AddExpenseDialogProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("other");
  const [date, setDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: description.trim(),
          amount: parsedAmount,
          groupId,
          category,
          date: date.toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add expense");
      }

      toast.success("Expense added successfully!");
      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add expense"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setDescription("");
    setAmount("");
    setCategory("other");
    setDate(new Date());
  };

  const sharePerPerson = amount
    ? (parseFloat(amount) / members.length).toFixed(2)
    : "0.00";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
          <DialogDescription>
            Add a new expense to split equally among group members.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description <span className="text-destructive">*</span>
            </label>
            <Input
              id="description"
              placeholder="e.g., Dinner at restaurant"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              required
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium">
              Amount <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10"
                disabled={isLoading}
                required
              />
            </div>
            {amount && parseFloat(amount) > 0 && (
              <p className="text-xs text-muted-foreground">
                Each person pays: Rs. {sharePerPerson} ({members.length} people)
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "MMM d, yyyy") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setDate(d)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Adding...
                </>
              ) : (
                "Add Expense"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
