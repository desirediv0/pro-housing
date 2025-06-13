import fs from "fs";
import path from "path";

const UPLOAD_FOLDER = process.env.UPLOAD_FOLDER || "uploads";

/**
 * Create upload directory structure
 */
export const setupUploadFolders = () => {
  console.log("🚀 Setting up upload folder structure...");

  const uploadStructure = [
    // Main upload folder
    UPLOAD_FOLDER,

    // Property folders
    path.join(UPLOAD_FOLDER, "properties"),
    path.join(UPLOAD_FOLDER, "properties", "images"),
    path.join(UPLOAD_FOLDER, "properties", "documents"),
    path.join(UPLOAD_FOLDER, "properties", "thumbnails"),

    // Sidebar content folders
    path.join(UPLOAD_FOLDER, "sidebar"),
    path.join(UPLOAD_FOLDER, "sidebar", "images"),
    path.join(UPLOAD_FOLDER, "sidebar", "banners"),

    // Profile folders
    path.join(UPLOAD_FOLDER, "profiles"),
    path.join(UPLOAD_FOLDER, "profiles", "admin"),
    path.join(UPLOAD_FOLDER, "profiles", "users"),

    // Temporary folder
    path.join(UPLOAD_FOLDER, "temp"),

    // Backup folder
    path.join(UPLOAD_FOLDER, "backup"),

    // Archive folder
    path.join(UPLOAD_FOLDER, "archive"),
  ];

  uploadStructure.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`✅ Created directory: ${dir}`);
      } catch (error) {
        console.error(`❌ Failed to create directory ${dir}:`, error.message);
      }
    } else {
      console.log(`📁 Directory already exists: ${dir}`);
    }
  });

  // Create .gitkeep files to ensure empty directories are tracked
  const gitkeepDirs = [
    path.join(UPLOAD_FOLDER, "temp"),
    path.join(UPLOAD_FOLDER, "backup"),
    path.join(UPLOAD_FOLDER, "archive"),
  ];

  gitkeepDirs.forEach((dir) => {
    const gitkeepPath = path.join(dir, ".gitkeep");
    if (!fs.existsSync(gitkeepPath)) {
      try {
        fs.writeFileSync(gitkeepPath, "");
        console.log(`📝 Created .gitkeep: ${gitkeepPath}`);
      } catch (error) {
        console.error(
          `❌ Failed to create .gitkeep ${gitkeepPath}:`,
          error.message
        );
      }
    }
  });

  console.log("✅ Upload folder structure setup complete!");
  console.log(`📂 Upload root: ${path.resolve(UPLOAD_FOLDER)}`);
};

/**
 * Clean up old temporary files
 */
export const cleanupTempFiles = () => {
  const tempDir = path.join(UPLOAD_FOLDER, "temp");

  if (!fs.existsSync(tempDir)) return;

  try {
    const files = fs.readdirSync(tempDir);
    const oneHourAgo = Date.now() - 60 * 60 * 1000; // 1 hour

    files.forEach((file) => {
      if (file === ".gitkeep") return;

      const filePath = path.join(tempDir, file);
      const stats = fs.statSync(filePath);

      if (stats.mtime.getTime() < oneHourAgo) {
        fs.unlinkSync(filePath);
        console.log(`🗑️ Cleaned up old temp file: ${file}`);
      }
    });
  } catch (error) {
    console.error("❌ Error cleaning temp files:", error.message);
  }
};

/**
 * Get upload folder stats
 */
export const getUploadStats = () => {
  const stats = {
    totalSize: 0,
    fileCount: 0,
    folderCount: 0,
    lastActivity: null,
  };

  const scanDirectory = (dir) => {
    if (!fs.existsSync(dir)) return;

    try {
      const items = fs.readdirSync(dir);

      items.forEach((item) => {
        const itemPath = path.join(dir, item);
        const itemStats = fs.statSync(itemPath);

        if (itemStats.isDirectory()) {
          stats.folderCount++;
          scanDirectory(itemPath); // Recursive scan
        } else {
          stats.fileCount++;
          stats.totalSize += itemStats.size;

          if (!stats.lastActivity || itemStats.mtime > stats.lastActivity) {
            stats.lastActivity = itemStats.mtime;
          }
        }
      });
    } catch (error) {
      console.error(`Error scanning directory ${dir}:`, error.message);
    }
  };

  scanDirectory(UPLOAD_FOLDER);

  return {
    ...stats,
    totalSizeFormatted: formatBytes(stats.totalSize),
    uploadFolder: UPLOAD_FOLDER,
  };
};

/**
 * Format bytes to human readable format
 */
const formatBytes = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export default {
  setupUploadFolders,
  cleanupTempFiles,
  getUploadStats,
};
