import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Expense from "@/models/Expense";
import Group from "@/models/Group";

// GET /api/expenses - Get all expenses for the current user
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get("groupId");

    await connectDB();

    let query: Record<string, unknown> = {};

    if (groupId) {
      // Get expenses for a specific group
      const group = await Group.findOne({
        _id: groupId,
        "members.user": session.user.id,
      });

      if (!group) {
        return NextResponse.json(
          { error: "Group not found or you're not a member" },
          { status: 404 }
        );
      }

      query = { group: groupId };
    } else {
      // Get all expenses for groups the user is a member of
      const userGroups = await Group.find({
        "members.user": session.user.id,
      }).select("_id");

      const groupIds = userGroups.map((g) => g._id);
      query = { group: { $in: groupIds } };
    }

    const expenses = await Expense.find(query)
      .populate("paidBy", "name email image")
      .populate("shares.user", "name email image")
      .populate("group", "name")
      .sort({ date: -1 });

    return NextResponse.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}

// POST /api/expenses - Create a new expense
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { description, amount, groupId, category, date, splitAmong } =
      await request.json();

    if (!description || !amount || !groupId) {
      return NextResponse.json(
        { error: "Description, amount, and group are required" },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than 0" },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify user is a member of the group
    const group = await Group.findOne({
      _id: groupId,
      "members.user": session.user.id,
    });

    if (!group) {
      return NextResponse.json(
        { error: "Group not found or you're not a member" },
        { status: 404 }
      );
    }

    // Determine who to split among
    let participantIds: string[];

    if (splitAmong && Array.isArray(splitAmong) && splitAmong.length > 0) {
      // Custom split among selected members
      participantIds = splitAmong;
    } else {
      // Split among all group members
      participantIds = group?.members?.map((m) => m.user.toString());
    }

    // Calculate equal share
    const shareAmount = Number((amount / participantIds.length).toFixed(2));

    // Create shares for each participant
    const shares = participantIds.map((userId) => ({
      user: userId,
      amount: shareAmount,
      isPaid: userId === session.user.id, // Payer's share is marked as paid
    }));

    const expense = await Expense.create({
      description: description.trim(),
      amount: Number(amount),
      paidBy: session.user.id,
      group: groupId,
      shares,
      category: category || "other",
      date: date ? new Date(date) : new Date(),
    });

    const populatedExpense = await Expense.findById(expense._id)
      .populate("paidBy", "name email image")
      .populate("shares.user", "name email image")
      .populate("group", "name");

    return NextResponse.json(populatedExpense, { status: 201 });
  } catch (error) {
    console.error("Error creating expense:", error);
    return NextResponse.json(
      { error: "Failed to create expense" },
      { status: 500 }
    );
  }
}
