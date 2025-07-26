import { prisma } from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponsive } from "../utils/ApiResponsive.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  uploadImageToS3,
  uploadToS3,
  uploadMultipleImagesToS3,
} from "../utils/uploadToS3.js";
import { deleteFromS3 } from "../utils/deleteFromS3.js";
import { updateAnalytics } from "./analytics.controller.js";
import { createSlug } from "../helper/Slug.js";

// Create Property
export const createProperty = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    price,
    propertyType,
    listingType,
    bedrooms,
    bathrooms,
    area,
    builtYear,
    floor,
    totalFloors,
    address,
    locality,
    city,
    state,
    pincode,
    latitude,
    longitude,
    mapLink,
    furnished,
    parking,
    balcony,
    garden,
    swimming,
    gym,
    security,
    elevator,
    powerBackup,
    highlight,
    expiresAt,
    contactName,
    contactPhone,
    contactEmail,
    customAmenities,
  } = req.body;

  // Validate required fields
  if (
    !title ||
    !description ||
    !price ||
    !propertyType ||
    !listingType ||
    !address ||
    !city ||
    !state ||
    !pincode
  ) {
    throw new ApiError(
      400,
      "Required fields: title, description, price, propertyType, listingType, address, city, state, pincode"
    );
  }

  // Validate price
  if (price <= 0) {
    throw new ApiError(400, "Price must be greater than 0");
  }

  // Handle main image upload
  if (!req.files || !req.files.mainImage || req.files.mainImage.length === 0) {
    throw new ApiError(400, "Main image is required");
  }
  const mainImageFile = req.files.mainImage[0];
  const mainImageResult = await uploadImageToS3(
    mainImageFile,
    `${process.env.UPLOAD_FOLDER || "prohousing"}/properties/main`,
    85,
    1920
  );

  // Generate unique slug
  const baseSlug = createSlug(title);
  let slug = baseSlug;
  let counter = 1;

  // Check if slug exists and make it unique
  while (await prisma.property.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const propertyData = {
    title: title.trim(),
    slug,
    description: description.trim(),
    price: parseFloat(price),
    propertyType,
    listingType,
    address: address.trim(),
    city: city.trim(),
    state: state.trim(),
    pincode: pincode.trim(),
    mainImage: mainImageResult.url,
    // Optional fields
    ...(bedrooms && { bedrooms: parseInt(bedrooms) }),
    ...(bathrooms && { bathrooms: parseInt(bathrooms) }),
    ...(area && { area: parseFloat(area) }),
    ...(builtYear && { builtYear: parseInt(builtYear) }),
    ...(floor && { floor: parseInt(floor) }),
    ...(totalFloors && { totalFloors: parseInt(totalFloors) }),
    ...(locality && { locality: locality.trim() }),
    ...(latitude && { latitude: parseFloat(latitude) }),
    ...(longitude && { longitude: parseFloat(longitude) }),
    ...(mapLink && { mapLink: mapLink.trim() }),
    // Contact fields - fix for null issue
    ...(contactName && { contactName: contactName.trim() }),
    ...(contactPhone && { contactPhone: contactPhone.trim() }),
    ...(contactEmail && { contactEmail: contactEmail.trim() }),
    // Boolean fields
    furnished: furnished === "true",
    parking: parking === "true",
    balcony: balcony === "true",
    garden: garden === "true",
    swimming: swimming === "true",
    gym: gym === "true",
    security: security === "true",
    elevator: elevator === "true",
    powerBackup: powerBackup === "true",
    ...(highlight && { highlight }),
    ...(expiresAt && { expiresAt: new Date(expiresAt) }),
    ...(customAmenities && { customAmenities }),
  };

  const property = await prisma.property.create({
    data: propertyData,
    include: {
      images: true,
      videos: true,
    },
  });

  // Handle additional images upload
  if (req.files && req.files.images && req.files.images.length > 0) {
    const imageResults = await uploadMultipleImagesToS3(
      req.files.images,
      `${process.env.UPLOAD_FOLDER || "prohousing"}/properties/gallery`,
      80,
      1920
    );

    const imageData = imageResults.files.map((result, index) => ({
      url: result.url,
      propertyId: property.id,
      order: index + 1,
    }));

    await prisma.propertyImage.createMany({
      data: imageData,
    });
  }

  // Handle videos upload
  if (req.files && req.files.videos && req.files.videos.length > 0) {
    const videoResults = await Promise.all(
      req.files.videos.map((video) =>
        uploadToS3(
          video,
          `${process.env.UPLOAD_FOLDER || "prohousing"}/properties/videos`
        )
      )
    );

    const videoData = videoResults.map((result, index) => ({
      url: result.url,
      title: `Video ${index + 1}`,
      propertyId: property.id,
    }));

    await prisma.propertyVideo.createMany({
      data: videoData,
    });
  } // Fetch complete property with all relations
  const completeProperty = await prisma.property.findUnique({
    where: { id: property.id },
    include: {
      images: { orderBy: { order: "asc" } },
      videos: true,
    },
  });

  // Track analytics for new property
  updateAnalytics("property_created", { propertyType });

  res
    .status(201)
    .json(
      new ApiResponsive(201, completeProperty, "Property created successfully")
    );
});

// Get All Properties
export const getAllProperties = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search,
    propertyType,
    listingType,
    city,
    state,
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
    furnished,
    parking,
    status,
    highlight,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  // Validate pagination parameters
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const validPage = Number.isInteger(pageNum) && pageNum > 0 ? pageNum : 1;
  const validLimit = Number.isInteger(limitNum) && limitNum > 0 ? limitNum : 10;

  const skip = (validPage - 1) * validLimit;

  // Build where clause
  const whereClause = {
    isActive: true,
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
        { locality: { contains: search, mode: "insensitive" } },
      ],
    }),
    ...(propertyType && { propertyType: propertyType.toUpperCase() }),
    ...(listingType && { listingType: listingType.toUpperCase() }),
    ...(city && { city: { contains: city, mode: "insensitive" } }),
    ...(state && { state: { contains: state, mode: "insensitive" } }),
    ...(minPrice && { price: { gte: parseFloat(minPrice) } }),
    ...(maxPrice && { price: { lte: parseFloat(maxPrice) } }),
    ...(bedrooms && { bedrooms: parseInt(bedrooms) }),
    ...(bathrooms && { bathrooms: parseInt(bathrooms) }),
    ...(furnished !== undefined && { furnished: furnished === "true" }),
    ...(parking !== undefined && { parking: parking === "true" }),
    ...(status && { status: status.toUpperCase() }),
    ...(highlight && { highlight: highlight.toUpperCase() }),
  };

  // Handle price range filter
  if (minPrice && maxPrice) {
    whereClause.price = {
      gte: parseFloat(minPrice),
      lte: parseFloat(maxPrice),
    };
  }

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where: whereClause,
      include: {
        images: { orderBy: { order: "asc" } },
        videos: true,
        _count: {
          select: { inquiries: true },
        },
      },
      skip,
      take: validLimit,
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.property.count({ where: whereClause }),
  ]);

  res.status(200).json(
    new ApiResponsive(
      200,
      {
        properties,
        pagination: {
          total,
          pages: Math.ceil(total / validLimit),
          currentPage: validPage,
          limit: validLimit,
        },
      },
      "Properties retrieved successfully"
    )
  );
});

// Get Property by ID or Slug
export const getPropertyById = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;

  // Try to find by ID first, then by slug
  let property = await prisma.property.findUnique({
    where: { id: propertyId },
    include: {
      images: { orderBy: { order: "asc" } },
      videos: true,
      inquiries: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  // If not found by ID, try to find by slug
  if (!property) {
    property = await prisma.property.findUnique({
      where: { slug: propertyId },
      include: {
        images: { orderBy: { order: "asc" } },
        videos: true,
        inquiries: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  if (!property) {
    throw new ApiError(404, "Property not found");
  }

  // Increment views
  await prisma.property.update({
    where: { id: property.id },
    data: { views: { increment: 1 } },
  });

  // Track analytics for property view
  updateAnalytics("property_view", { propertyType: property.propertyType });

  res
    .status(200)
    .json(new ApiResponsive(200, property, "Property retrieved successfully"));
});

// Update Property
export const updateProperty = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;

  // Extract only valid fields for property update
  const {
    title,
    description,
    price,
    propertyType,
    listingType,
    bedrooms,
    bathrooms,
    area,
    builtYear,
    floor,
    totalFloors,
    address,
    locality,
    city,
    state,
    pincode,
    latitude,
    longitude,
    mapLink,
    furnished,
    parking,
    balcony,
    garden,
    swimming,
    gym,
    security,
    elevator,
    powerBackup,
    status,
    highlight,
    expiresAt,
    contactName,
    contactPhone,
    contactEmail,
    customAmenities,
  } = req.body;

  // Build update data object with only valid fields
  const updateData = {
    ...(title && { title: title.trim() }),
    ...(description && { description: description.trim() }),
    ...(price && { price: parseFloat(price) }),
    ...(propertyType && { propertyType }),
    ...(listingType && { listingType }),
    ...(address && { address: address.trim() }),
    ...(city && { city: city.trim() }),
    ...(state && { state: state.trim() }),
    ...(pincode && { pincode: pincode.trim() }),
    ...(locality && { locality: locality.trim() }),
    ...(mapLink && { mapLink: mapLink.trim() }),
    ...(contactName && { contactName: contactName.trim() }),
    ...(contactPhone && { contactPhone: contactPhone.trim() }),
    ...(contactEmail && { contactEmail: contactEmail.trim() }),
    ...(status && { status }),
    ...(highlight && { highlight }),
  };

  // Handle numeric fields
  if (bedrooms !== undefined && bedrooms !== "")
    updateData.bedrooms = parseInt(bedrooms);
  if (bathrooms !== undefined && bathrooms !== "")
    updateData.bathrooms = parseInt(bathrooms);
  if (area !== undefined && area !== "") updateData.area = parseFloat(area);
  if (builtYear !== undefined && builtYear !== "")
    updateData.builtYear = parseInt(builtYear);
  if (floor !== undefined && floor !== "") updateData.floor = parseInt(floor);
  if (totalFloors !== undefined && totalFloors !== "")
    updateData.totalFloors = parseInt(totalFloors);
  if (latitude !== undefined && latitude !== "")
    updateData.latitude = parseFloat(latitude);
  if (longitude !== undefined && longitude !== "")
    updateData.longitude = parseFloat(longitude);

  // Handle boolean fields
  if (furnished !== undefined) updateData.furnished = furnished === "true";
  if (parking !== undefined) updateData.parking = parking === "true";
  if (balcony !== undefined) updateData.balcony = balcony === "true";
  if (garden !== undefined) updateData.garden = garden === "true";
  if (swimming !== undefined) updateData.swimming = swimming === "true";
  if (gym !== undefined) updateData.gym = gym === "true";
  if (security !== undefined) updateData.security = security === "true";
  if (elevator !== undefined) updateData.elevator = elevator === "true";
  if (powerBackup !== undefined)
    updateData.powerBackup = powerBackup === "true";

  // Handle date fields
  if (expiresAt) updateData.expiresAt = new Date(expiresAt);

  // Handle custom amenities
  if (customAmenities !== undefined)
    updateData.customAmenities = customAmenities;

  // Check if property exists - try by ID first, then by slug
  let existingProperty = await prisma.property.findUnique({
    where: { id: propertyId },
    include: { images: true, videos: true },
  });

  if (!existingProperty) {
    existingProperty = await prisma.property.findUnique({
      where: { slug: propertyId },
      include: { images: true, videos: true },
    });
  }

  if (!existingProperty) {
    throw new ApiError(404, "Property not found");
  }

  // Handle main image update
  if (req.files && req.files.mainImage && req.files.mainImage.length > 0) {
    // Delete old main image
    if (existingProperty.mainImage) {
      await deleteFromS3(existingProperty.mainImage);
    }

    // Upload new main image
    const mainImageFile = req.files.mainImage[0];
    const mainImageResult = await uploadImageToS3(
      mainImageFile,
      `${process.env.UPLOAD_FOLDER || "prohousing"}/properties/main`,
      85,
      1920
    );
    updateData.mainImage = mainImageResult.url;
  }

  // Handle main image deletion
  let mainImageDeleted = false;
  if (req.body.deleteMainImage === "true") {
    if (existingProperty.mainImage) {
      await deleteFromS3(existingProperty.mainImage);
      mainImageDeleted = true;

      // Check if there are existing gallery images to promote to main image
      if (existingProperty.images && existingProperty.images.length > 0) {
        // Use first existing gallery image as new main image
        const firstGalleryImage = existingProperty.images[0];
        updateData.mainImage = firstGalleryImage.url;

        // Remove this image from gallery since it's now the main image
        await prisma.propertyImage.delete({
          where: { id: firstGalleryImage.id },
        });
      }
      // If no existing gallery images, we'll handle this after processing new uploads
    }
  }

  // Handle images to delete
  if (req.body.imagesToDelete) {
    try {
      const imagesToDelete = JSON.parse(req.body.imagesToDelete);

      // Delete images from S3 and database
      for (const image of imagesToDelete) {
        if (image.url) {
          await deleteFromS3(image.url);
        }

        // Only try to delete from propertyImage table if it's not the main image
        if (!image.isMainImage && image.id !== "main-image") {
          try {
            // First check if the image exists in the database
            const existingImage = await prisma.propertyImage.findUnique({
              where: { id: image.id },
            });

            if (existingImage) {
              await prisma.propertyImage.delete({ where: { id: image.id } });
              console.log(
                `Successfully deleted image ${image.id} from database`
              );
            } else {
              console.log(
                `Image ${image.id} not found in database, skipping database deletion`
              );
            }
          } catch (dbError) {
            console.error(
              `Error deleting image ${image.id} from database:`,
              dbError
            );
            // Continue with other images even if one fails
          }
        }
      }
    } catch (error) {
      console.error("Error deleting images:", error);
    }
  }

  // Handle videos to delete
  if (req.body.videosToDelete) {
    try {
      const videosToDelete = JSON.parse(req.body.videosToDelete);

      // Delete videos from S3 and database
      for (const video of videosToDelete) {
        if (video.url) {
          await deleteFromS3(video.url);
        }

        try {
          // Check if video exists before deleting
          const existingVideo = await prisma.propertyVideo.findUnique({
            where: { id: video.id },
          });

          if (existingVideo) {
            await prisma.propertyVideo.delete({ where: { id: video.id } });
            console.log(`Successfully deleted video ${video.id} from database`);
          } else {
            console.log(
              `Video ${video.id} not found in database, skipping database deletion`
            );
          }
        } catch (dbError) {
          console.error(
            `Error deleting video ${video.id} from database:`,
            dbError
          );
          // Continue with other videos even if one fails
        }
      }
    } catch (error) {
      console.error("Error deleting videos:", error);
    }
  }

  // Handle new images
  if (req.files && req.files.images && req.files.images.length > 0) {
    const imageResults = await uploadMultipleImagesToS3(
      req.files.images,
      `${process.env.UPLOAD_FOLDER || "prohousing"}/properties/gallery`,
      80,
      1920
    );

    // If main image was deleted and no existing images were promoted, use first new image as main
    if (
      mainImageDeleted &&
      !updateData.mainImage &&
      imageResults.files.length > 0
    ) {
      updateData.mainImage = imageResults.files[0].url;
      // Remove first image from gallery images since it's now the main image
      imageResults.files.shift();
    }

    // Add remaining images to gallery if any
    if (imageResults.files.length > 0) {
      // Get current max order
      const maxOrder = await prisma.propertyImage.findFirst({
        where: { propertyId: existingProperty.id },
        orderBy: { order: "desc" },
      });

      const startOrder = maxOrder ? maxOrder.order + 1 : 1;

      const imageData = imageResults.files.map((result, index) => ({
        url: result.url,
        propertyId: existingProperty.id,
        order: startOrder + index,
      }));

      await prisma.propertyImage.createMany({
        data: imageData,
      });
    }
  }

  // Final check: If main image was deleted but no replacement found, prevent the update
  if (mainImageDeleted && !updateData.mainImage) {
    throw new ApiError(
      400,
      "Cannot delete main image without providing a replacement. Please upload at least one new image or keep existing gallery images."
    );
  }

  // Handle new videos
  if (req.files && req.files.videos && req.files.videos.length > 0) {
    const videoResults = await Promise.all(
      req.files.videos.map((video) =>
        uploadToS3(
          video,
          `${process.env.UPLOAD_FOLDER || "prohousing"}/properties/videos`
        )
      )
    );

    const videoData = videoResults.map((result, index) => ({
      url: result.url,
      title: `Video ${index + 1}`,
      propertyId: existingProperty.id,
    }));

    await prisma.propertyVideo.createMany({
      data: videoData,
    });
  }

  // Update property
  const updatedProperty = await prisma.property.update({
    where: { id: existingProperty.id },
    data: updateData,
    include: {
      images: { orderBy: { order: "asc" } },
      videos: true,
    },
  });

  res
    .status(200)
    .json(
      new ApiResponsive(200, updatedProperty, "Property updated successfully")
    );
});

// Delete Property
export const deleteProperty = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;

  // Try to find by ID first, then by slug
  let property = await prisma.property.findUnique({
    where: { id: propertyId },
    include: { images: true, videos: true },
  });

  if (!property) {
    property = await prisma.property.findUnique({
      where: { slug: propertyId },
      include: { images: true, videos: true },
    });
  }

  if (!property) {
    throw new ApiError(404, "Property not found");
  }

  console.log(`Deleting property: ${property.title} (ID: ${property.id})`);

  // Collect all file URLs to delete
  const filesToDelete = [];

  // Add main image
  if (property.mainImage) {
    filesToDelete.push(property.mainImage);
  }

  // Add gallery images
  property.images.forEach((image) => {
    if (image.url) {
      filesToDelete.push(image.url);
    }
  });

  // Add videos
  property.videos.forEach((video) => {
    if (video.url) {
      filesToDelete.push(video.url);
    }
  });

  console.log(`Found ${filesToDelete.length} files to delete from S3`);

  // Delete all files from S3 (don't let S3 errors block database deletion)
  try {
    const deleteResults = await Promise.allSettled(
      filesToDelete.map((fileUrl) => deleteFromS3(fileUrl))
    );

    const successfulDeletes = deleteResults.filter(
      (result) => result.status === "fulfilled" && result.value?.success
    ).length;

    console.log(
      `Successfully deleted ${successfulDeletes}/${filesToDelete.length} files from S3`
    );
  } catch (error) {
    console.error("Error deleting files from S3:", error);
    // Continue with database deletion even if S3 cleanup fails
  }

  // Delete property from database (cascade will handle related records)
  await prisma.property.delete({
    where: { id: property.id },
  });

  console.log(`Property ${propertyId} deleted successfully from database`);

  res
    .status(200)
    .json(new ApiResponsive(200, null, "Property deleted successfully"));
});

// Add Property Images
export const addPropertyImages = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;

  if (!req.files || !req.files.images || req.files.images.length === 0) {
    throw new ApiError(400, "At least one image is required");
  }

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    throw new ApiError(404, "Property not found");
  }

  // Upload images
  const imageResults = await uploadMultipleImagesToS3(
    req.files.images,
    `${process.env.UPLOAD_FOLDER || "prohousing"}/properties/gallery`,
    80,
    1920
  );

  // Get current max order
  const maxOrder = await prisma.propertyImage.findFirst({
    where: { propertyId },
    orderBy: { order: "desc" },
  });

  const startOrder = maxOrder ? maxOrder.order + 1 : 1;

  const imageData = imageResults.files.map((result, index) => ({
    url: result.url,
    propertyId,
    order: startOrder + index,
    caption: req.body[`caption_${index}`] || null,
  }));

  const images = await prisma.propertyImage.createMany({
    data: imageData,
  });

  const addedImages = await prisma.propertyImage.findMany({
    where: { propertyId },
    orderBy: { order: "asc" },
  });

  res
    .status(201)
    .json(new ApiResponsive(201, addedImages, "Images added successfully"));
});

// Delete Property Image
export const deletePropertyImage = asyncHandler(async (req, res) => {
  const { imageId } = req.params;

  const image = await prisma.propertyImage.findUnique({
    where: { id: imageId },
  });

  if (!image) {
    throw new ApiError(404, "Image not found");
  }

  // Delete from S3
  await deleteFromS3(image.url);

  // Delete from database
  await prisma.propertyImage.delete({
    where: { id: imageId },
  });

  res
    .status(200)
    .json(new ApiResponsive(200, null, "Image deleted successfully"));
});

// Add Property Videos
export const addPropertyVideos = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;

  if (!req.files || !req.files.videos || req.files.videos.length === 0) {
    throw new ApiError(400, "At least one video is required");
  }

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    throw new ApiError(404, "Property not found");
  }

  // Upload videos
  const videoResults = await Promise.all(
    req.files.videos.map((video) =>
      uploadToS3(
        video,
        `${process.env.UPLOAD_FOLDER || "prohousing"}/properties/videos`
      )
    )
  );

  const videoData = videoResults.map((result, index) => ({
    url: result.url,
    title: req.body[`title_${index}`] || `Video ${index + 1}`,
    propertyId,
  }));

  await prisma.propertyVideo.createMany({
    data: videoData,
  });

  const addedVideos = await prisma.propertyVideo.findMany({
    where: { propertyId },
  });

  res
    .status(201)
    .json(new ApiResponsive(201, addedVideos, "Videos added successfully"));
});

// Delete Property Video
export const deletePropertyVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await prisma.propertyVideo.findUnique({
    where: { id: videoId },
  });

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // Delete from S3
  await deleteFromS3(video.url);

  // Delete from database
  await prisma.propertyVideo.delete({
    where: { id: videoId },
  });

  res
    .status(200)
    .json(new ApiResponsive(200, null, "Video deleted successfully"));
});

// Toggle Property Status
export const togglePropertyStatus = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;
  const { isActive } = req.body;

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    throw new ApiError(404, "Property not found");
  }

  const updatedProperty = await prisma.property.update({
    where: { id: propertyId },
    data: { isActive: isActive !== undefined ? isActive : !property.isActive },
    select: {
      id: true,
      title: true,
      isActive: true,
      status: true,
    },
  });

  res
    .status(200)
    .json(
      new ApiResponsive(
        200,
        updatedProperty,
        "Property status updated successfully"
      )
    );
});

// Update Property Highlight (Featured/Trending/Hot Deal etc.)
export const updatePropertyHighlight = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;
  const { highlight } = req.body;

  // Validate highlight value
  const validHighlights = [
    "NEW",
    "TRENDING",
    "FEATURED",
    "HOT_DEAL",
    "PREMIUM",
  ];
  if (highlight && !validHighlights.includes(highlight)) {
    throw new ApiError(
      400,
      `Invalid highlight. Must be one of: ${validHighlights.join(", ")}`
    );
  }

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    throw new ApiError(404, "Property not found");
  }

  const updatedProperty = await prisma.property.update({
    where: { id: propertyId },
    data: { highlight: highlight || null },
    include: {
      images: { orderBy: { order: "asc" } },
      videos: true,
      _count: {
        select: { inquiries: true },
      },
    },
  });

  res
    .status(200)
    .json(
      new ApiResponsive(
        200,
        updatedProperty,
        "Property highlight updated successfully"
      )
    );
});

// Get Featured Properties
export const getFeaturedProperties = asyncHandler(async (req, res) => {
  const { limit = 12 } = req.query;

  const properties = await prisma.property.findMany({
    where: {
      isActive: true,
      highlight: {
        in: ["FEATURED", "PREMIUM", "HOT_DEAL"],
      },
    },
    include: {
      images: { orderBy: { order: "asc" }, take: 3 },
      _count: {
        select: { inquiries: true },
      },
    },
    take: parseInt(limit),
    orderBy: [
      { highlight: "asc" }, // Featured first, then others
      { createdAt: "desc" },
    ],
  });

  const formattedProperties = properties.map((property) => ({
    ...property,
    formattedPrice: new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(property.price),
    mainImage: property.mainImage || property.images[0]?.url,
    location: `${property.locality ? property.locality + ", " : ""}${
      property.city
    }, ${property.state}`,
  }));

  res
    .status(200)
    .json(
      new ApiResponsive(
        200,
        formattedProperties,
        "Featured properties retrieved successfully"
      )
    );
});

// Get Trending Properties
export const getTrendingProperties = asyncHandler(async (req, res) => {
  const { limit = 12 } = req.query;

  const properties = await prisma.property.findMany({
    where: {
      isActive: true,
      OR: [
        { highlight: "TRENDING" },
        { views: { gte: 100 } }, // Properties with high views are also trending
      ],
    },
    include: {
      images: { orderBy: { order: "asc" }, take: 3 },
      _count: {
        select: { inquiries: true },
      },
    },
    take: parseInt(limit),
    orderBy: [{ views: "desc" }, { createdAt: "desc" }],
  });

  const formattedProperties = properties.map((property) => ({
    ...property,
    formattedPrice: new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(property.price),
    mainImage: property.mainImage || property.images[0]?.url,
    location: `${property.locality ? property.locality + ", " : ""}${
      property.city
    }, ${property.state}`,
  }));

  res
    .status(200)
    .json(
      new ApiResponsive(
        200,
        formattedProperties,
        "Trending properties retrieved successfully"
      )
    );
});

// Bulk Update Property Highlights (for admin dashboard)
export const bulkUpdateHighlights = asyncHandler(async (req, res) => {
  const { propertyIds, highlight } = req.body;

  if (!propertyIds || !Array.isArray(propertyIds) || propertyIds.length === 0) {
    throw new ApiError(400, "Property IDs array is required");
  }

  const validHighlights = [
    "NEW",
    "TRENDING",
    "FEATURED",
    "HOT_DEAL",
    "PREMIUM",
  ];
  if (highlight && !validHighlights.includes(highlight)) {
    throw new ApiError(
      400,
      `Invalid highlight. Must be one of: ${validHighlights.join(", ")}`
    );
  }

  const updatedProperties = await prisma.property.updateMany({
    where: {
      id: { in: propertyIds },
    },
    data: {
      highlight: highlight || null,
    },
  });

  res
    .status(200)
    .json(
      new ApiResponsive(
        200,
        { count: updatedProperties.count },
        `${updatedProperties.count} properties updated successfully`
      )
    );
});

// Get Properties by Highlight
export const getPropertiesByHighlight = asyncHandler(async (req, res) => {
  const { highlight } = req.params;
  const { page = 1, limit = 12 } = req.query;

  // Validate pagination parameters
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const validPage = Number.isInteger(pageNum) && pageNum > 0 ? pageNum : 1;
  const validLimit = Number.isInteger(limitNum) && limitNum > 0 ? limitNum : 12;

  const skip = (validPage - 1) * validLimit;

  const validHighlights = [
    "NEW",
    "TRENDING",
    "FEATURED",
    "HOT_DEAL",
    "PREMIUM",
  ];
  if (!validHighlights.includes(highlight)) {
    throw new ApiError(
      400,
      `Invalid highlight. Must be one of: ${validHighlights.join(", ")}`
    );
  }

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where: {
        isActive: true,
        highlight: highlight,
      },
      include: {
        images: { orderBy: { order: "asc" }, take: 3 },
        _count: {
          select: { inquiries: true },
        },
      },
      skip,
      take: validLimit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.property.count({
      where: {
        isActive: true,
        highlight: highlight,
      },
    }),
  ]);

  const formattedProperties = properties.map((property) => ({
    ...property,
    formattedPrice: new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(property.price),
    mainImage: property.mainImage || property.images[0]?.url,
    location: `${property.locality ? property.locality + ", " : ""}${
      property.city
    }, ${property.state}`,
  }));

  res.status(200).json(
    new ApiResponsive(
      200,
      {
        properties: formattedProperties,
        pagination: {
          total,
          pages: Math.ceil(total / validLimit),
          currentPage: validPage,
          limit: validLimit,
        },
      },
      `${highlight} properties retrieved successfully`
    )
  );
});

// Get Property Analytics
export const getPropertyAnalytics = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    include: {
      _count: {
        select: { inquiries: true },
      },
    },
  });

  if (!property) {
    throw new ApiError(404, "Property not found");
  }

  const analytics = {
    views: property.views,
    clicks: property.clicks,
    inquiries: property._count.inquiries,
    createdAt: property.createdAt,
    lastUpdated: property.updatedAt,
  };

  res
    .status(200)
    .json(
      new ApiResponsive(
        200,
        analytics,
        "Property analytics retrieved successfully"
      )
    );
});

// Get Public Properties - Enhanced search for public users
export const getPublicProperties = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 12,
    search,
    location,
    type,
    price,
    propertyType,
    listingType,
    city,
    state,
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
    furnished,
    parking,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  // Validate pagination parameters
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const validPage = Number.isInteger(pageNum) && pageNum > 0 ? pageNum : 1;
  const validLimit = Number.isInteger(limitNum) && limitNum > 0 ? limitNum : 10;

  const skip = (validPage - 1) * validLimit;

  // Build comprehensive search where clause
  const whereClause = {
    isActive: true,
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
        { locality: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { state: { contains: search, mode: "insensitive" } },
      ],
    }),
    ...(location && {
      OR: [
        { address: { contains: location, mode: "insensitive" } },
        { locality: { contains: location, mode: "insensitive" } },
        { city: { contains: location, mode: "insensitive" } },
        { state: { contains: location, mode: "insensitive" } },
      ],
    }),
    ...(type && { propertyType: type.toUpperCase() }),
    ...(propertyType && { propertyType: propertyType.toUpperCase() }),
    ...(listingType && { listingType: listingType.toUpperCase() }),
    ...(city && { city: { contains: city, mode: "insensitive" } }),
    ...(state && { state: { contains: state, mode: "insensitive" } }),
    ...(bedrooms && { bedrooms: parseInt(bedrooms) }),
    ...(bathrooms && { bathrooms: parseInt(bathrooms) }),
    ...(furnished !== undefined && { furnished: furnished === "true" }),
    ...(parking !== undefined && { parking: parking === "true" }),
  };

  // Handle price range filters
  if (price) {
    const priceRanges = {
      "0-25": { gte: 0, lte: 2500000 },
      "25-50": { gte: 2500000, lte: 5000000 },
      "50-100": { gte: 5000000, lte: 10000000 },
      "100+": { gte: 10000000 },
    };

    if (priceRanges[price]) {
      whereClause.price = priceRanges[price];
    }
  }

  if (minPrice || maxPrice) {
    whereClause.price = {
      ...(minPrice && { gte: parseFloat(minPrice) }),
      ...(maxPrice && { lte: parseFloat(maxPrice) }),
    };
  }

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where: whereClause,
      include: {
        images: {
          orderBy: { order: "asc" },
          take: 3, // Limit images for performance
        },
        _count: {
          select: { inquiries: true },
        },
      },
      skip,
      take: validLimit,
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.property.count({ where: whereClause }),
  ]);

  // Add formatted data for frontend
  const formattedProperties = properties.map((property) => ({
    ...property,
    formattedPrice: new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(property.price),
    mainImage: property.mainImage || property.images[0]?.url,
    location: `${property.locality ? property.locality + ", " : ""}${
      property.city
    }, ${property.state}`,
  }));

  res.status(200).json(
    new ApiResponsive(
      200,
      {
        data: formattedProperties,
        pagination: {
          total,
          pages: Math.ceil(total / validLimit),
          currentPage: validPage,
          limit: validLimit,
          hasMore: skip + validLimit < total,
        },
        filters: {
          totalProperties: total,
          appliedFilters: {
            search,
            location,
            type,
            price,
            bedrooms,
            bathrooms,
            furnished,
            parking,
          },
        },
      },
      "Properties retrieved successfully"
    )
  );
});

// Get Public Property by Slug
export const getPublicPropertyBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const property = await prisma.property.findUnique({
    where: {
      slug,
      isActive: true,
    },
    include: {
      images: {
        orderBy: { order: "asc" },
      },
      videos: true,
    },
  });

  if (!property) {
    throw new ApiError(404, "Property not found");
  }

  // Update views count
  await prisma.property.update({
    where: { id: property.id },
    data: { views: { increment: 1 } },
  });

  // Format the response
  const formattedProperty = {
    ...property,
    formattedPrice: new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(property.price),
    location: `${property.locality ? property.locality + ", " : ""}${
      property.city
    }, ${property.state}`,
  };

  res
    .status(200)
    .json(
      new ApiResponsive(
        200,
        formattedProperty,
        "Property retrieved successfully"
      )
    );
});

// Get Properties by Category - For Carousel
export const getPropertiesByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const { limit = 6 } = req.query;

  // Define property type mappings for each category
  const categoryMappings = {
    apartment: ["APARTMENT", "STUDIO", "PENTHOUSE"],
    house: ["HOUSE", "VILLA", "DUPLEX", "FARMHOUSE"],
    commercial: [
      "COMMERCIAL",
      "OFFICE",
      "SHOP",
      "SHOWROOM",
      "MALL",
      "RESTAURANT",
      "HOTEL",
      "WAREHOUSE",
    ],
    plot: ["PLOT"],
    pg: ["PG", "HOSTEL"],
    invest: ["APARTMENT", "HOUSE", "VILLA", "COMMERCIAL", "PLOT"], // Investment properties from all types
  };

  // Validate category
  if (!categoryMappings[category]) {
    throw new ApiError(
      400,
      `Invalid category. Available categories: ${Object.keys(
        categoryMappings
      ).join(", ")}`
    );
  }

  let whereClause = {
    isActive: true,
  };

  // Special handling for investment category
  if (category === "invest") {
    whereClause = {
      ...whereClause,
      propertyType: { in: categoryMappings[category] },
      OR: [
        { highlight: "PREMIUM" },
        { highlight: "FEATURED" },
        { price: { gte: 5000000 } }, // High value properties for investment
        { listingType: "LEASE" },
      ],
    };
  } else {
    whereClause = {
      ...whereClause,
      propertyType: { in: categoryMappings[category] },
    };
  }

  const properties = await prisma.property.findMany({
    where: whereClause,
    include: {
      images: {
        orderBy: { order: "asc" },
        take: 1, // Only main image for carousel
      },
      _count: {
        select: { inquiries: true },
      },
    },
    take: parseInt(limit),
    orderBy: [
      { highlight: "asc" }, // Featured properties first
      { views: "desc" }, // Popular properties
      { createdAt: "desc" }, // Latest properties
    ],
  });

  // Format properties for frontend
  const formattedProperties = properties.map((property) => ({
    ...property,
    formattedPrice: new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(property.price),
    mainImage: property.mainImage || property.images[0]?.url,
    location: `${property.locality ? property.locality + ", " : ""}${
      property.city
    }, ${property.state}`,
  }));

  res.status(200).json(
    new ApiResponsive(
      200,
      {
        data: formattedProperties,
        category: category,
        total: formattedProperties.length,
      },
      `${category} properties retrieved successfully`
    )
  );
});

// Get Property Categories Stats
export const getPropertyCategoriesStats = asyncHandler(async (req, res) => {
  // Get counts for each category
  const categoryMappings = {
    apartment: ["APARTMENT", "STUDIO", "PENTHOUSE"],
    house: ["HOUSE", "VILLA", "DUPLEX", "FARMHOUSE"],
    commercial: [
      "COMMERCIAL",
      "OFFICE",
      "SHOP",
      "SHOWROOM",
      "MALL",
      "RESTAURANT",
      "HOTEL",
      "WAREHOUSE",
    ],
    plot: ["PLOT"],
    pg: ["PG", "HOSTEL"],
  };

  const stats = {};

  for (const [category, types] of Object.entries(categoryMappings)) {
    const count = await prisma.property.count({
      where: {
        isActive: true,
        propertyType: { in: types },
      },
    });
    stats[category] = count;
  }

  // Investment properties count (high value properties)
  const investmentCount = await prisma.property.count({
    where: {
      isActive: true,
      OR: [
        { highlight: "PREMIUM" },
        { highlight: "FEATURED" },
        { price: { gte: 5000000 } },
        { listingType: "LEASE" },
      ],
    },
  });

  stats.invest = investmentCount;

  res
    .status(200)
    .json(
      new ApiResponsive(
        200,
        stats,
        "Property categories statistics retrieved successfully"
      )
    );
});
