import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function createDemoAdmin() {
  try {
    console.log("Creating demo admin account...");

    const email = "admin@prohousing.com";
    const password = "AdminPass123!";
    const name = "Demo Admin";

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      console.log("Demo admin already exists!");
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin
    const admin = await prisma.admin.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    console.log("✅ Demo admin created successfully!");
    console.log("📧 Login Credentials:");
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log("🌐 Login URL: http://localhost:3000/admin/login");
    console.log("\nAdmin Details:", admin);
  } catch (error) {
    console.error("❌ Error creating demo admin:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createDemoAdmin();
