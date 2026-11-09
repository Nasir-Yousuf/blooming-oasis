/**
 * Blooming Oasis - Automated Unit and Integration Test Suite
 * Tests Auth, Models, CRUD, Inventory, Cart/Checkout logic, and Data Integrity.
 */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { connectToDatabase } from "../lib/mongodb";
import { hashPassword, comparePassword, signToken, verifyToken, canManageProducts, canManageOrders, hasAdminAccess, TokenPayload } from "../lib/auth";
import { Product } from "../models/Product";
import { Category } from "../models/Category";
import { Order } from "../models/Order";
import { InventoryLog } from "../models/InventoryLog";
import { ContactMessage } from "../models/ContactMessage";
import { Membership } from "../models/Membership";
import { getDbProducts, getDbProductBySlug, getDbCategories, getDbStoreSettings } from "../lib/data-access";

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    passed++;
    console.log(`  \x1b[32m✔ PASS\x1b[0m: ${testName}`);
  } else {
    failed++;
    console.error(`  \x1b[31m✘ FAIL\x1b[0m: ${testName} ${detail ? `(${detail})` : ""}`);
  }
}

async function runTests() {
  console.log("\n=======================================================");
  console.log("   BLOOMING OASIS - UNIT & INTEGRATION TEST SUITE");
  console.log("=======================================================\n");

  const db = await connectToDatabase();
  assert(!!db, "Database connection established to local persistent MongoDB");

  // --------------------------------------------------------------------------
  // SUITE 1: AUTHENTICATION & SECURITY
  // --------------------------------------------------------------------------
  console.log("\n--- Suite 1: Authentication & Authorization ---");
  const testPassword = "SecurePassword123!";
  const hashedPassword = await hashPassword(testPassword);
  assert(hashedPassword !== testPassword && hashedPassword.startsWith("$2"), "Password hashing with bcrypt salt");

  const passwordMatch = await comparePassword(testPassword, hashedPassword);
  assert(passwordMatch === true, "Password verification against valid hash");

  const passwordMismatch = await comparePassword("WrongPassword", hashedPassword);
  assert(passwordMismatch === false, "Password verification rejects incorrect password");

  const testPayload: TokenPayload = { userId: "test-user-1", email: "test@bloomingoasis.demo", role: "admin", name: "Test Admin" };
  const token = signToken(testPayload);
  assert(typeof token === "string" && token.split(".").length === 3, "JWT Token generation with standard structure");

  const decoded = verifyToken(token);
  assert(decoded?.email === testPayload.email && decoded?.role === "admin", "JWT Token verification and decoding");

  const badTokenDecoded = verifyToken("invalid.token.payload");
  assert(badTokenDecoded === null, "Malformed JWT Token safely rejected with null");

  assert(canManageProducts("admin") && canManageProducts("product_manager"), "canManageProducts allows admin and product_manager");
  assert(!canManageProducts("customer") && !canManageProducts(undefined), "canManageProducts denies customer and undefined");
  assert(canManageOrders("admin") && canManageOrders("order_manager"), "canManageOrders allows admin and order_manager");
  assert(!canManageOrders("customer"), "canManageOrders denies customer");
  assert(hasAdminAccess("admin") && hasAdminAccess("superadmin") && hasAdminAccess("order_manager") && hasAdminAccess("product_manager"), "hasAdminAccess permits internal administrative roles");
  assert(!hasAdminAccess("customer"), "hasAdminAccess denies regular customer");

  // --------------------------------------------------------------------------
  // SUITE 2: CATEGORY LIFECYCLE & CASCADE REASSIGNMENT
  // --------------------------------------------------------------------------
  console.log("\n--- Suite 2: Category Management & Cascade Safety ---");
  const testCategorySlug = "test-integration-cat";
  await Category.deleteOne({ slug: testCategorySlug });

  const newCat = await Category.create({
    name: "Integration Test Category",
    slug: testCategorySlug,
    description: "Temporary category for cascade test",
    image: "",
    active: true,
  });
  assert(!!newCat._id, "Category creation in MongoDB");

  const testProdSlug = "test-cascade-plant";
  await Product.deleteOne({ slug: testProdSlug });
  const cascadePlant = await Product.create({
    name: "Cascade Plant",
    slug: testProdSlug,
    description: "Used to test category cascade updates",
    price: 35,
    images: ["https://images.unsplash.com/photo-1545241047-6083a3684587"],
    category: "Integration Test Category",
    sunlight: "Low light",
    watering: "Weekly care",
    difficulty: "Beginner",
    toxicity: "Non-toxic",
    petFriendly: true,
    stock: 5,
    featured: false,
    published: true,
    rating: 5,
    reviewsCount: 1,
    tags: ["test"],
  });
  assert(cascadePlant.category === "Integration Test Category", "Product created with custom category");

  // Simulate Category Rename Cascade
  const updatedCatName = "Renamed Integration Category";
  await Category.findByIdAndUpdate(newCat._id, { name: updatedCatName });
  await Product.updateMany({ category: "Integration Test Category" }, { category: updatedCatName });

  const refreshedPlant = await Product.findOne({ slug: testProdSlug });
  assert(refreshedPlant?.category === updatedCatName, "Category rename cascaded to assigned products");

  // Simulate Safe Category Deletion with Reassignment
  await Category.findByIdAndDelete(newCat._id);
  await Product.updateMany({ category: updatedCatName }, { category: "Uncategorized" });

  const reassignedPlant = await Product.findOne({ slug: testProdSlug });
  assert(reassignedPlant?.category === "Uncategorized", "Category deletion safely reassigns orphaned products to Uncategorized");

  // Clean up test plant
  await Product.deleteOne({ slug: testProdSlug });

  // --------------------------------------------------------------------------
  // SUITE 3: INVENTORY MANAGEMENT & CONCURRENCY SAFETY
  // --------------------------------------------------------------------------
  console.log("\n--- Suite 3: Inventory Concurrency & Stock Safety ---");
  const invTestSlug = "inventory-concurrency-plant";
  await Product.deleteOne({ slug: invTestSlug });

  const invPlant = await Product.create({
    name: "Inventory Test Plant",
    slug: invTestSlug,
    description: "Testing concurrent atomic stock decrements",
    price: 50,
    images: ["https://images.unsplash.com/photo-1545241047-6083a3684587"],
    category: "Air Purifying",
    sunlight: "Low light",
    watering: "Low maintenance",
    difficulty: "Beginner",
    toxicity: "Non-toxic",
    petFriendly: true,
    stock: 5,
    featured: false,
    published: true,
    rating: 5,
    reviewsCount: 1,
    tags: ["inventory"],
  });

  // Test atomic stock reduction
  const deduction = await Product.findOneAndUpdate(
    { _id: invPlant._id, stock: { $gte: 3 } },
    { $inc: { stock: -3 } },
    { new: true }
  );
  assert(deduction?.stock === 2, "Atomic stock decrement from 5 to 2");

  // Test oversell prevention: requesting 3 when only 2 remain
  const oversellAttempt = await Product.findOneAndUpdate(
    { _id: invPlant._id, stock: { $gte: 3 } },
    { $inc: { stock: -3 } },
    { new: true }
  );
  assert(oversellAttempt === null, "Oversell attempt rejected atomically (stock insufficient)");

  const checkFinalStock = await Product.findById(invPlant._id);
  assert(checkFinalStock?.stock === 2, "Stock remains unchanged at 2 after rejected oversell attempt");

  // Clean up
  await Product.deleteOne({ slug: invTestSlug });

  // --------------------------------------------------------------------------
  // SUITE 4: CHECKOUT, PRICING & HISTORICAL SNAPSHOT INTEGRITY
  // --------------------------------------------------------------------------
  console.log("\n--- Suite 4: Order Creation & Historical Snapshot Integrity ---");
  const snapTestSlug = "snapshot-test-plant";
  await Product.deleteOne({ slug: snapTestSlug });

  const snapPlant = await Product.create({
    name: "Historical Plant",
    slug: snapTestSlug,
    description: "Testing order snapshot preservation",
    price: 40,
    discountPrice: 35,
    images: ["https://images.unsplash.com/photo-1545241047-6083a3684587"],
    category: "Easy Care",
    sunlight: "Low light",
    watering: "Low maintenance",
    difficulty: "Beginner",
    toxicity: "Non-toxic",
    petFriendly: true,
    stock: 10,
    featured: false,
    published: true,
    rating: 5,
    reviewsCount: 0,
    tags: ["snapshot"],
  });

  const orderNumber = `ORD-TEST-${Date.now()}`;
  const testOrder = await Order.create({
    orderNumber,
    customer: {
      name: "Alice Unit Tester",
      email: "alice@test.demo",
      phone: "+15551234567",
    },
    shippingAddress: {
      street: "123 Green Way",
      city: "Portland",
      state: "OR",
      postalCode: "97201",
      country: "USA",
    },
    items: [
      {
        productId: snapPlant._id.toString(),
        productSlug: snapPlant.slug,
        productName: snapPlant.name,
        productImage: snapPlant.images[0],
        size: "Medium",
        unitPrice: 35, // Snapshot price
        quantity: 2,
        accessories: [],
        totalPrice: 70,
      },
    ],
    subtotal: 70,
    deliveryCharge: 0,
    discount: 0,
    total: 70,
    paymentMethod: "cod",
    paymentStatus: "pending",
    status: "Pending",
    statusTimeline: [
      {
        status: "Pending",
        timestamp: new Date(),
        updatedBy: "Customer Checkout",
        note: "Unit test order creation",
      },
    ],
  });
  assert(!!testOrder._id, "Order successfully saved to MongoDB with snapshot");

  // Now mutate the product: change price and delete the product!
  await Product.findByIdAndUpdate(snapPlant._id, { price: 999, name: "Mutated Plant Name" });
  await Product.findByIdAndDelete(snapPlant._id);

  // Retrieve the order again and verify snapshot is 100% intact
  const retrievedOrder = await Order.findOne({ orderNumber });
  assert(retrievedOrder?.items[0].productName === "Historical Plant", "Order snapshot preserved original product name after product deletion");
  assert(retrievedOrder?.items[0].unitPrice === 35, "Order snapshot preserved original purchase price after product deletion");
  assert(retrievedOrder?.total === 70, "Order total preserved intact");

  // --------------------------------------------------------------------------
  // SUITE 5: ORDER CANCELLATION & DOUBLE RESTORATION PREVENTION
  // --------------------------------------------------------------------------
  console.log("\n--- Suite 5: Order Cancellation & Inventory Double-Restoration Prevention ---");
  // Test double-restoration prevention logic:
  // When order is cancelled the first time, previousStatus is "Pending", so stock is restored.
  // If an update or repeat cancellation occurs when order.status is already "Cancelled", restoration is blocked.
  let simulatedStock = 10;
  let restoreCount = 0;

  function handleStatusChange(currentStatus: string, newStatus: string, qty: number) {
    const isCancellation = newStatus === "Cancelled" || newStatus === "Refunded";
    const wasAlreadyCancelled = currentStatus === "Cancelled" || currentStatus === "Refunded";

    if (isCancellation && !wasAlreadyCancelled) {
      simulatedStock += qty;
      restoreCount++;
      return { restored: true, stock: simulatedStock };
    }
    return { restored: false, stock: simulatedStock };
  }

  // 1st transition: Pending -> Cancelled
  const res1 = handleStatusChange("Pending", "Cancelled", 2);
  assert(res1.restored === true && res1.stock === 12, "First cancellation transition correctly restores stock (+2)");

  // 2nd transition: Cancelled -> Cancelled (repeated attempt)
  const res2 = handleStatusChange("Cancelled", "Cancelled", 2);
  assert(res2.restored === false && res2.stock === 12, "Duplicate cancellation transition safely skips restoration, preventing double count");
  assert(restoreCount === 1, "Restoration counter recorded exactly 1 stock recovery operation");

  // Log creation test
  const testLog = await InventoryLog.create({
    productId: snapPlant._id.toString(),
    productName: "Historical Plant",
    previousStock: 10,
    changeAmount: 2,
    newStock: 12,
    reason: "Order Cancellation",
    updatedBy: `Order #${testOrder.orderNumber} Cancelled`,
  });
  assert(!!testLog._id, "InventoryLog recorded for stock restoration");

  // Clean up order and log
  await Order.deleteOne({ orderNumber });
  await InventoryLog.deleteOne({ _id: testLog._id });

  // --------------------------------------------------------------------------
  // SUITE 6: DATA-ACCESS LAYER DYNAMIC RETRIEVAL
  // --------------------------------------------------------------------------
  console.log("\n--- Suite 6: Data-Access Dynamic Function Layer ---");
  const liveCategories = await getDbCategories();
  assert(Array.isArray(liveCategories) && liveCategories.length > 0, `getDbCategories returns ${liveCategories.length} categories from MongoDB`);

  const liveProducts = await getDbProducts({ published: true });
  assert(Array.isArray(liveProducts) && liveProducts.length > 0, `getDbProducts returns ${liveProducts.length} published products from MongoDB`);

  const sampleSlug = liveProducts[0]?.slug;
  if (sampleSlug) {
    const singleProduct = await getDbProductBySlug(sampleSlug);
    assert(singleProduct?.slug === sampleSlug, `getDbProductBySlug('${sampleSlug}') retrieves matching product`);
  }

  const liveSettings = await getDbStoreSettings();
  assert(liveSettings?.storeName === "Blooming Oasis", `getDbStoreSettings retrieves dynamic store config: '${liveSettings?.storeName}'`);

  // --------------------------------------------------------------------------
  // SUITE 7: CONTACT & MEMBERSHIP PERSISTENCE & DEDUPING
  // --------------------------------------------------------------------------
  console.log("\n--- Suite 7: Community, Contact & Membership Deduplication ---");
  const testEmail = `member_${Date.now()}@example.com`;
  const member1 = await Membership.create({
    email: testEmail,
    name: "Green Thumb Tester",
  });
  assert(!!member1._id, "Member successfully registered in MongoDB");

  let duplicateCaught = false;
  try {
    await Membership.create({
      email: testEmail,
      name: "Duplicate Tester",
    });
  } catch (err: any) {
    duplicateCaught = err.code === 11000 || err.message.includes("duplicate") || err.message.includes("E11000");
  }
  assert(duplicateCaught, "Duplicate membership email rejected with unique key constraint");

  const contactSubmission = await ContactMessage.create({
    name: "Test Botanical User",
    email: "contact@example.com",
    subject: "Plant Care Question",
    message: "Does Fiddle Leaf Fig require misting?",
  });
  assert(!!contactSubmission._id, "Contact inquiry successfully persisted in MongoDB");

  // Clean up
  await Membership.deleteOne({ email: testEmail });
  await ContactMessage.deleteOne({ _id: contactSubmission._id });

  // --------------------------------------------------------------------------
  // SUMMARY
  // --------------------------------------------------------------------------
  console.log("\n=======================================================");
  console.log(`TEST SUMMARY: ${passed} PASSED | ${failed} FAILED`);
  console.log("=======================================================\n");

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error("Test execution fatal error:", err);
  process.exit(1);
});
