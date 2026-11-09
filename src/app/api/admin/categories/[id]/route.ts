import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const db = await connectToDatabase();
    if (db) {
      const updated = await Category.findByIdAndUpdate(id, body, { new: true });
      if (!updated) {
        return NextResponse.json(
          { success: false, message: "Category not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        category: updated,
        message: "Category updated successfully",
      });
    }

    return NextResponse.json({
      success: true,
      category: { ...body, _id: id },
      message: "Category updated (Demo)",
    });
  } catch (error) {
    console.error("Category update error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update category" },
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
      const category = await Category.findById(id);
      if (!category) {
        return NextResponse.json(
          { success: false, message: "Category not found" },
          { status: 404 }
        );
      }

      // Check if any plants currently belong to this category
      const productCount = await Product.countDocuments({
        category: category.name,
      });

      if (productCount > 0) {
        return NextResponse.json(
          {
            success: false,
            message: `Cannot delete category "${category.name}" because it still contains ${productCount} active products. Please reassign those plants first.`,
          },
          { status: 400 }
        );
      }

      await Category.findByIdAndDelete(id);
      return NextResponse.json({
        success: true,
        message: `Category "${category.name}" deleted safely.`,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Category deleted (Demo)",
    });
  } catch (error) {
    console.error("Category delete error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete category" },
      { status: 500 }
    );
  }
}

