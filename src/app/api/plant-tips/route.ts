import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { PlantTip } from "@/models/PlantTip";
import { PlantTipSchema } from "@/lib/validations";
import { INITIAL_PLANT_TIPS } from "@/data/initialProducts";

export async function GET() {
  try {
    const db = await connectToDatabase();

    if (db) {
      try {
        const tips = await PlantTip.find({ status: "approved" })
          .sort({ createdAt: -1 })
          .lean();

        if (tips.length > 0) {
          return NextResponse.json({
            success: true,
            dataSource: "mongodb-atlas",
            data: tips,
          });
        }
      } catch (err) {
        console.warn("MongoDB plant tips query failed:", err);
      }
    }

    return NextResponse.json({
      success: true,
      dataSource: "local-fallback",
      data: INITIAL_PLANT_TIPS.map((tip, idx) => ({
        _id: `mock-tip-${idx}`,
        authorName: tip.authorName,
        plantName: tip.plantName,
        content: tip.content,
        imageUrl: tip.imageUrl,
        likes: tip.likes,
        createdAt: new Date().toISOString(),
      })),
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

    if (db) {
      const created = await PlantTip.create({
        authorName,
        plantName,
        content,
        imageUrl: imageUrl || "",
        status: "approved", // Auto-approved for assessment demo
        likes: 1,
      });

      return NextResponse.json({
        success: true,
        persisted: true,
        data: created,
        message: "Your plant care tip has been published to the community!",
      });
    }

    return NextResponse.json({
      success: true,
      persisted: false,
      data: {
        _id: `local-tip-${Date.now()}`,
        authorName,
        plantName,
        content,
        imageUrl: imageUrl || "",
        likes: 1,
        createdAt: new Date().toISOString(),
      },
      message:
        "Your plant care experience has been received and previewed successfully!",
    });
  } catch (error) {
    console.error("Plant tip POST error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to publish tip" },
      { status: 500 }
    );
  }
}

