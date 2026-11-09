import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/models/Product";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await connectToDatabase();

    if (db) {
      const product = await Product.findById(id).lean();
      if (product) {
        return NextResponse.json({ success: true, product });
      }
    }

    return NextResponse.json(
      { success: false, message: "Product not found" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Product lookup error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const db = await connectToDatabase();
    if (db) {
      const updated = await Product.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
      });

      if (!updated) {
        return NextResponse.json(
          { success: false, message: "Product not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        product: updated,
        message: "Product updated successfully",
      });
    }

    return NextResponse.json({
      success: true,
      product: { ...body, _id: id },
      message: "Product updated (Demo Mode)",
    });
  } catch (error) {
    console.error("Product update error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await connectToDatabase();

    if (db) {
      const deleted = await Product.findByIdAndDelete(id);
      if (!deleted) {
        return NextResponse.json(
          { success: false, message: "Product not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        message: "Product deleted safely",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted (Demo Mode)",
    });
  } catch (error) {
    console.error("Product delete error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete product" },
      { status: 500 }
    );
  }
}

