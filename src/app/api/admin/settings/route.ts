import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { StoreSettings } from "@/models/StoreSettings";
import { getUserFromRequest, hasAdminAccess } from "@/lib/auth";
import { revalidatePath } from "next/cache";

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

    let settings = await StoreSettings.findOne().lean();
    if (!settings) {
      settings = (await StoreSettings.create({})).toObject();
    }
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load store settings" },
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

    const body = await req.json();
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, message: "Database connection unavailable" },
        { status: 503 }
      );
    }

    let settings = await StoreSettings.findOne();
    if (!settings) {
      settings = await StoreSettings.create(body);
    } else {
      Object.assign(settings, body);
      await settings.save();
    }

    try {
      revalidatePath("/");
      revalidatePath("/checkout");
      revalidatePath("/contact");
    } catch {
      // safe in non-request contexts
    }

    return NextResponse.json({
      success: true,
      settings,
      message: "Store settings saved successfully!",
    });
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save settings" },
      { status: 500 }
    );
  }
}
