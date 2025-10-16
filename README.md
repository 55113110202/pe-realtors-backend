# PE Realtors Backend

A comprehensive real estate management platform built with Next.js, Appwrite, and role-based access control.

## 🚀 Features

### ✅ **Core Features Implemented**

- **🔐 Authentication System** - Secure login/logout with Appwrite
- **👥 Role-Based Access Control (RBAC)** - Super admin, admin, and user roles
- **🏠 Property Management** - Create, edit, and manage property listings
- **📸 Image Management** - Appwrite storage integration with fallback handling
- **👨‍💼 Admin Management** - Super admins can create and manage admin users
- **🎨 Modern UI** - Beautiful, responsive design with dark mode support
- **📱 Mobile Responsive** - Works perfectly on all devices

### **🔧 Technical Stack**

- **Frontend:** Next.js 15, React 19, TypeScript
- **Backend:** Appwrite (Database, Storage, Authentication)
- **Styling:** Tailwind CSS
- **Icons:** Custom SVG icons
- **State Management:** React Context API
- **Form Handling:** Custom form components

## 📋 **Project Structure**

```
pe-realtors-backend/
├── perealtors-ui/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/                   # Next.js app router
│   │   │   ├── (admin)/          # Admin-only pages
│   │   │   │   ├── admin-management/  # Admin user management
│   │   │   │   └── properties/   # Property management
│   │   │   └── (full-width-pages)/ # Auth pages
│   │   ├── components/           # Reusable components
│   │   │   ├── admin/           # Admin management components
│   │   │   ├── auth/            # Authentication components
│   │   │   ├── properties/      # Property-related components
│   │   │   └── ui/              # Base UI components
│   │   ├── context/             # React contexts
│   │   └── lib/                 # Utilities and configurations
│   └── public/                  # Static assets
├── APPWRITE-TROUBLESHOOTING.md   # Appwrite setup guide
├── ROLE-BASED-ACCESS-CONTROL.md # RBAC implementation guide
├── to display photos.md         # Image handling solution
└── README.md                    # This file
```

## 🔐 **Role-Based Access Control**

### **User Roles:**

| Role | Permissions | Description |
|------|-------------|-------------|
| **Super Admin** | Full access | Can manage all users, approve properties, view analytics |
| **Admin** | Read + Edit | Can manage properties and forms, cannot approve or manage users |
| **User** | Read only | Basic access to view information |

### **Permission Matrix:**

| Feature | Super Admin | Admin | User |
|---------|-------------|-------|------|
| View Properties | ✅ | ✅ | ✅ |
| Edit Properties | ✅ | ✅ | ❌ |
| Delete Properties | ✅ | ❌ | ❌ |
| Approve Properties | ✅ | ❌ | ❌ |
| Manage Admin Users | ✅ | ❌ | ❌ |
| View Analytics | ✅ | ❌ | ❌ |

## 🚀 **Quick Start**

### **Prerequisites:**
- Node.js 18+
- Appwrite account and project
- GitHub account

### **1. Clone the Repository:**
```bash
git clone https://github.com/55113110202/pe-realtors-backend.git
cd pe-realtors-backend
```

### **2. Frontend Setup:**
```bash
cd perealtors-ui
npm install
cp .env.example .env.local
# Edit .env.local with your Appwrite credentials
```

### **3. Appwrite Configuration:**
1. Create a new project in Appwrite
2. Create a database called `propertiesDB`
3. Create collections:
   - `propertiesTable` - For property listings
   - `admins` - For admin user management
4. Create a storage bucket called `property_photos`
5. Set up authentication with email/password

### **4. Environment Variables:**
```env
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
NEXT_PUBLIC_APPWRITE_COLLECTION_ID=your_collection_id
NEXT_PUBLIC_APPWRITE_BUCKET_ID=your_bucket_id
```

### **5. Run Development Server:**
```bash
cd perealtors-ui
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📚 **Documentation**

### **📖 Implementation Guides:**
- **[APPWRITE-TROUBLESHOOTING.md](./APPWRITE-TROUBLESHOOTING.md)** - Appwrite setup and configuration
- **[ROLE-BASED-ACCESS-CONTROL.md](./ROLE-BASED-ACCESS-CONTROL.md)** - Complete RBAC system documentation
- **[to display photos.md](./to display photos.md)** - Image handling and Appwrite storage solution

### **🔧 Key Features Documented:**

1. **Appwrite Integration**
   - Database setup and configuration
   - Storage bucket management
   - Authentication flow

2. **Role-Based Access Control**
   - User role management
   - Permission system
   - Admin user creation

3. **Image Management**
   - Appwrite storage integration
   - Free plan compatibility
   - Error handling and fallbacks

## 🎯 **Usage Examples**

### **Creating Admin Users:**
1. Log in as super admin
2. Navigate to `/admin-management`
3. Click "Add New Admin"
4. Fill in details and select role
5. Admin user will be created with appropriate permissions

### **Managing Properties:**
1. Admin users can access property management
2. Create, edit, and update property listings
3. Upload and manage property photos
4. Super admins can approve properties

### **Permission Checking in Components:**
```tsx
import { usePermissions } from '@/context/AuthContext';

function MyComponent() {
  const { canEdit, isAdmin, hasPermission } = usePermissions();

  if (hasPermission('canEdit')) {
    return <EditButton />;
  }

  return <ViewOnly />;
}
```

## 🔧 **Development**

### **Available Scripts:**
```bash
# Frontend
cd perealtors-ui
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### **Code Organization:**
- **Components:** Reusable UI components in `src/components/`
- **Pages:** Route handlers in `src/app/`
- **Context:** Global state management in `src/context/`
- **Utils:** Helper functions in `src/lib/`

## 🚨 **Troubleshooting**

### **Common Issues:**

1. **403 Forbidden on Images:**
   - Use `getFileView()` instead of `getFilePreview()`
   - Ensure storage bucket has public read permissions
   - Check if files exist in the bucket

2. **Permission Errors:**
   - Verify user role in Appwrite console
   - Check if user exists in `admins` collection
   - Ensure proper authentication

3. **Build Errors:**
   - Clear `.next` folder and reinstall dependencies
   - Check Node.js version compatibility
   - Verify all environment variables are set

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 **License**

This project is private and proprietary to PE Realtors.

## 🆘 **Support**

For support and questions:
- Check the troubleshooting documentation
- Review the implementation guides
- Ensure Appwrite configuration is correct

---

**Built with ❤️ for PE Realtors**