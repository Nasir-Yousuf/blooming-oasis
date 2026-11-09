import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { InventoryLog } from "@/models/InventoryLog";
import { getUserFromRequest, canManageProducts } from "@/lib/auth";
import { revalidateStoreCatalog } from "@/lib/data-access";

export async function GET(req: NextRequest) {
  try {
    const authUser = getUserFromRequest(req);
    if (!authUser || !canManageProducts(authUser.role)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Inventory access required." },
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

    const products = await Product.find()
      .select("name slug sku stock price category images published")
      .sort({ stock: 1, name: 1 })
      .lean();

    const recentLogs = await InventoryLog.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return NextResponse.json({
      success: true,
      inventory: products,
      logs: recentLogs,
    });
  } catch (error) {
    console.error("Inventory GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load inventory" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authUser = getUserFromRequest(req);
    if (!authUser || !canManageProducts(authUser.role)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Product/inventory management privileges required." },
        { status: 403 }
      );
    }

    const { productId, newStock, reason } = await req.json();

    if (typeof newStock !== "number" || newStock < 0) {
      return NextResponse.json(
        { success: false, message: "Valid stock quantity required (0 or greater)" },
        { status: 400 }
      );
    }

    const updatedBy = `${authUser.name} (${authUser.role})`;

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, message: "Database connection unavailable" },
        { status: 503 }
      );
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    const prev = product.stock;
    const change = newStock - prev;
    product.stock = newStock;
    await product.save();

    const logEntry = await InventoryLog.create({
      productId: String(product._id),
      productName: product.name,
      previousStock: prev,
      changeAmount: change,
      newStock: newStock,
      reason: reason || "Manual Adjustment",
      updatedBy,
    });

    revalidateStoreCatalog();

    return NextResponse.json({
      success: true,
      product,
      log: logEntry,
      message: `Stock for ${product.name} updated to ${newStock} units`,
    });
  } catch (error) {
    console.error("Inventory stock adjustment error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update stock" },
      { status: 500 }
    );
  }
}
