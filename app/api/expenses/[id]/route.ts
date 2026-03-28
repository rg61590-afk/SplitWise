import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Expense from "@/models/Expense";
import Group from "@/models/Group";
import mongoose from "mongoose";

// GET /api/expenses/[id] - Get a single expense
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
      return NextResponse.json({ error: "Invalid expense ID" }, { status: 400 });
    }

    await connectDB();

    const expense = await Expense.findById(id)
      .populate("paidBy", "name email image")
      .populate("shares.user", "name email image")
      .populate("group", "name");

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    // Verify user is a member of the group
    const group = await Group.findOne({
      _id: expense.group,
      "members.user": session.user.id,
    });

    if (!group) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(expense);
  } catch (error) {
    console.error("Error fetching expense:", error);
    return NextResponse.json(
      { error: "Failed to fetch expense" },
      { status: 500 }
    );
  }
}

// PUT /api/expenses/[id] - Update an expense
export async function PUT(
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
      return NextResponse.json({ error: "Invalid expense ID" }, { status: 400 });
    }

    const { description, amount, category, date } = await request.json();

    await connectDB();

    // Find the expense and verify ownership
    const expense = await Expense.findById(id);

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    // Only the person who paid can edit the expense
    if (expense.paidBy.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "Only the payer can edit this expense" },
        { status: 403 }
      );
    }

    // Update expense
    if (description) expense.description = description.trim();
    if (category) expense.category = category;
    if (date) expense.date = new Date(date);

    // If amount changed, recalculate shares
    if (amount && amount !== expense.amount) {
      const newAmount = Number(amount);
      const participantCount = expense.shares.length;
      const shareAmount = Number((newAmount / participantCount).toFixed(2));

      expense.amount = newAmount;
      expense.shares = expense.shares.map((share) => ({
        ...share,
        amount: shareAmount,
      }));
    }

    await expense.save();

    const updatedExpense = await Expense.findById(expense._id)
      .populate("paidBy", "name email image")
      .populate("shares.user", "name email image")
      .populate("group", "name");

    return NextResponse.json(updatedExpense);
  } catch (error) {
    console.error("Error updating expense:", error);
    return NextResponse.json(
      { error: "Failed to update expense" },
      { status: 500 }
    );
  }
}

// DELETE /api/expenses/[id] - Delete an expense
export async function DELETE(
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
      return NextResponse.json({ error: "Invalid expense ID" }, { status: 400 });
    }

    await connectDB();

    const expense = await Expense.findById(id);

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    // Only the payer or group admin can delete
    const group = await Group.findOne({
      _id: expense.group,
      $or: [
        { "members": { $elemMatch: { user: session.user.id, role: "admin" } } },
      ],
    });

    const isPayer = expense.paidBy.toString() === session.user.id;

    if (!isPayer && !group) {
      return NextResponse.json(
        { error: "Only the payer or group admin can delete this expense" },
        { status: 403 }
      );
    }

    await Expense.findByIdAndDelete(id);

    return NextResponse.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return NextResponse.json(
      { error: "Failed to delete expense" },
      { status: 500 }
    );
  }
}
