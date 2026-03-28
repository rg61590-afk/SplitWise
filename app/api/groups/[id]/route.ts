import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Group from "@/models/Group";
import User from "@/models/User";
import mongoose from "mongoose";

// GET /api/groups/[id] - Get a single group
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

    const group = await Group.findOne({
      _id: id,
      "members.user": session.user.id,
    })
      .populate("members.user", "name email image")
      .populate("createdBy", "name email image");

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    return NextResponse.json(group);
  } catch (error) {
    console.error("Error fetching group:", error);
    return NextResponse.json(
      { error: "Failed to fetch group" },
      { status: 500 }
    );
  }
}

// PUT /api/groups/[id] - Update a group
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
      return NextResponse.json({ error: "Invalid group ID" }, { status: 400 });
    }

    const { name, description } = await request.json();

    await connectDB();

    // Check if user is admin of the group
    const group = await Group.findOne({
      _id: id,
      members: {
        $elemMatch: { user: session.user.id, role: "admin" },
      },
    });

    if (!group) {
      return NextResponse.json(
        { error: "Group not found or you don't have permission" },
        { status: 404 }
      );
    }

    if (name) group.name = name.trim();
    if (description !== undefined) group.description = description.trim();

    await group.save();

    const updatedGroup = await Group.findById(group._id)
      .populate("members.user", "name email image")
      .populate("createdBy", "name email image");

    return NextResponse.json(updatedGroup);
  } catch (error) {
    console.error("Error updating group:", error);
    return NextResponse.json(
      { error: "Failed to update group" },
      { status: 500 }
    );
  }
}

// DELETE /api/groups/[id] - Delete a group
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
      return NextResponse.json({ error: "Invalid group ID" }, { status: 400 });
    }

    await connectDB();

    // Only admin can delete the group
    const group = await Group.findOneAndDelete({
      _id: id,
      members: {
        $elemMatch: { user: session.user.id, role: "admin" },
      },
    });

    if (!group) {
      return NextResponse.json(
        { error: "Group not found or you don't have permission" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Group deleted successfully" });
  } catch (error) {
    console.error("Error deleting group:", error);
    return NextResponse.json(
      { error: "Failed to delete group" },
      { status: 500 }
    );
  }
}
