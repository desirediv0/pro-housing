#!/usr/bin/env node

import { writeFileSync, existsSync } from "fs";
import { randomBytes } from "crypto";

console.log("🔧 Pro Housing Environment Setup");
console.log("================================\n");

// Generate random JWT secrets
const generateSecret = () => randomBytes(64).toString("hex");

const envContent = `# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/prohousing?schema=public"

# JWT Secrets (Auto-generated)
ACCESS_JWT_SECRET="${generateSecret()}"
REFRESH_TOKEN_SECRET="${generateSecret()}"

# JWT Token Life
ACCESS_TOKEN_LIFE="1h"
REFRESH_TOKEN_LIFE="7d"

# Server Configuration
PORT=4001
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN="http://localhost:3000,http://localhost:3001"

# File Upload Configuration
UPLOAD_FOLDER="prohousing"
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES="jpg,jpeg,png,gif,webp,pdf,doc,docx"

# DigitalOcean Spaces (S3) Configuration
SPACES_ENDPOINT="https://nyc3.digitaloceanspaces.com"
SPACES_REGION="nyc3"
SPACES_ACCESS_KEY="your-spaces-access-key"
SPACES_SECRET_KEY="your-spaces-secret-key"
SPACES_BUCKET="your-bucket-name"

# Email Configuration (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
FROM_EMAIL="your-email@gmail.com"

# Razorpay Configuration
RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-razorpay-key-secret"

# SEO Configuration
GOOGLE_VERIFICATION="your-google-verification-code"
YANDEX_VERIFICATION="your-yandex-verification-code"
YAHOO_VERIFICATION="your-yahoo-verification-code"
`;

try {
  if (existsSync(".env")) {
    console.log("⚠️  .env file already exists!");
    console.log(
      "Please backup your current .env file and run this script again."
    );
    process.exit(1);
  }

  writeFileSync(".env", envContent);
  console.log("✅ .env file created successfully!");
  console.log("\n📝 Next steps:");
  console.log("1. Update DATABASE_URL with your PostgreSQL connection string");
  console.log("2. Configure other services as needed (S3, SMTP, Razorpay)");
  console.log("3. Run 'npm run setup' to create demo admin and properties");
  console.log("4. Start the server with 'npm start'");

  console.log("\n🔑 Demo Admin Credentials (will be created by setup script):");
  console.log("   Email: admin@prohousing.com");
  console.log("   Password: AdminPass123!");
} catch (error) {
  console.error("❌ Error creating .env file:", error.message);
  process.exit(1);
}
