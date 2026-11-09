import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { StoreSettings } from "@/models/StoreSettings";

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (db) {
      let settings = await StoreSettings.findOne().lean();
      if (!settings) {
        settings = (await StoreSettings.create({})).toObject();
      }
      return NextResponse.json({ success: true, settings });
    }

    return NextResponse.json({
      success: true,
      settings: {
        storeName: "Blooming Oasis",
        storeEmail: "care@bloomingoasis.demo",
        phone: "+1 (800) 555-PLANT",
        currency: "USD",
        deliveryCharge: 12,
        freeDeliveryThreshold: 75,
        address: "742 Botanical Way, Suite 4B, Verdant Green District, CA 94107",
        announcementText:
          "Bring home a little more green. Free delivery on orders over $75.",
        announcementActive: true,
      },
    });
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
    const body = await req.json();
    const db = await connectToDatabase();
    if (db) {
      let settings = await StoreSettings.findOne();
      if (!settings) {
        settings = await StoreSettings.create(body);
      } else {
        Object.assign(settings, body);
        await settings.save();
      }
      return NextResponse.json({
        success: true,
        settings,
        message: "Store settings saved successfully!",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Store settings updated (Demo Mode)",
    });
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save settings" },
      { status: 500 }
    );
  }
}

