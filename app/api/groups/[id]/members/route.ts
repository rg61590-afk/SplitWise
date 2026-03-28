import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Group from "@/models/Group";
import User from "@/models/User";
import mongoose from "mongoose";

// POST /api/groups/[id]/members - Add a member to a group
export async function POST(
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

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

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

    // Find the user to add
    const userToAdd = await User.findOne({ email: email.toLowerCase() });

    if (!userToAdd) {
      return NextResponse.json(
        { error: "User not found. They need to register first." },
        { status: 404 }
      );
    }

    // Check if user is already a member
    const isMember = group.members.some(
      (member) => member.user.toString() === userToAdd._id.toString()
    );

    if (isMember) {
      return NextResponse.json(
        { error: "User is already a member of this group" },
        { status: 400 }
      );
    }

    // Add the member
    group.members.push({
      user: userToAdd._id,
      role: "member",
      joinedAt: new Date(),
    });

    await group.save();

    const updatedGroup = await Group.findById(group._id)
      .populate("members.user", "name email image")
      .populate("createdBy", "name email image");

    return NextResponse.json(updatedGroup);
  } catch (error) {
    console.error("Error adding member:", error);
    return NextResponse.json(
      { error: "Failed to add member" },
      { status: 500 }
    );
  }
}

// DELETE /api/groups/[id]/members - Remove a member from a group
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

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const group = await Group.findById(id);

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    // Check if current user is admin or removing themselves
    const currentUserMember = group.members.find(
      (member) => member.user.toString() === session.user.id
    );

    if (!currentUserMember) {
      return NextResponse.json(
        { error: "You are not a member of this group" },
        { status: 403 }
      );
    }

    const isAdmin = currentUserMember.role === "admin";
    const isRemovingSelf = userId === session.user.id;

    if (!isAdmin && !isRemovingSelf) {
      return NextResponse.json(
        { error: "Only admins can remove other members" },
        { status: 403 }
      );
    }

    // Don't allow removing the last admin
    if (isAdmin && isRemovingSelf) {
      const adminCount = group.members.filter((m) => m.role === "admin").length;
      if (adminCount === 1) {
        return NextResponse.json(
          { error: "Cannot remove the last admin. Transfer admin role first." },
          { status: 400 }
        );
      }
    }

    // Remove the member
    group.members = group.members.filter(
      (member) => member.user.toString() !== userId
    );

    await group.save();

    const updatedGroup = await Group.findById(group._id)
      .populate("members.user", "name email image")
      .populate("createdBy", "name email image");

    return NextResponse.json(updatedGroup);
  } catch (error) {
    console.error("Error removing member:", error);
    return NextResponse.json(
      { error: "Failed to remove member" },
      { status: 500 }
    );
  }
}
