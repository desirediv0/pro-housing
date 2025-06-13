import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";

export const generateAdminTokens = async (adminId) => {
    try {
        const admin = await prisma.admin.findUnique({
            where: { id: adminId },
            select: { id: true, name: true, email: true },
        });

        if (!admin) {
            throw new ApiError(404, "Admin not found");
        }

        const accessToken = generateAdminAccessToken(admin);
        const refreshToken = generateAdminRefreshToken(admin.id);

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, error.message || "Error generating admin tokens");
    }
};

const generateAdminAccessToken = (admin) => {
    return jwt.sign(
        {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: "ADMIN",
        },
        process.env.ACCESS_JWT_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_LIFE || "1h" }
    );
};

const generateAdminRefreshToken = (adminId) => {
    return jwt.sign({ id: adminId, role: "ADMIN" }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_LIFE || "7d",
    });
};
