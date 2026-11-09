import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { PlantTip } from "@/models/PlantTip";

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (db) {
      const tips = await PlantTip.find().sort({ createdAt: -1 }).lean();
      return NextResponse.json({ success: true, tips });
    }
    return NextResponse.json({ success: true, tips: [] });
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
    const { id, status } = await req.json();
    const db = await connectToDatabase();
    if (db) {
      const updated = await PlantTip.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
      return NextResponse.json({
        success: true,
        tip: updated,
        message: `Tip status updated to ${status}`,
      });
    }
    return NextResponse.json({
      success: true,
      message: `Tip status updated to ${status} (Demo)`,
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
    const { id } = await req.json();
    const db = await connectToDatabase();
    if (db) {
      await PlantTip.findByIdAndDelete(id);
      return NextResponse.json({
        success: true,
        message: "Tip deleted from community",
      });
    }
    return NextResponse.json({ success: true, message: "Tip deleted" });
  } catch (error) {
    console.error("Plant tip delete error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete tip" },
      { status: 500 }
    );
  }
}

