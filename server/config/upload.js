import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

// Get upload folder from environment or use default
const UPLOAD_FOLDER = process.env.UPLOAD_FOLDER || "prohousing";
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024; // 10MB
const ALLOWED_EXTENSIONS = (
  process.env.ALLOWED_FILE_TYPES || "jpg,jpeg,png,gif,webp,pdf,doc,docx"
).split(",");

// Create upload directories if they don't exist
const createUploadDirs = () => {
  const dirs = [
    UPLOAD_FOLDER,
    path.join(UPLOAD_FOLDER, "properties"),
    path.join(UPLOAD_FOLDER, "properties", "images"),
    path.join(UPLOAD_FOLDER, "properties", "documents"),
    path.join(UPLOAD_FOLDER, "sidebar"),
    path.join(UPLOAD_FOLDER, "sidebar", "images"),
    path.join(UPLOAD_FOLDER, "profiles"),
    path.join(UPLOAD_FOLDER, "temp"),
  ];

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  });
};

// Generate unique filename
const generateFileName = (originalname) => {
  const timestamp = Date.now();
  const random = crypto.randomBytes(6).toString("hex");
  const ext = path.extname(originalname).toLowerCase();
  const name = path
    .basename(originalname, ext)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-");
  return `${name}-${timestamp}-${random}${ext}`;
};

// Storage configuration for properties
const propertyStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath =
      file.fieldname === "documents"
        ? path.join(UPLOAD_FOLDER, "properties", "documents")
        : path.join(UPLOAD_FOLDER, "properties", "images");

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const fileName = generateFileName(file.originalname);
    cb(null, fileName);
  },
});

// Storage configuration for sidebar content
const sidebarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(UPLOAD_FOLDER, "sidebar", "images");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const fileName = generateFileName(file.originalname);
    cb(null, fileName);
  },
});

// Storage configuration for profiles
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(UPLOAD_FOLDER, "profiles");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const fileName = generateFileName(file.originalname);
    cb(null, fileName);
  },
});

// File filter function
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase().slice(1);

  if (ALLOWED_EXTENSIONS.includes(ext)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `File type .${ext} is not allowed. Allowed types: ${ALLOWED_EXTENSIONS.join(
          ", "
        )}`
      ),
      false
    );
  }
};

// Multer configurations
const propertyUpload = multer({
  storage: propertyStorage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 20, // Max 20 files per property
  },
  fileFilter,
});

const sidebarUpload = multer({
  storage: sidebarStorage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 5, // Max 5 files for sidebar
  },
  fileFilter,
});

const profileUpload = multer({
  storage: profileStorage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1, // Max 1 profile image
  },
  fileFilter,
});

// Helper function to get file URL
const getFileUrl = (filePath, req) => {
  if (!filePath) return null;

  // Return full URL for accessing uploaded files
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  return `${baseUrl}/${filePath.replace(/\\/g, "/")}`;
};

// Helper function to delete file
const deleteFile = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`🗑️ Deleted file: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
};

// Helper function to move file from temp to permanent location
const moveFile = (tempPath, destinationPath) => {
  try {
    const destinationDir = path.dirname(destinationPath);
    if (!fs.existsSync(destinationDir)) {
      fs.mkdirSync(destinationDir, { recursive: true });
    }

    fs.renameSync(tempPath, destinationPath);
    console.log(`📁 Moved file: ${tempPath} → ${destinationPath}`);
    return true;
  } catch (error) {
    console.error("Error moving file:", error);
    return false;
  }
};

// Initialize upload directories on startup
createUploadDirs();

export {
  UPLOAD_FOLDER,
  MAX_FILE_SIZE,
  ALLOWED_EXTENSIONS,
  propertyUpload,
  sidebarUpload,
  profileUpload,
  getFileUrl,
  deleteFile,
  moveFile,
  generateFileName,
  createUploadDirs,
};
