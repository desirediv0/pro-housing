// Client-side image compression utility
export const compressImage = (file, options = {}) => {
  return new Promise((resolve, reject) => {
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 0.8,
      maxSizeMB = 5,
      onProgress,
    } = options;

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      resolve(file); // Return original file if not an image
      return;
    }

    // Check if file is already small enough
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB <= maxSizeMB) {
      resolve(file); // Return original file if already small enough
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and compress image
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to blob with specified quality
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to compress image"));
            return;
          }

          // Check if compressed size is still too large
          const compressedSizeMB = blob.size / (1024 * 1024);

          if (compressedSizeMB > maxSizeMB) {
            // If still too large, compress further with lower quality
            const reducedQuality = Math.max(
              0.1,
              quality * (maxSizeMB / compressedSizeMB)
            );

            if (onProgress) {
              onProgress("Compressing further...", 75);
            }

            canvas.toBlob(
              (finalBlob) => {
                if (!finalBlob) {
                  reject(new Error("Failed to compress image"));
                  return;
                }

                // Create new file with compressed blob
                const compressedFile = new File([finalBlob], file.name, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                });

                if (onProgress) {
                  onProgress("Compression complete", 100);
                }

                resolve(compressedFile);
              },
              "image/jpeg",
              reducedQuality
            );
          } else {
            // Create new file with compressed blob
            const compressedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });

            if (onProgress) {
              onProgress("Compression complete", 100);
            }

            resolve(compressedFile);
          }
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    // Load image from file
    const reader = new FileReader();
    reader.onload = (e) => {
      if (onProgress) {
        onProgress("Loading image...", 25);
      }
      img.src = e.target.result;
    };
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
    reader.readAsDataURL(file);
  });
};

// Compress multiple images with progress tracking
export const compressImages = async (files, options = {}) => {
  const compressedFiles = [];
  const totalFiles = files.filter((file) =>
    file.type.startsWith("image/")
  ).length;
  let processedFiles = 0;

  for (const file of files) {
    try {
      if (file.type.startsWith("image/")) {
        const progressCallback = options.onProgress
          ? (message, progress) => {
              const overallProgress =
                (processedFiles * 100 + progress) / totalFiles;
              options.onProgress(
                `Processing ${file.name}: ${message}`,
                overallProgress
              );
            }
          : undefined;

        const compressedFile = await compressImage(file, {
          ...options,
          onProgress: progressCallback,
        });
        compressedFiles.push(compressedFile);
        processedFiles++;
      } else {
        // Keep non-image files as is
        compressedFiles.push(file);
      }
    } catch (error) {
      console.error("Error compressing file:", file.name, error);
      // If compression fails, keep original file
      compressedFiles.push(file);
      processedFiles++;
    }
  }

  return compressedFiles;
};

// Get file size in MB
export const getFileSizeMB = (file) => {
  return file.size / (1024 * 1024);
};

// Format file size for display
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Calculate compression ratio
export const getCompressionRatio = (originalSize, compressedSize) => {
  if (originalSize === 0) return 0;
  return (((originalSize - compressedSize) / originalSize) * 100).toFixed(1);
};

// Check if file needs compression
export const needsCompression = (file, maxSizeMB = 5) => {
  if (!file.type.startsWith("image/")) return false;
  return getFileSizeMB(file) > maxSizeMB;
};
