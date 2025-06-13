import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3client from "./s3client.js";

export const deleteFromS3 = async (fileUrl) => {
  try {
    if (!fileUrl) {
      console.log("No file URL provided for deletion");
      return; // No file URL to delete
    }

    let Key;

    // Check if fileUrl is a full URL
    if (fileUrl.startsWith("http")) {
      const parsedUrl = new URL(fileUrl);
      // Handle both DigitalOcean Spaces and other S3-compatible URLs
      Key = parsedUrl.pathname.slice(1); // Remove leading slash
    } else {
      // If it's already just a key
      Key = fileUrl.startsWith("/") ? fileUrl.slice(1) : fileUrl;
    }

    if (!Key) {
      console.log("Invalid file key for deletion");
      return;
    }

    console.log(`Attempting to delete file from S3: ${Key}`);

    await s3client.send(
      new DeleteObjectCommand({
        Bucket: process.env.SPACES_BUCKET,
        Key,
      })
    );

    console.log(`Successfully deleted file: ${Key}`);
    return { success: true, deletedFile: Key };
  } catch (error) {
    console.error("S3 deletion error:", error);
    console.error("Failed to delete file:", fileUrl);
    // Don't throw error to prevent blocking the main operation
    return { success: false, error: error.message };
  }
};

export const deleteMultipleFromS3 = async (fileUrls) => {
  if (!fileUrls || !Array.isArray(fileUrls) || fileUrls.length === 0) {
    return { success: true, deletedFiles: [] };
  }

  try {
    const deletePromises = fileUrls.map((url) => deleteFromS3(url));
    const results = await Promise.allSettled(deletePromises);

    const deletedFiles = [];
    const failedFiles = [];

    results.forEach((result, index) => {
      if (result.status === "fulfilled" && result.value?.success) {
        deletedFiles.push(fileUrls[index]);
      } else {
        failedFiles.push(fileUrls[index]);
      }
    });

    console.log(
      `Deleted ${deletedFiles.length} files, ${failedFiles.length} failed`
    );

    return {
      success: true,
      deletedFiles,
      failedFiles,
      totalDeleted: deletedFiles.length,
      totalFailed: failedFiles.length,
    };
  } catch (error) {
    console.error("Multiple S3 deletion error:", error);
    return { success: false, error: error.message };
  }
};

export const getFileUrl = (filename) => {
  if (!filename) return null;

  // If it's already a full URL, return as is
  if (filename.startsWith("http")) {
    return filename;
  }

  // Otherwise, construct the full URL
  const cleanFilename = filename.startsWith("/") ? filename.slice(1) : filename;
  return `https://${process.env.SPACES_BUCKET}.${process.env.SPACES_REGION}.digitaloceanspaces.com/${cleanFilename}`;
};
