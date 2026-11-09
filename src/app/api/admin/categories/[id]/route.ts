import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import { getUserFromRequest, hasAdminAccess } from "@/lib/auth";
import { revalidateStoreCatalog } from "@/lib/data-access";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = getUserFromRequest(req);
    if (!hasAdminAccess(authUser?.role)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin privileges required." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await req.json();

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, message: "Database connection unavailable" },
        { status: 503 }
      );
    }

    const oldCategory = await Category.findById(id);
    if (!oldCategory) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    const oldName = oldCategory.name;
    const updated = await Category.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    // Synchronize product category names if category name changed
    if (body.name && body.name !== oldName) {
      await Product.updateMany(
        { category: oldName },
        { category: body.name }
      );
    }

    revalidateStoreCatalog();

    return NextResponse.json({
      success: true,
      category: updated,
      message: "Category updated successfully",
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
    const authUser = getUserFromRequest(req);
    if (!hasAdminAccess(authUser?.role)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Admin privileges required." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, message: "Database connection unavailable" },
        { status: 503 }
      );
    }

    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    // Safe handling: Reassign products in deleted category to "General" or unassigned category
    await Product.updateMany(
      { category: category.name },
      { category: "Uncategorized" }
    );

    await Category.findByIdAndDelete(id);
    revalidateStoreCatalog();

    return NextResponse.json({
      success: true,
      message: `Category "${category.name}" removed safely. Associated products reassigned to Uncategorized.`,
    });
  } catch (error) {
    console.error("Category delete error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete category" },
      { status: 500 }
    );
  }
}
