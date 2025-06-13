import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../config/db.js";

// Verify Admin Token
export const verifyAdminToken = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.headers?.authorization?.replace("Bearer ", "") ||
      req.query?.accessToken;

    if (!token) {
      throw new ApiError(401, "Authentication required - Admin access only");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_JWT_SECRET);

    if (decoded.role !== "ADMIN") {
      throw new ApiError(403, "Access denied - Admin privileges required");
    }

    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!admin) {
      throw new ApiError(401, "Invalid token or admin not found");
    }

    req.user = { ...admin, role: "ADMIN" };
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      throw new ApiError(401, "Invalid admin token");
    } else if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Admin token expired");
    }
    throw new ApiError(500, "Admin authentication error");
  }
});

// Legacy middleware for backward compatibility
export const verifyAdmin = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    throw new ApiError(
      403,
      "Forbidden - You do not have access to this resource"
    );
  }
  next();
});
