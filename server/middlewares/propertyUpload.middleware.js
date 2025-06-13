import multer from 'multer';
import { ApiError } from '../utils/ApiError.js';

// Configure multer for property uploads
const storage = multer.memoryStorage();

// File filters
const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new ApiError(400, 'Only image files are allowed'), false);
    }
};

const videoFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new ApiError(400, 'Only video files are allowed'), false);
    }
};

const mediaFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new ApiError(400, 'Only image and video files are allowed'), false);
    }
};

// Multer configurations
export const uploadPropertyImages = multer({
    storage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB per image
        files: 20, // Maximum 20 files
    },
});

export const uploadPropertyVideos = multer({
    storage,
    fileFilter: videoFilter,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB per video
        files: 5, // Maximum 5 videos
    },
});

export const uploadPropertyMedia = multer({
    storage,
    fileFilter: mediaFilter,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB for videos, 10MB for images
        files: 25, // Maximum 25 files total
    },
});

// Property file upload middleware
export const propertyUpload = uploadPropertyMedia.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'images', maxCount: 20 },
    { name: 'videos', maxCount: 5 },
]);

// Single image upload
export const singleImageUpload = uploadPropertyImages.single('image');

// Multiple images upload
export const multipleImagesUpload = uploadPropertyImages.array('images', 20);

// Multiple videos upload
export const multipleVideosUpload = uploadPropertyVideos.array('videos', 5);

// Error handler for multer
export const handleMulterError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return next(new ApiError(400, 'File size too large'));
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return next(new ApiError(400, 'Too many files uploaded'));
        }
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            return next(new ApiError(400, 'Unexpected file field'));
        }
    }
    next(error);
};
