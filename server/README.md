# Pro Housing Server API

A comprehensive property management system with admin authentication, property CRUD operations, and S3 file uploads.

## Features

- 🔐 **Admin Authentication**: Secure login/logout with JWT tokens
- 🏠 **Property Management**: Complete CRUD operations for properties
- 📸 **Media Upload**: Image and video uploads to S3/DigitalOcean Spaces
- 🔒 **Strong Password Validation**: 8+ characters with complexity requirements
- 📊 **Analytics**: Property views, clicks, and inquiry tracking
- 🎯 **Property Highlights**: NEW, TRENDING, FEATURED tags
- 📱 **File Management**: Upload, delete, and organize property media

## Environment Variables

Create a `.env` file in the server directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/pro_housing"

# JWT Secrets
ACCESS_JWT_SECRET="your-access-jwt-secret-key"
REFRESH_TOKEN_SECRET="your-refresh-jwt-secret-key"
ACCESS_TOKEN_LIFE="1h"
REFRESH_TOKEN_LIFE="7d"

# CORS
CORS_ORIGIN="http://localhost:3000,http://localhost:3001"

# DigitalOcean Spaces / S3
SPACES_ENDPOINT="https://sgp1.digitaloceanspaces.com"
SPACES_REGION="sgp1"
SPACES_BUCKET="your-bucket-name"
SPACES_ACCESS_KEY="your-access-key"
SPACES_SECRET_KEY="your-secret-key"

# Razorpay
RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-razorpay-key-secret"

# Node Environment
NODE_ENV="development"
```

## Installation & Setup

1. **Install Dependencies**
```bash
npm install
```

2. **Setup Database**
```bash
npm run generate
npm run migrate
```

3. **Start Development Server**
```bash
npm run dev
```

## API Endpoints

### Admin Authentication

#### Create Admin Account
```http
POST /api/admin/create
Content-Type: application/json

{
  "name": "John Doe",
  "email": "admin@example.com",
  "password": "StrongPass123!"
}
```

#### Admin Login
```http
POST /api/admin/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "StrongPass123!"
}
```

#### Admin Logout
```http
POST /api/admin/logout
Authorization: Bearer <token>
```

#### Get Admin Profile
```http
GET /api/admin/profile
Authorization: Bearer <token>
```

#### Update Admin Profile
```http
PUT /api/admin/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "newemail@example.com"
}
```

#### Change Password
```http
PUT /api/admin/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass123!"
}
```

### Property Management

#### Create Property
```http
POST /api/properties/create
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- title: "Luxury Apartment"
- description: "Beautiful 3BHK apartment"
- price: 5000000
- propertyType: "APARTMENT"
- listingType: "SALE"
- bedrooms: 3
- bathrooms: 2
- area: 1200
- address: "123 Main Street"
- city: "Mumbai"
- state: "Maharashtra"
- pincode: "400001"
- mainImage: <file>
- images: <files[]>
- videos: <files[]>
- furnished: true
- parking: true
```

#### Get All Properties
```http
GET /api/properties/all?page=1&limit=10&search=apartment&city=Mumbai
Authorization: Bearer <token>
```

#### Get Property by ID
```http
GET /api/properties/:propertyId
Authorization: Bearer <token>
```

#### Update Property
```http
PUT /api/properties/:propertyId
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- title: "Updated Title"
- price: 6000000
- mainImage: <file> (optional)
```

#### Delete Property
```http
DELETE /api/properties/:propertyId
Authorization: Bearer <token>
```

#### Add Property Images
```http
POST /api/properties/:propertyId/images
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- images: <files[]>
```

#### Delete Property Image
```http
DELETE /api/properties/images/:imageId
Authorization: Bearer <token>
```

#### Toggle Property Status
```http
PATCH /api/properties/:propertyId/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "isActive": false
}
```

#### Update Property Highlight
```http
PATCH /api/properties/:propertyId/highlight
Authorization: Bearer <token>
Content-Type: application/json

{
  "highlight": "FEATURED"
}
```

## Password Requirements

Strong passwords must have:
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter  
- At least 1 number
- At least 1 special character

## File Upload Limits

- **Images**: 10MB per file, 20 files max
- **Videos**: 100MB per file, 5 files max
- **Supported formats**: 
  - Images: JPG, PNG, JPEG, WebP
  - Videos: MP4, AVI, MOV, WebM

## Property Types

- APARTMENT
- HOUSE
- VILLA
- PLOT
- COMMERCIAL
- WAREHOUSE
- OFFICE
- SHOP
- PG
- HOSTEL

## Listing Types

- SALE
- RENT
- LEASE

## Property Status

- AVAILABLE
- SOLD
- RENTED
- UNDER_NEGOTIATION
- WITHDRAWN

## Property Highlights

- NEW
- TRENDING
- FEATURED
- HOT_DEAL
- PREMIUM

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error description",
  "errors": []
}
```

## Success Responses

All successful responses follow this format:

```json
{
  "success": true,
  "statusCode": 200,
  "data": {...},
  "message": "Success message"
}
```

## Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run generate` - Generate Prisma client
- `npm run migrate` - Run database migrations
- `npm run studio` - Open Prisma Studio
- `npm run push` - Push schema to database

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Multer** - File uploads
- **Sharp** - Image processing
- **AWS SDK** - S3 integration
- **Bcrypt** - Password hashing
