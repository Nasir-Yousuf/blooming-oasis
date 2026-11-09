import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { InventoryLog } from "@/models/InventoryLog";
import { getUserFromRequest } from "@/lib/auth";
import { INITIAL_PRODUCTS } from "@/data/initialProducts";

export async function GET() {
  try {
    const db = await connectToDatabase();

    if (db) {
      const products = await Product.find()
        .select("name slug sku stock price category images")
        .sort({ stock: 1 })
        .lean();

      const recentLogs = await InventoryLog.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();

      return NextResponse.json({
        success: true,
        inventory: products,
        logs: recentLogs,
      });
    }

    return NextResponse.json({
      success: true,
      inventory: INITIAL_PRODUCTS.map((p, i) => ({
        _id: `prod-${i}`,
        name: p.name,
        slug: p.slug,
        sku: `BO-${1000 + i}`,
        stock: p.stock,
        price: p.price,
        category: p.category,
        images: p.images,
      })),
      logs: [
        {
          _id: "log-1",
          productName: "Monstera Deliciosa",
          previousStock: 30,
          changeAmount: -2,
          newStock: 28,
          reason: "Order Placement",
          updatedBy: "Order #BO-849201",
          createdAt: new Date().toISOString(),
        },
      ],
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
    const { productId, newStock, reason } = await req.json();

    if (typeof newStock !== "number" || newStock < 0) {
      return NextResponse.json(
        { success: false, message: "Valid stock quantity required" },
        { status: 400 }
      );
    }

    const authUser = getUserFromRequest(req);
    const updatedBy = authUser ? authUser.name : "Admin Inventory Manager";

    const db = await connectToDatabase();
    if (db) {
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

      await InventoryLog.create({
        productId: String(product._id),
        productName: product.name,
        previousStock: prev,
        changeAmount: change,
        newStock: newStock,
        reason: reason || "Manual Adjustment",
        updatedBy,
      });

      return NextResponse.json({
        success: true,
        product,
        message: `Inventory for ${product.name} updated to ${newStock} units.`,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Inventory updated to ${newStock} units (Demo).`,
    });
  } catch (error) {
    console.error("Inventory update error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update inventory" },
      { status: 500 }
    );
  }
}

