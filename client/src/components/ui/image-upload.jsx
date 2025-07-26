"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { X, Upload, Video, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { compressImages, formatFileSize } from "@/utils/imageCompression";

const ImageUpload = ({
  onFilesChange,
  maxFiles = 10,
  acceptVideo = true,
  existingFiles = [],
  className = "",
  enableCompression = true,
  compressionOptions = {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.8,
    maxSizeMB: 5,
  },
}) => {
  const [files, setFiles] = useState(existingFiles);
  const [compressing, setCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [compressionMessage, setCompressionMessage] = useState("");

  const onDrop = useCallback(
    async (acceptedFiles) => {
      try {
        setCompressing(true);

        let processedFiles = acceptedFiles;

        // Compress images if enabled
        if (enableCompression) {
          processedFiles = await compressImages(acceptedFiles, {
            ...compressionOptions,
            onProgress: (message, progress) => {
              setCompressionMessage(message);
              setCompressionProgress(progress);
            },
          });
        }

        const newFiles = processedFiles.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
          type: file.type.startsWith("video/") ? "video" : "image",
          originalSize: file.size,
          compressed: enableCompression && file.type.startsWith("image/"),
        }));

        const updatedFiles = [...files, ...newFiles].slice(0, maxFiles);
        setFiles(updatedFiles);
        onFilesChange(updatedFiles);
      } catch (error) {
        console.error("Error processing files:", error);
        // Fallback to original files if compression fails
        const newFiles = acceptedFiles.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
          type: file.type.startsWith("video/") ? "video" : "image",
          originalSize: file.size,
          compressed: false,
        }));

        const updatedFiles = [...files, ...newFiles].slice(0, maxFiles);
        setFiles(updatedFiles);
        onFilesChange(updatedFiles);
      } finally {
        setCompressing(false);
        setCompressionProgress(0);
        setCompressionMessage("");
      }
    },
    [files, maxFiles, onFilesChange, enableCompression, compressionOptions]
  );

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const accept = acceptVideo
    ? { "image/*": [], "video/*": [] }
    : { "image/*": [] };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: maxFiles - files.length,
    disabled: files.length >= maxFiles || compressing,
  });

  return (
    <div className={`space-y-4 ${className}`}>
      {files.length < maxFiles && (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${
              isDragActive
                ? "border-blue-500 bg-blue-50"
                : compressing
                ? "border-gray-300 bg-gray-50 cursor-not-allowed"
                : "border-gray-300 hover:border-gray-400"
            }
          `}
        >
          <input {...getInputProps()} />
          {compressing ? (
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
                <div
                  className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"
                  style={{
                    transform: `rotate(${compressionProgress * 3.6}deg)`,
                  }}
                ></div>
              </div>
              <p className="text-blue-600 text-sm">
                {compressionMessage || "Compressing images..."}
              </p>
              <p className="text-blue-500 text-xs mt-1">
                {Math.round(compressionProgress)}%
              </p>
            </div>
          ) : (
            <>
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              {isDragActive ? (
                <p className="text-blue-600">Drop the files here...</p>
              ) : (
                <div>
                  <p className="text-gray-600 mb-2">
                    Drag & drop files here, or click to select
                  </p>
                  <p className="text-sm text-gray-500">
                    {acceptVideo ? "Images and videos" : "Images only"}• Max{" "}
                    {maxFiles} files • {files.length}/{maxFiles} uploaded
                  </p>
                  {enableCompression && (
                    <div className="flex items-center justify-center mt-2 text-xs text-green-600">
                      <Zap className="h-3 w-3 mr-1" />
                      Auto-compression enabled
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((fileItem, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                {fileItem.type === "video" ? (
                  <div className="flex items-center justify-center h-full">
                    <Video className="h-8 w-8 text-gray-400" />
                    <span className="ml-2 text-sm text-gray-600">Video</span>
                  </div>
                ) : (
                  <Image
                    src={fileItem.preview || fileItem.url}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                    width={400}
                    height={400}
                  />
                )}
              </div>

              {/* File size indicator */}
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                {fileItem.file && fileItem.file.size
                  ? formatFileSize(fileItem.file.size)
                  : fileItem.size
                  ? formatFileSize(fileItem.size)
                  : ""}
              </div>

              {/* Compression indicator */}
              {fileItem.compressed && (
                <div className="absolute top-2 left-2">
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded flex items-center">
                    <Zap className="h-3 w-3 mr-1" />
                    Compressed
                  </span>
                </div>
              )}

              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>

              {index === 0 && (
                <div className="absolute bottom-2 left-2">
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    Main
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Compression info */}
      {enableCompression && files.length > 0 && (
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="text-sm font-medium text-green-800 mb-2 flex items-center">
            <Zap className="h-4 w-4 mr-2" />
            Image Compression Active
          </h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Images are automatically compressed for faster uploads</li>
            <li>
              • Maximum dimensions: {compressionOptions.maxWidth}x
              {compressionOptions.maxHeight}px
            </li>
            <li>• Quality: {Math.round(compressionOptions.quality * 100)}%</li>
            <li>• Maximum file size: {compressionOptions.maxSizeMB}MB</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
