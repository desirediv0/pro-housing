import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3client from "./s3client.js";
import { nanoid } from "nanoid";
import sharp from "sharp";

// Upload file to S3
export const uploadToS3 = async (file, folder = "uploads") => {
  try {
    const fileExtension = file.originalname.split(".").pop();
    const fileName = `${folder}/${nanoid()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.SPACES_BUCKET,
      Key: fileName,
      Body: file.buffer,
      ACL: "public-read",
      ContentType: file.mimetype,
    });

    await s3client.send(command);

    // Use custom CDN URL for better performance
    const fileUrl = `https://desirediv-storage.blr1.cdn.digitaloceanspaces.com/${fileName}`;

    return {
      success: true,
      url: fileUrl,
      fileName: fileName,
    };
  } catch (error) {
    console.error("S3 upload error:", error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
};

// Upload and compress image to S3
export const uploadImageToS3 = async (
  file,
  folder = "images",
  quality = 80,
  maxWidth = 1920
) => {
  try {
    // Compress image using sharp
    const compressedBuffer = await sharp(file.buffer)
      .resize(maxWidth, null, {
        withoutEnlargement: true,
        fit: "inside",
      })
      .jpeg({ quality })
      .toBuffer();

    const fileName = `${folder}/${nanoid()}.jpg`;

    const command = new PutObjectCommand({
      Bucket: process.env.SPACES_BUCKET,
      Key: fileName,
      Body: compressedBuffer,
      ACL: "public-read",
      ContentType: "image/jpeg",
    });

    await s3client.send(command);

    // Use custom CDN URL for better performance
    const fileUrl = `https://desirediv-storage.blr1.cdn.digitaloceanspaces.com/${fileName}`;

    return {
      success: true,
      url: fileUrl,
      fileName: fileName,
    };
  } catch (error) {
    console.error("S3 image upload error:", error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

// Upload multiple files to S3
export const uploadMultipleToS3 = async (files, folder = "uploads") => {
  try {
    const uploadPromises = files.map((file) => uploadToS3(file, folder));
    const results = await Promise.all(uploadPromises);

    return {
      success: true,
      files: results,
    };
  } catch (error) {
    console.error("S3 multiple upload error:", error);
    throw new Error(`Failed to upload files: ${error.message}`);
  }
};

// Upload multiple images to S3
export const uploadMultipleImagesToS3 = async (
  files,
  folder = "images",
  quality = 80,
  maxWidth = 1920
) => {
  try {
    const uploadPromises = files.map((file) =>
      uploadImageToS3(file, folder, quality, maxWidth)
    );
    const results = await Promise.all(uploadPromises);

    return {
      success: true,
      files: results,
    };
  } catch (error) {
    console.error("S3 multiple image upload error:", error);
    throw new Error(`Failed to upload images: ${error.message}`);
  }
};
