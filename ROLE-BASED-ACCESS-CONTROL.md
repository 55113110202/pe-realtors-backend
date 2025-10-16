# Role-Based Access Control (RBAC) System

## Overview
This document describes the role-based access control system implemented for the PE Realtors application, allowing super administrators to create admin users with restricted permissions.

## User Roles and Permissions

### Role Hierarchy
1. **Super Admin** - Full system access
2. **Admin** - Can read and edit forms, update database (cannot approve or manage other admins)
3. **User** - Basic read-only access

### Permission Matrix

| Permission | Super Admin | Admin | User |
|------------|-------------|-------|------|
| canRead | ✅ | ✅ | ✅ |
| canEdit | ✅ | ✅ | ❌ |
| canDelete | ✅ | ❌ | ❌ |
| canApprove | ✅ | ❌ | ❌ |
| canListUsers | ✅ | ❌ | ❌ |
| canManageAdmins | ✅ | ❌ | ❌ |
| canViewAnalytics | ✅ | ❌ | ❌ |

## Implementation Details

### 1. Enhanced Authentication Context

The `AuthContext` has been extended to include role-based permissions:

```typescript
interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  userRole: UserRole | null;
  permissions: UserPermissions | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: keyof UserPermissions) => boolean;
}
```

### 2. Role Detection Logic

User roles are determined in the following order:
1. Check user preferences for stored role
2. Query the `admins` collection in the database
3. Default to `user` role if not found

```typescript
const getUserRole = async (userId: string): Promise<UserRole> => {
  try {
    // Check user preferences first
    const currentUser = await account.get();
    const roleFromPrefs = currentUser.prefs?.role as UserRole;

    if (roleFromPrefs && ['super_admin', 'admin', 'user'].includes(roleFromPrefs)) {
      return roleFromPrefs;
    }

    // Check admin collection
    try {
      const adminDoc = await databases.getDocument(DATABASE_ID, 'admins', userId);
      return adminDoc.role || 'admin';
    } catch {
      return 'user';
    }
  } catch {
    return 'user';
  }
};
```

### 3. Permission-Based Components

#### PermissionGate Component
Conditionally renders content based on user permissions:

```tsx
<PermissionGate permissions={['canEdit', 'canApprove']} requireAll={false}>
  <EditButton />
</PermissionGate>
```

#### Convenience Components
Pre-built components for common permission checks:

```tsx
// Only admins can see edit functionality
<EditPermissionRequired>
  <EditControls />
</EditPermissionRequired>

// Only super admins can manage other admins
<SuperAdminOnly>
  <AdminManagement />
</SuperAdminOnly>
```

## Usage Examples

### 1. Protecting Routes/Components

```tsx
import { usePermissions } from '@/context/AuthContext';

function PropertyEditForm() {
  const { canEdit, isAdmin } = usePermissions();

  if (!isAdmin) {
    return <div>Access denied. Admin privileges required.</div>;
  }

  return (
    <form>
      {/* Edit form content */}
    </form>
  );
}
```

### 2. Conditional UI Elements

```tsx
import { PermissionGate } from '@/components/auth/PermissionGate';

function PropertyCard({ property }) {
  return (
    <div>
      <h3>{property.title}</h3>

      {/* Only admins can see edit button */}
      <PermissionGate permissions={['canEdit']}>
        <button>Edit Property</button>
      </PermissionGate>

      {/* Only super admins can see approval controls */}
      <PermissionGate permissions={['canApprove']}>
        <button>Approve Property</button>
      </PermissionGate>
    </div>
  );
}
```

### 3. Admin Management Interface

Super administrators can create and manage admin users:

```tsx
import AdminManagement from '@/components/admin/AdminManagement';

function AdminPage() {
  return (
    <SuperAdminOnly fallback={<div>Access denied</div>}>
      <AdminManagement />
    </SuperAdminOnly>
  );
}
```

## Database Schema

### Admins Collection
```typescript
interface AdminDocument {
  $id: string;
  userId: string;        // Appwrite user ID
  email: string;
  role: 'admin' | 'super_admin';
  name: string;
  createdAt: string;
  createdBy: string;
}
```

## Setup Instructions

### 1. Create Database Collection
Create an `admins` collection in your Appwrite database with the following structure:
- **userId** (string) - Appwrite user ID
- **email** (string) - User email
- **role** (enum) - 'admin' or 'super_admin'
- **name** (string) - Display name
- **createdBy** (string) - Who created this admin

### 2. Set User Role in Preferences
When creating admin users, set their role in user preferences:

```typescript
await account.updatePrefs({
  role: 'admin' // or 'super_admin'
});
```

### 3. Configure Permissions
Ensure your Appwrite collections have appropriate read/write permissions for different roles.

## Security Considerations

### 1. Server-Side Validation
Always validate permissions on the server-side, not just in the UI.

### 2. API Key Protection
Store Appwrite API keys securely and never expose them in client-side code.

### 3. Session Management
Implement proper session validation and automatic logout for security.

### 4. Audit Logging
Consider implementing audit logs for admin actions.

## Best Practices

### 1. Principle of Least Privilege
Grant users only the permissions they need to perform their tasks.

### 2. Regular Permission Reviews
Regularly review and update user permissions as roles change.

### 3. Clear User Feedback
Provide clear feedback when users attempt actions they don't have permission for.

### 4. Graceful Degradation
Design the UI to gracefully handle missing permissions rather than breaking.

## Troubleshooting

### Common Issues

1. **User role not detected**
   - Check if user exists in `admins` collection
   - Verify role is set in user preferences
   - Check database/collection permissions

2. **Permission checks not working**
   - Ensure AuthProvider wraps your component tree
   - Check that user is properly authenticated
   - Verify role permissions configuration

3. **Admin management not accessible**
   - Confirm user has `super_admin` role
   - Check if `AdminManagement` component is properly imported
   - Verify database/collection setup

## File Structure

```
src/
├── context/
│   └── AuthContext.tsx          # Enhanced with RBAC
├── components/
│   ├── admin/
│   │   └── AdminManagement.tsx  # Admin user management
│   └── auth/
│       └── PermissionGate.tsx   # Permission checking components
└── app/(admin)/
    └── admin-management/
        └── page.tsx             # Admin management page
```

## Future Enhancements

1. **Granular Permissions** - More specific permissions for different modules
2. **Permission Templates** - Predefined permission sets for common roles
3. **Audit Logging** - Track admin actions for compliance
4. **Bulk Permission Management** - Manage permissions for multiple users
5. **Time-Based Permissions** - Temporary permissions for specific tasks

## Conclusion

This RBAC system provides a solid foundation for managing user permissions in the PE Realtors application. It allows super administrators to create admin users with restricted permissions while maintaining security and providing a good user experience.

The system is designed to be extensible and can be easily modified to accommodate additional roles and permissions as the application grows.