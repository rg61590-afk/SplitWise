import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Group from "@/models/Group";
import Expense from "@/models/Expense";
import Settlement from "@/models/Settlement";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get all groups the user is a member of
    const groups = await Group.find({
      "members.user": session.user.id,
    })
      .populate("members.user", "name email image")
      .sort({ updatedAt: -1 });

    const groupIds = groups.map((g) => g._id);

    // Get all expenses for user's groups
    const expenses = await Expense.find({
      group: { $in: groupIds },
    })
      .populate("paidBy", "name email image")
      .populate("group", "name")
      .sort({ date: -1 })
      .limit(10);

    // Get pending settlements
    const pendingSettlements = await Settlement.find({
      $or: [{ payer: session.user.id }, { payee: session.user.id }],
      status: "pending",
    })
      .populate("payer payee", "name email image")
      .populate("group", "name");

    // Calculate totals
    let totalPaid = 0;
    let totalOwed = 0;

    for (const expense of await Expense.find({ group: { $in: groupIds } })) {
      const isPayer = expense.paidBy.toString() === session.user.id;
      const userShare = expense.shares.find(
        (s) => s.user.toString() === session.user.id
      );

      if (isPayer) {
        totalPaid += expense.amount;
      }
      if (userShare) {
        totalOwed += userShare.amount;
      }
    }

    // Calculate net balance across all groups
    const netBalance = totalPaid - totalOwed;

    // Get activity summary
    const totalGroups = groups.length;
    const totalExpenses = await Expense.countDocuments({
      group: { $in: groupIds },
    });

    // Calculate what you owe and what's owed to you
    let youOwe = 0;
    let owedToYou = 0;

    for (const group of groups) {
      const groupExpenses = await Expense.find({ group: group._id });

      for (const expense of groupExpenses) {
        const isPayer = expense.paidBy.toString() === session.user.id;
        const userShare = expense.shares.find(
          (s) => s.user.toString() === session.user.id
        );

        if (isPayer) {
          // Others owe you
          const othersShare = expense.shares
            .filter((s) => s.user.toString() !== session.user.id)
            .reduce((sum, s) => sum + s.amount, 0);
          owedToYou += othersShare;
        } else if (userShare) {
          // You owe
          youOwe += userShare.amount;
        }
      }
    }

    // Adjust for completed settlements
    const completedSettlements = await Settlement.find({
      group: { $in: groupIds },
      status: "completed",
    });

    for (const settlement of completedSettlements) {
      if (settlement.payer.toString() === session.user.id) {
        youOwe -= settlement.amount;
      } else if (settlement.payee.toString() === session.user.id) {
        owedToYou -= settlement.amount;
      }
    }

    // Ensure non-negative values
    youOwe = Math.max(0, youOwe);
    owedToYou = Math.max(0, owedToYou);

    return NextResponse.json({
      stats: {
        totalGroups,
        totalExpenses,
        totalPaid,
        netBalance,
        youOwe,
        owedToYou,
      },
      groups: groups.slice(0, 5),
      recentExpenses: expenses,
      pendingSettlements,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
