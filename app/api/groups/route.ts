import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Group from "@/models/Group";
import User from "@/models/User";

// GET /api/groups - Get all groups for the current user
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const groups = await Group.find({
      "members.user": session.user.id,
    })
      .populate("members.user", "name email image")
      .populate("createdBy", "name email image")
      .sort({ updatedAt: -1 });

    return NextResponse.json(groups);
  } catch (error) {
    console.error("Error fetching groups:", error);
    return NextResponse.json(
      { error: "Failed to fetch groups" },
      { status: 500 }
    );
  }
}

// POST /api/groups - Create a new group
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description, memberEmails } = await request.json();

    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Group name must be at least 2 characters" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find member users by email
    const members = [
      { user: session.user.id, role: "admin" as const, joinedAt: new Date() },
    ];

    if (memberEmails && Array.isArray(memberEmails)) {
      for (const email of memberEmails) {
        if (email && email !== session.user.email) {
          const user = await User.findOne({ email: email.toLowerCase() });
          if (user) {
            members.push({
              user: user._id,
              role: "member" as const,
              joinedAt: new Date(),
            });
          }
        }
      }
    }

    const group = await Group.create({
      name: name.trim(),
      description: description?.trim() || "",
      members,
      createdBy: session.user.id,
    });

    const populatedGroup = await Group.findById(group._id)
      .populate("members.user", "name email image")
      .populate("createdBy", "name email image");

    return NextResponse.json(populatedGroup, { status: 201 });
  } catch (error) {
    console.error("Error creating group:", error);
    return NextResponse.json(
      { error: "Failed to create group" },
      { status: 500 }
    );
  }
}
