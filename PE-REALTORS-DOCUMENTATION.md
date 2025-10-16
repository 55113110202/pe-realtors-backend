# PE Realtors Project Documentation

## Overview
This project is a real estate application built using Appwrite as the backend service. It manages property listings for PE Realtors with a backoffice dashboard for administration.

---

## ⚙️ Appwrite Configuration

**Endpoint:** `https://cloud.appwrite.io/v1`  
**Project ID:** `perealtors`  
**Organization ID:** `68efe23c00358cf845ef`  
**Database ID:** `propertiesDB`  
**Table ID:** `propertiesTable`  
**Bucket ID:** `property_photos`

---

## 🔑 Admin Credentials

Use these credentials for Appwrite Console or Backoffice Dashboard login.

| Role | User ID | Email | Password | Name |
|------|---------|-------|----------|------|
| Super Admin | mohands | perealtorsit@gmail.com | Hical@1767 | super admin |

---

## 🗃️ Database Structure (propertiesDB → propertiesTable)

### Required Fields

| Field | Type | Notes |
|-------|------|-------|
| propertyType | string(50) | Residential / Commercial |
| listingType | string(50) | Rent / Lease |
| custId | string(20) | Customer ID (from mobile) |
| status | string(20) | Approval status |
| listing | string(10) | Visibility (Yes/No) |

### Optional Fields

| Field | Type | Notes |
|-------|------|-------|
| rentPerMonth | integer | Monthly rent |
| advanceAmount | integer | Advance amount |
| leaseAmount | integer | Lease amount |
| contractMonths | integer | Lease duration (months) |
| facing | string(50) | Facing direction |
| floors | integer | No. of floors |
| description | string(1000) | Description |
| photos | string array(500 each) | Array of image file IDs |

---

## 🧰 Storage Bucket (property_photos)

| Setting | Value |
|---------|-------|
| File Security | Enabled |
| Max File Size | 50 MB |
| Allowed Extensions | jpg, png |
| Compression | gzip |
| Encryption | Enabled |
| Antivirus | Enabled |

---

## 🧩 Config File (appwrite.config.json)

```json
{
  "projectId": "perealtors",
  "projectName": "perealtors",
  "endpoint": "https://cloud.appwrite.io/v1"
}
```

---

## Getting Started

1. Clone the repository
2. Install Appwrite CLI globally
3. Login to Appwrite
4. Initialize the project (if needed)
5. Start developing

---

## Frontend Setup

### Clone and Setup Dashboard

```bash
git clone https://github.com/TailAdmin/free-nextjs-admin-dashboard.git perealtors-ui
cd perealtors-ui
npm install
npm install appwrite
npm run dev
```

The dashboard will be available at `http://localhost:3000`

### Environment Variables

Create a `.env.local` file in the `perealtors-ui` directory (optional, as values are hardcoded):

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=perealtors
NEXT_PUBLIC_APPWRITE_DATABASE_ID=propertiesDB
NEXT_PUBLIC_APPWRITE_COLLECTION_ID=propertiesTable
NEXT_PUBLIC_APPWRITE_BUCKET_ID=property_photos
```

---

## Appwrite CLI Commands Reference

### Install Appwrite CLI

```bash
npm install -g appwrite
```

### Login

```bash
appwrite login
```

### Initialize Project

```bash
appwrite init project --project-id perealtors --organization-id 68efe23c00358cf845ef
```

### Create Database

```bash
appwrite databases create --database-id propertiesDB --name "Properties Database"
```

### Create Table

```bash
appwrite tables-db create-table --database-id propertiesDB --table-id propertiesTable --name "Properties Table"
```

### Check Projects

```bash
appwrite projects list
```

### Check Databases

```bash
appwrite databases list
```

### Check Tables

```bash
appwrite tables-db list-tables --database-id propertiesDB
```

### Create Columns

#### Required Fields

```bash
appwrite tables-db create-string-column --database-id propertiesDB --table-id propertiesTable --key propertyType --size 50 --required true
appwrite tables-db create-string-column --database-id propertiesDB --table-id propertiesTable --key listingType --size 50 --required true
appwrite tables-db create-string-column --database-id propertiesDB --table-id propertiesTable --key custId --size 20 --required true
appwrite tables-db create-string-column --database-id propertiesDB --table-id propertiesTable --key status --size 20 --required true
appwrite tables-db create-string-column --database-id propertiesDB --table-id propertiesTable --key listing --size 10 --required true
```

#### Optional Fields

```bash
appwrite tables-db create-integer-column --database-id propertiesDB --table-id propertiesTable --key rentPerMonth --required false
appwrite tables-db create-integer-column --database-id propertiesDB --table-id propertiesTable --key advanceAmount --required false
appwrite tables-db create-integer-column --database-id propertiesDB --table-id propertiesTable --key leaseAmount --required false
appwrite tables-db create-integer-column --database-id propertiesDB --table-id propertiesTable --key contractMonths --required false
appwrite tables-db create-string-column --database-id propertiesDB --table-id propertiesTable --key facing --size 50 --required false
appwrite tables-db create-integer-column --database-id propertiesDB --table-id propertiesTable --key floors --required false
appwrite tables-db create-string-column --database-id propertiesDB --table-id propertiesTable --key description --size 1000 --required false
appwrite tables-db create-string-column --database-id propertiesDB --table-id propertiesTable --key photos --size 500 --required false --array true
```

### Create Storage Bucket

```bash
appwrite storage create-bucket --bucket-id property_photos --name "Property Photos" --file-security true --enabled true
```

### Check Storage Buckets

```bash
appwrite storage list-buckets
```

---

## Backoffice Dashboard Setup

### Installation Steps

1. **Clone the repository**

```bash
git clone https://github.com/arhamkhnz/next-shadcn-admin-dashboard.git perealtors-backoffice
cd perealtors-backoffice
```

2. **Install dependencies**

```bash
npm install
npm install appwrite
```

3. **Run the development server**

```bash
npm run dev
```

The dashboard will be available at `http://localhost:3000`

---

## Features Implemented ✅

### ✅ Authentication
- Login page at `/signin` (default route when not authenticated)
- Email/password authentication via Appwrite
- Session persistence with automatic session check
- Protected dashboard routes with redirect to login
- Logout functionality in user dropdown menu

### ✅ Dashboard Overview (`/`)
- Summary cards showing:
  - Total Properties
  - Approved Properties
  - Pending Approvals
  - Listed Properties
- Recent properties table with latest 5 entries
- Real-time data from Appwrite database

### ✅ Properties Management (`/properties`)
- View all properties in a comprehensive table
- Search by Customer ID, Property Type, or Listing Type
- Filter by Status (Approved/Pending/Rejected)
- Filter by Listing (Yes/No)
- Color-coded status badges
- Responsive design for all screen sizes

### ✅ Navigation
- Simplified sidebar with:
  - Dashboard (home)
  - Properties (main table)
- User dropdown with:
  - User name and email display
  - Logout button
- Dark mode toggle
- Responsive mobile menu

---

## Default Login Credentials

Use the super admin credentials to login:

- **Email**: perealtorsit@gmail.com
- **Password**: Hical@1767

---

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI**: Custom Dashboard with Tailwind CSS
- **Backend**: Appwrite Cloud
- **Styling**: Tailwind CSS v4
- **State**: React Context API
- **Authentication**: Appwrite Account API
- **Database**: Appwrite Databases API

---

## Project Structure

```
perealtors/
├── perealtors-ui/          # Backoffice Dashboard (Next.js + Tailwind CSS)
│   ├── src/
│   │   ├── app/
│   │   │   ├── (admin)/
│   │   │   │   ├── page.tsx           # Dashboard
│   │   │   │   ├── properties/
│   │   │   │   │   └── page.tsx       # Properties page
│   │   │   │   └── layout.tsx         # Protected layout
│   │   │   └── (full-width-pages)/
│   │   │       └── (auth)/
│   │   │           └── signin/
│   │   │               └── page.tsx   # Login page
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   └── SignInForm.tsx     # Login form
│   │   │   └── header/
│   │   │       └── UserDropdown.tsx   # User menu with logout
│   │   ├── context/
│   │   │   └── AuthContext.tsx        # Authentication context
│   │   ├── lib/
│   │   │   └── appwrite.ts            # Appwrite configuration
│   │   └── layout/
│   │       ├── AppHeader.tsx
│   │       └── AppSidebar.tsx
│   └── package.json
└── appwrite.config.json    # Appwrite configuration
```

---

## Quick Start Guide

1. **Start the development server**

```bash
cd perealtors-ui
npm run dev
```

2. **Access the application**

Open your browser and navigate to `http://localhost:3000`

3. **Login**

You will be redirected to the login page. Use the admin credentials:
- Email: `perealtorsit@gmail.com`
- Password: `Hical@1767`

4. **Navigate the dashboard**

After successful login, you'll see:
- Dashboard with property statistics
- Properties page with full property list
- Search and filter capabilities

---

## Important Notes

- All property photos are stored in the `property_photos` bucket
- Photos are referenced in the database as an array of file IDs
- Property approval workflow: Pending → Approved/Rejected
- Listing visibility is controlled separately from approval status
- Customer IDs come from the mobile application

---

## Support & Maintenance

For any issues or questions regarding the PE Realtors project, refer to this documentation or contact the development team.

**Last Updated**: October 16, 2025
