import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { PlantTip } from "@/models/PlantTip";
import { PlantTipSchema } from "@/lib/validations";
import { INITIAL_PLANT_TIPS } from "@/data/initialProducts";

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, error: "Database connection unavailable" },
        { status: 503 }
      );
    }

    const count = await PlantTip.countDocuments();
    if (count === 0) {
      await PlantTip.insertMany(
        INITIAL_PLANT_TIPS.map((tip) => ({
          authorName: tip.authorName,
          plantName: tip.plantName,
          content: tip.content,
          imageUrl: tip.imageUrl,
          likes: tip.likes,
          status: "approved",
        }))
      );
    }

    const tips = await PlantTip.find({ status: "approved" })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: tips,
    });
  } catch (error) {
    console.error("Plant tips GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load plant tips" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = PlantTipSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          errors: parsed.error.flatten().fieldErrors,
          message: "Please fill in all required fields properly.",
        },
        { status: 400 }
      );
    }

    const { authorName, plantName, content, imageUrl } = parsed.data;
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, message: "Database connection unavailable" },
        { status: 503 }
      );
    }

    const created = await PlantTip.create({
      authorName,
      plantName,
      content,
      imageUrl: imageUrl || "",
      status: "approved",
      likes: 1,
    });

    return NextResponse.json({
      success: true,
      persisted: true,
      data: created,
      message: "Your plant care tip has been published to the community!",
    });
  } catch (error) {
    console.error("Plant tips POST error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit plant tip" },
      { status: 500 }
    );
  }
}
