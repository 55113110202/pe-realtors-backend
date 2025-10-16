# PE Realtors Backoffice Dashboard

A modern, responsive backoffice dashboard for managing property listings built with Next.js 15 and Appwrite.

## Features

- 🔐 **Secure Authentication** - Email/password authentication with Appwrite
- 📊 **Dashboard Overview** - Real-time statistics and recent properties
- 🏠 **Property Management** - View, search, and filter property listings
- 🎨 **Modern UI** - Built with Tailwind CSS
- 🌙 **Dark Mode** - Full dark mode support
- 📱 **Responsive Design** - Works on all devices

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI**: Custom Dashboard with Tailwind CSS v4
- **Backend**: Appwrite Cloud
- **Authentication**: Appwrite Account API
- **Database**: Appwrite Databases API
- **State Management**: React Context API

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

### Default Login Credentials

- **Email**: perealtorsit@gmail.com
- **Password**: Hical@1767

## Project Structure

```
src/
├── app/
│   ├── (admin)/              # Protected admin routes
│   │   ├── page.tsx          # Dashboard
│   │   ├── properties/       # Properties page
│   │   └── layout.tsx        # Protected layout with auth check
│   └── (full-width-pages)/
│       └── (auth)/
│           └── signin/       # Login page
├── components/
│   ├── auth/                 # Authentication components
│   └── header/               # Header components
├── context/
│   └── AuthContext.tsx       # Authentication context
├── lib/
│   └── appwrite.ts           # Appwrite configuration
└── layout/
    ├── AppHeader.tsx         # Main header
    └── AppSidebar.tsx        # Sidebar navigation
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Appwrite Configuration

The application connects to Appwrite Cloud with the following configuration:

- **Endpoint**: https://cloud.appwrite.io/v1
- **Project ID**: perealtors
- **Database ID**: propertiesDB
- **Collection ID**: propertiesTable
- **Bucket ID**: property_photos

## Features Overview

### Dashboard (`/`)
- Total properties count
- Approved properties count
- Pending approvals count
- Listed properties count
- Recent properties table

### Properties Page (`/properties`)
- Complete property listings table
- Search by Customer ID, Property Type, or Listing Type
- Filter by Status (Approved/Pending/Rejected)
- Filter by Listing visibility (Yes/No)
- Color-coded status badges
- Responsive table design

### Authentication
- Secure login with email/password
- Session persistence
- Automatic redirect to login when not authenticated
- Logout functionality

## License

This project is private and proprietary to PE Realtors.

## Support

For support, please contact the development team.
