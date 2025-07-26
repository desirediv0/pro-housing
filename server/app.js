import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import Razorpay from "razorpay";

// Import routes
import adminRoutes from "./routes/admin.routes.js";
import propertyRoutes from "./routes/property.routes.js";
import inquiryRoutes from "./routes/inquiry.routes.js";
import expertiseRoutes from "./routes/expertise.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import sidebarRoutes from "./routes/sidebar.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import reviewRoutes from "./routes/review.routes.js";

// Import upload configuration
import { createUploadDirs, UPLOAD_FOLDER } from "./config/upload.js";

const app = express();

// Initialize upload directories
createUploadDirs();

// Serve static files from uploads folder
app.use("/uploads", express.static(UPLOAD_FOLDER));

// Security & Parse Middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));
app.use(cookieParser());

// CORS Configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(",")
      : [
          "http://localhost:3000",
          "https://prohousing.in",
          "https://www.prohousing.in",
        ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Pragma",
      "Origin",
      "Accept",
    ],
    exposedHeaders: ["Set-Cookie"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// Cache Control Headers
app.use((req, res, next) => {
  res.header("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.header("Pragma", "no-cache");
  res.header("Expires", "0");
  res.header("X-Content-Type-Options", "nosniff");
  res.header("X-Frame-Options", "DENY");
  res.header("X-XSS-Protection", "1; mode=block");
  res.header(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );
  next();
});

// Initialize Razorpay
let razorpay;
try {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  console.log("Razorpay Initialized Successfully:");
} catch (error) {
  console.error("Razorpay Initialization Error:", error);
}

export { razorpay };

// API Routes
app.use("/api/admin", adminRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/expertise", expertiseRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/sidebar", sidebarRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/reviews", reviewRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Pro Housing Server is running!",
    timestamp: new Date().toISOString(),
  });
});

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Pro Housing API",
    version: "1.0.0",
    endpoints: {
      admin: "/api/admin",
      properties: "/api/properties",
      inquiries: "/api/inquiries",
      analytics: "/api/analytics",
      sidebar: "/api/sidebar",
      upload: "/api/upload",
      health: "/api/health",
    },
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;
