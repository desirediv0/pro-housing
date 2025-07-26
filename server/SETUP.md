# Pro Housing Server Setup Guide

## 🚨 Current Issues Fixed

1. **Admin Authentication Error**: Missing JWT secrets in environment variables
2. **Analytics Error**: Null property reference in recent activities

## 🚀 Quick Setup

### 1. Environment Configuration

Run the setup script to create your `.env` file:

```bash
npm run setup-env
```

This will:

- Generate secure JWT secrets
- Create a `.env` file with all required variables
- Set up default configurations

### 2. Database Setup

1. **Install PostgreSQL** if not already installed
2. **Create a database**:
   ```sql
   CREATE DATABASE prohousing;
   ```
3. **Update DATABASE_URL** in your `.env` file:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/prohousing?schema=public"
   ```

### 3. Database Migration

```bash
# Generate Prisma client
npm run generate

# Push schema to database
npm run push
```

### 4. Create Demo Data

```bash
# Create demo admin and properties
npm run setup
```

This will create:

- **Demo Admin**: `admin@prohousing.com` / `AdminPass123!`
- **Sample Properties**: 10+ properties with images

### 5. Start the Server

```bash
npm start
```

Server will run on: `http://localhost:4001`

## 🔧 Manual Setup (Alternative)

If you prefer manual setup:

### 1. Create `.env` file manually:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/prohousing?schema=public"

# JWT Secrets (Generate these securely)
ACCESS_JWT_SECRET="your-super-secret-access-jwt-key-here-make-it-long-and-random"
REFRESH_TOKEN_SECRET="your-super-secret-refresh-jwt-key-here-make-it-long-and-random"

# JWT Token Life
ACCESS_TOKEN_LIFE="1h"
REFRESH_TOKEN_LIFE="7d"

# Server Configuration
PORT=4001
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN="http://localhost:3000,http://localhost:3001"

# File Upload Configuration
UPLOAD_FOLDER="prohousing"
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES="jpg,jpeg,png,gif,webp,pdf,doc,docx"
```

### 2. Generate JWT Secrets:

```bash
# Generate secure secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Create Admin Account:

```bash
npm run create-admin
```

### 4. Seed Properties:

```bash
npm run seed
```

## 🔑 Admin Login Credentials

After running the setup:

- **Email**: `admin@prohousing.com`
- **Password**: `AdminPass123!`
- **Login URL**: `http://localhost:3000/admin/login`

## 🐛 Troubleshooting

### Admin Authentication Error

If you see "Admin authentication error":

1. **Check JWT secrets** in `.env` file
2. **Verify database connection**
3. **Ensure admin account exists**:
   ```bash
   npm run create-admin
   ```

### Database Connection Error

1. **Verify PostgreSQL is running**
2. **Check DATABASE_URL** in `.env`
3. **Test connection**:
   ```bash
   npm run studio
   ```

### Port Already in Use

Change the port in `.env`:

```env
PORT=4002
```

## 📁 File Structure

```
server/
├── .env                    # Environment variables
├── setup-env.js           # Environment setup script
├── scripts/
│   └── createDemoAdmin.js # Demo admin creation
├── seed-properties.js     # Property seeding
└── prisma/
    └── schema.prisma      # Database schema
```

## 🔄 Development Commands

```bash
# Start development server
npm run dev

# Generate Prisma client
npm run generate

# Open Prisma Studio
npm run studio

# Database migrations
npm run migrate

# Push schema changes
npm run push
```

## 📞 Support

If you encounter issues:

1. Check the console logs for specific error messages
2. Verify all environment variables are set
3. Ensure database is running and accessible
4. Check if all dependencies are installed: `npm install`

## ✅ Verification

After setup, verify everything works:

1. **Server starts** without errors
2. **Admin login** works at `http://localhost:3000/admin/login`
3. **API endpoints** respond correctly
4. **Database** contains admin and properties

---

**Note**: This setup fixes the admin authentication and analytics errors you were experiencing.
