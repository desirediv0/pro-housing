"use client";

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { X, Image, Video, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminAPI } from "@/lib/api-functions";
import toast from "react-hot-toast";

const SidebarFileUpload = ({
  value = "",
  onChange,
  type = "image", // 'image' or 'video'
  className = "",
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploading(true);

    try {
      let response;
      if (type === "video") {
        response = await adminAPI.uploadSidebarVideo(file);
      } else {
        response = await adminAPI.uploadSidebarImage(file);
      }

      const fileUrl = response.data.data.url;
      onChange(fileUrl);
      toast.success(
        `${type === "video" ? "Video" : "Image"} uploaded successfully`
      );
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(`Failed to upload ${type}`);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = async () => {
    if (!value) return;

    try {
      await adminAPI.deleteSidebarFile(value);
      onChange("");
      toast.success("File removed successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to remove file");
    }
  };

  const accept =
    type === "video"
      ? { "video/*": [".mp4", ".avi", ".mov", ".wmv", ".flv", ".webm"] }
      : { "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"] };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    disabled: uploading,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    onDropAccepted: () => setDragActive(false),
    onDropRejected: () => setDragActive(false),
  });

  if (value) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="relative group border border-gray-200 rounded-lg overflow-hidden">
          {type === "video" ? (
            <div className="aspect-video bg-gray-100 flex items-center justify-center">
              <video
                src={value}
                className="w-full h-full object-cover"
                controls
                preload="metadata"
              />
            </div>
          ) : (
            <div className="aspect-square bg-gray-100">
              <img
                src={value}
                alt="Uploaded file"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={removeFile}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => onChange("")}
          className="w-full"
        >
          Change {type === "video" ? "Video" : "Image"}
        </Button>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        {...getRootProps()}
        className={`
                    border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                    ${
                      isDragActive || dragActive
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }
                    ${uploading ? "pointer-events-none opacity-50" : ""}
                `}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="mx-auto h-12 w-12 text-blue-500 mb-4 animate-spin" />
            <p className="text-blue-600">Uploading {type}...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {type === "video" ? (
              <Video className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            ) : (
              <Image className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            )}
            {isDragActive || dragActive ? (
              <p className="text-blue-600">Drop the {type} here...</p>
            ) : (
              <div>
                <p className="text-gray-600 mb-2">
                  Drag & drop {type} here, or click to select
                </p>
                <p className="text-sm text-gray-500">
                  {type === "video"
                    ? "MP4, AVI, MOV, WMV, FLV, WebM (max 50MB)"
                    : "JPEG, PNG, GIF, WebP (max 10MB)"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export { SidebarFileUpload };
