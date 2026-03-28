import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// GET /api/users/profile - Get current user profile
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session.user.id).select(
      "name email image provider createdAt"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        image: user.image,
        provider: user.provider,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// PUT /api/users/profile - Update current user profile
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, currentPassword, newPassword } = body;

    await connectDB();

    const user = await User.findById(session.user.id).select("+password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update name if provided
    if (name && name.trim()) {
      user.name = name.trim();
    }

    // Update password if provided (only for credentials users)
    if (currentPassword && newPassword) {
      if (user.provider !== "credentials") {
        return NextResponse.json(
          { error: "Cannot change password for OAuth users" },
          { status: 400 }
        );
      }

      if (!user.password) {
        return NextResponse.json(
          { error: "No password set for this account" },
          { status: 400 }
        );
      }

      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isPasswordValid) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 }
        );
      }

      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: "New password must be at least 6 characters" },
          { status: 400 }
        );
      }

      user.password = await bcrypt.hash(newPassword, 12);
    }

    await user.save();

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        image: user.image,
        provider: user.provider,
      },
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
