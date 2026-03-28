import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

// GET /api/users - Search users by email or get all users
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get("email");

    await connectDB();

    if (email) {
      // Search for user by email (exact match)
      const user = await User.findOne({ email: email.toLowerCase() }).select(
        "name email image"
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
        },
      });
    }

    // Return all users (for dropdown suggestions)
    const users = await User.find({}).select("name email image").limit(100);

    return NextResponse.json({
      users: users.map((user) => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        image: user.image,
      })),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
