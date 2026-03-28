import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Settlement from "@/models/Settlement";
import mongoose from "mongoose";

// PUT /api/settlements/[id] - Update settlement status (confirm payment)
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
      return NextResponse.json(
        { error: "Invalid settlement ID" },
        { status: 400 }
      );
    }

    const { status } = await request.json();

    if (status !== "completed") {
      return NextResponse.json(
        { error: "Invalid status. Only 'completed' is allowed" },
        { status: 400 }
      );
    }

    await connectDB();

    const settlement = await Settlement.findById(id);

    if (!settlement) {
      return NextResponse.json(
        { error: "Settlement not found" },
        { status: 404 }
      );
    }

    // Only the payee can confirm the settlement
    if (settlement.payee.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "Only the payee can confirm the settlement" },
        { status: 403 }
      );
    }

    if (settlement.status === "completed") {
      return NextResponse.json(
        { error: "Settlement is already completed" },
        { status: 400 }
      );
    }

    settlement.status = "completed";
    settlement.completedAt = new Date();
    await settlement.save();

    const updatedSettlement = await Settlement.findById(settlement._id)
      .populate("payer", "name email image")
      .populate("payee", "name email image")
      .populate("group", "name");

    return NextResponse.json(updatedSettlement);
  } catch (error) {
    console.error("Error updating settlement:", error);
    return NextResponse.json(
      { error: "Failed to update settlement" },
      { status: 500 }
    );
  }
}

// DELETE /api/settlements/[id] - Cancel a pending settlement
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
      return NextResponse.json(
        { error: "Invalid settlement ID" },
        { status: 400 }
      );
    }

    await connectDB();

    const settlement = await Settlement.findById(id);

    if (!settlement) {
      return NextResponse.json(
        { error: "Settlement not found" },
        { status: 404 }
      );
    }

    // Only the payer can cancel a pending settlement
    if (settlement.payer.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "Only the payer can cancel the settlement" },
        { status: 403 }
      );
    }

    if (settlement.status === "completed") {
      return NextResponse.json(
        { error: "Cannot cancel a completed settlement" },
        { status: 400 }
      );
    }

    await Settlement.findByIdAndDelete(id);

    return NextResponse.json({ message: "Settlement cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling settlement:", error);
    return NextResponse.json(
      { error: "Failed to cancel settlement" },
      { status: 500 }
    );
  }
}
