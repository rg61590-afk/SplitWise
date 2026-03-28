import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Group from "@/models/Group";
import Expense from "@/models/Expense";
import Settlement from "@/models/Settlement";
import mongoose from "mongoose";

export interface Balance {
  from: string;
  fromName: string;
  fromImage?: string;
  to: string;
  toName: string;
  toImage?: string;
  amount: number;
}

export interface MemberBalance {
  userId: string;
  name: string;
  email: string;
  image?: string;
  totalPaid: number;
  totalOwed: number;
  netBalance: number; // Positive means they're owed, negative means they owe
}

// GET /api/groups/[id]/balances - Get balances for a group
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid group ID" }, { status: 400 });
    }

    await connectDB();

    // Verify user is a member of the group
    const group = await Group.findOne({
      _id: id,
      "members.user": session.user.id,
    }).populate("members.user", "name email image");

    if (!group) {
      return NextResponse.json(
        { error: "Group not found or you're not a member" },
        { status: 404 }
      );
    }

    // Get all expenses for the group
    const expenses = await Expense.find({ group: id }).populate(
      "paidBy shares.user",
      "name email image"
    );

    // Get completed settlements for the group
    const settlements = await Settlement.find({
      group: id,
      status: "completed",
    });

    // Calculate what each person has paid and owes
    const memberBalances: Record<string, MemberBalance> = {};

    // Initialize balances for all members
    for (const member of group.members) {
      const user = member.user as unknown as {
        _id: mongoose.Types.ObjectId;
        name: string;
        email: string;
        image?: string;
      };
      memberBalances[user._id.toString()] = {
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
        image: user.image,
        totalPaid: 0,
        totalOwed: 0,
        netBalance: 0,
      };
    }

    // Process expenses
    for (const expense of expenses) {
      const payerId = expense.paidBy._id.toString();

      // Add to what payer has paid
      if (memberBalances[payerId]) {
        memberBalances[payerId].totalPaid += expense.amount;
      }

      // Add to what each person owes
      for (const share of expense.shares) {
        const userId = share.user._id.toString();
        if (memberBalances[userId]) {
          memberBalances[userId].totalOwed += share.amount;
        }
      }
    }

    // Process settlements
    for (const settlement of settlements) {
      const payerId = settlement.payer.toString();
      const payeeId = settlement.payee.toString();

      // Settlement means payer paid money to payee
      // So payer's "paid" increases, payee's "owed" decreases
      if (memberBalances[payerId]) {
        memberBalances[payerId].totalPaid += settlement.amount;
      }
      if (memberBalances[payeeId]) {
        memberBalances[payeeId].totalOwed += settlement.amount;
      }
    }

    // Calculate net balance for each member
    const memberBalanceArray = Object.values(memberBalances).map((balance) => ({
      ...balance,
      netBalance: balance.totalPaid - balance.totalOwed,
    }));

    // Calculate simplified debts (who owes whom)
    const simplifiedDebts = calculateSimplifiedDebts(memberBalanceArray);

    return NextResponse.json({
      memberBalances: memberBalanceArray,
      simplifiedDebts,
    });
  } catch (error) {
    console.error("Error calculating balances:", error);
    return NextResponse.json(
      { error: "Failed to calculate balances" },
      { status: 500 }
    );
  }
}

function calculateSimplifiedDebts(balances: MemberBalance[]): Balance[] {
  // Separate creditors (positive balance) and debtors (negative balance)
  const creditors = balances
    .filter((b) => b.netBalance > 0.01)
    .map((b) => ({ ...b }))
    .sort((a, b) => b.netBalance - a.netBalance);

  const debtors = balances
    .filter((b) => b.netBalance < -0.01)
    .map((b) => ({ ...b, netBalance: Math.abs(b.netBalance) }))
    .sort((a, b) => b.netBalance - a.netBalance);

  const debts: Balance[] = [];

  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const amount = Math.min(debtor.netBalance, creditor.netBalance);

    if (amount > 0.01) {
      debts.push({
        from: debtor.userId,
        fromName: debtor.name,
        fromImage: debtor.image,
        to: creditor.userId,
        toName: creditor.name,
        toImage: creditor.image,
        amount: Number(amount.toFixed(2)),
      });
    }

    debtor.netBalance -= amount;
    creditor.netBalance -= amount;

    if (debtor.netBalance < 0.01) i++;
    if (creditor.netBalance < 0.01) j++;
  }

  return debts;
}
