const { MongoMemoryServer } = require("mongodb-memory-server");
const path = require("path");
const fs = require("fs");

const dbPath = path.resolve(__dirname, "../.mongo-data");
if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath, { recursive: true });
}

async function start() {
  try {
    const mongod = await MongoMemoryServer.create({
      instance: {
        port: 27017,
        dbPath: dbPath,
        storageEngine: "wiredTiger",
      },
    });
    console.log("MongoDB Daemon is running at:", mongod.getUri());
  } catch (err) {
    console.error("Failed to start MongoDB daemon:", err);
  }
}

start();

