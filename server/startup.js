#!/usr/bin/env node

import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

console.log("🚀 Pro Housing Server Setup & Startup Script");
console.log("============================================\n");

async function setupAndStart() {
  try {
    // Check if .env exists
    console.log("1. Checking environment configuration...");
    try {
      const { readFileSync } = await import("fs");
      readFileSync(".env");
      console.log("✅ .env file found");
    } catch (error) {
      console.log(
        "⚠️  .env file not found. Please copy .env.example to .env and configure it."
      );
      return;
    }

    // Generate Prisma client
    console.log("\n2. Generating Prisma client...");
    await execAsync("npm run generate");
    console.log("✅ Prisma client generated");

    // Check database connection
    console.log("\n3. Checking database connection...");
    try {
      const { prisma } = await import("./config/db.js");
      await prisma.$connect();
      console.log("✅ Database connection successful");
      await prisma.$disconnect();
    } catch (error) {
      console.log("❌ Database connection failed:", error.message);
      console.log("Please check your DATABASE_URL in .env file");
      return;
    }

    // Setup upload folders
    console.log("\n4. Setting up upload folder structure...");
    try {
      const { setupUploadFolders, cleanupTempFiles } = await import(
        "./utils/setup-uploads.js"
      );
      setupUploadFolders();
      cleanupTempFiles();
      console.log("✅ Upload folders configured");
    } catch (error) {
      console.log("⚠️  Upload folder setup failed:", error.message);
    }

    // Start the server
    console.log("\n5. Starting Pro Housing Server...");
    console.log("📍 Server will be available at: http://localhost:4001");
    console.log("📍 API endpoints: http://localhost:4001/api");
    console.log("📍 Upload endpoint: http://localhost:4001/api/upload");
    console.log("📍 Health check: http://localhost:4001/api/health");
    console.log("📁 Upload folder: ./uploads");
    console.log("\n💡 Use the Postman collection for easy API testing");
    console.log("💡 Check README.md for detailed API documentation\n");

    // Import and start the app
    const app = await import("./app.js");
    const port = process.env.PORT || 5000;

    app.default.listen(port, () => {
      console.log(`🎉 Pro Housing Server is running on port ${port}`);
      console.log(`🔗 Visit: http://localhost:${port}`);
    });
  } catch (error) {
    console.error("❌ Setup failed:", error.message);
    process.exit(1);
  }
}

setupAndStart();
