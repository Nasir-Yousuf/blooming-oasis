import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { PlantTip } from "@/models/PlantTip";
import { getUserFromRequest, hasAdminAccess } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const authUser = getUserFromRequest(req);
    if (!hasAdminAccess(authUser?.role)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin privileges required." },
        { status: 403 }
      );
    }

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, message: "Database connection unavailable" },
        { status: 503 }
      );
    }

    const tips = await PlantTip.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, tips });
  } catch (error) {
    console.error("Plant tips moderation error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load tips" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authUser = getUserFromRequest(req);
    if (!hasAdminAccess(authUser?.role)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin privileges required." },
        { status: 403 }
      );
    }

    const { id, status } = await req.json();
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, message: "Database connection unavailable" },
        { status: 503 }
      );
    }

    const updated = await PlantTip.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Tip not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      tip: updated,
      message: `Tip status updated to ${status}`,
    });
  } catch (error) {
    console.error("Plant tip update error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update tip status" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authUser = getUserFromRequest(req);
    if (!hasAdminAccess(authUser?.role)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin privileges required." },
        { status: 403 }
      );
    }

    const { id } = await req.json();
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, message: "Database connection unavailable" },
        { status: 503 }
      );
    }

    const deleted = await PlantTip.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Tip not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Tip deleted from community",
    });
  } catch (error) {
    console.error("Plant tip delete error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete tip" },
      { status: 500 }
    );
  }
}
