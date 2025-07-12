import bcrypt from "bcrypt";
import { prisma } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponsive } from "../utils/ApiResponsive.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validatePassword } from "../utils/validatePassword.js";
import { generateAdminTokens } from "../helper/generateAdminTokens.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// Create Admin Account
export const createAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email, and password are required");
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Please provide a valid email");
  }

  // Validate password strength
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    throw new ApiError(400, passwordValidation.message);
  }

  // Check if admin already exists
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingAdmin) {
    throw new ApiError(409, "Admin with this email already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create admin
  const admin = await prisma.admin.create({
    data: {
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  res
    .status(201)
    .json(new ApiResponsive(201, admin, "Admin account created successfully"));
});

// Admin Login
export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  // Find admin
  const admin = await prisma.admin.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!admin) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, admin.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Generate tokens
  const { accessToken, refreshToken } = await generateAdminTokens(admin.id);

  // Remove password from response
  const { password: _, ...adminData } = admin;

  // Set cookies
  res.cookie("accessToken", accessToken, COOKIE_OPTIONS);
  res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

  res.status(200).json(
    new ApiResponsive(
      200,
      {
        admin: adminData,
        accessToken,
        refreshToken,
      },
      "Admin logged in successfully"
    )
  );
});

// Admin Logout
export const logoutAdmin = asyncHandler(async (req, res) => {
  // Clear cookies
  res.clearCookie("accessToken", COOKIE_OPTIONS);
  res.clearCookie("refreshToken", COOKIE_OPTIONS);

  res
    .status(200)
    .json(new ApiResponsive(200, null, "Admin logged out successfully"));
});

// Get Current Admin Profile
export const getCurrentAdmin = asyncHandler(async (req, res) => {
  const admin = await prisma.admin.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  res
    .status(200)
    .json(
      new ApiResponsive(200, admin, "Admin profile retrieved successfully")
    );
});

// Update Admin Profile
export const updateAdminProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  const adminId = req.user.id;

  // Validate at least one field is provided
  if (!name && !email) {
    throw new ApiError(400, "At least one field (name or email) is required");
  }

  const updateData = {};

  if (name) {
    updateData.name = name.trim();
  }

  if (email) {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ApiError(400, "Please provide a valid email");
    }

    // Check if email is already taken by another admin
    const existingAdmin = await prisma.admin.findFirst({
      where: {
        email: email.toLowerCase(),
        NOT: { id: adminId },
      },
    });

    if (existingAdmin) {
      throw new ApiError(409, "Email is already taken by another admin");
    }

    updateData.email = email.toLowerCase();
  }

  // Update admin
  const updatedAdmin = await prisma.admin.update({
    where: { id: adminId },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res
    .status(200)
    .json(
      new ApiResponsive(200, updatedAdmin, "Admin profile updated successfully")
    );
});

// Change Admin Password
export const changeAdminPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const adminId = req.user.id;

  // Validate required fields
  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Current password and new password are required");
  }

  // Validate new password strength
  const passwordValidation = validatePassword(newPassword);
  if (!passwordValidation.isValid) {
    throw new ApiError(400, passwordValidation.message);
  }

  // Get admin with password
  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
  });

  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  // Verify current password
  const isCurrentPasswordValid = await bcrypt.compare(
    currentPassword,
    admin.password
  );
  if (!isCurrentPasswordValid) {
    throw new ApiError(400, "Current password is incorrect");
  }

  // Check if new password is different from current
  const isSamePassword = await bcrypt.compare(newPassword, admin.password);
  if (isSamePassword) {
    throw new ApiError(
      400,
      "New password must be different from current password"
    );
  }

  // Hash new password
  const hashedNewPassword = await bcrypt.hash(newPassword, 12);

  // Update password
  await prisma.admin.update({
    where: { id: adminId },
    data: { password: hashedNewPassword },
  });

  res
    .status(200)
    .json(new ApiResponsive(200, null, "Password changed successfully"));
});

// Get All Admins (Super Admin functionality)
export const getAllAdmins = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const whereClause = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};

  const [admins, total] = await Promise.all([
    prisma.admin.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: "desc" },
    }),
    prisma.admin.count({ where: whereClause }),
  ]);

  res.status(200).json(
    new ApiResponsive(
      200,
      {
        admins,
        pagination: {
          total,
          pages: Math.ceil(total / parseInt(limit)),
          currentPage: parseInt(page),
          limit: parseInt(limit),
        },
      },
      "Admins retrieved successfully"
    )
  );
});

// Delete Admin Account
export const deleteAdmin = asyncHandler(async (req, res) => {
  const { adminId } = req.params;
  const currentAdminId = req.user.id;

  // Prevent self-deletion
  if (adminId === currentAdminId) {
    throw new ApiError(400, "You cannot delete your own account");
  }

  // Check if admin exists
  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
  });

  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  // Delete admin
  await prisma.admin.delete({
    where: { id: adminId },
  });

  res
    .status(200)
    .json(new ApiResponsive(200, null, "Admin account deleted successfully"));
});
