import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Settlement from "@/models/Settlement";
import Group from "@/models/Group";

// GET /api/settlements - Get all settlements for the current user
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get("groupId");
    const status = searchParams.get("status");

    await connectDB();

    let query: Record<string, unknown> = {
      $or: [{ payer: session.user.id }, { payee: session.user.id }],
    };

    if (groupId) {
      query.group = groupId;
    }

    if (status && (status === "pending" || status === "completed")) {
      query.status = status;
    }

    const settlements = await Settlement.find(query)
      .populate("payer", "name email image")
      .populate("payee", "name email image")
      .populate("group", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json(settlements);
  } catch (error) {
    console.error("Error fetching settlements:", error);
    return NextResponse.json(
      { error: "Failed to fetch settlements" },
      { status: 500 }
    );
  }
}

// POST /api/settlements - Create a new settlement
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { payeeId, amount, groupId } = await request.json();

    if (!payeeId || !amount || !groupId) {
      return NextResponse.json(
        { error: "Payee, amount, and group are required" },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than 0" },
        { status: 400 }
      );
    }

    if (payeeId === session.user.id) {
      return NextResponse.json(
        { error: "Cannot settle with yourself" },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify both users are members of the group
    const group = await Group.findOne({
      _id: groupId,
      "members.user": { $all: [session.user.id, payeeId] },
    });

    if (!group) {
      return NextResponse.json(
        { error: "Group not found or users are not members" },
        { status: 404 }
      );
    }

    const settlement = await Settlement.create({
      payer: session.user.id,
      payee: payeeId,
      amount: Number(amount),
      group: groupId,
      status: "pending",
    });

    const populatedSettlement = await Settlement.findById(settlement._id)
      .populate("payer", "name email image")
      .populate("payee", "name email image")
      .populate("group", "name");

    return NextResponse.json(populatedSettlement, { status: 201 });
  } catch (error) {
    console.error("Error creating settlement:", error);
    return NextResponse.json(
      { error: "Failed to create settlement" },
      { status: 500 }
    );
  }
}
