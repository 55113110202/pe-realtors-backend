"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { account, databases, DATABASE_ID, COLLECTION_ID } from '@/lib/appwrite';
import { Models, Query } from 'appwrite';
import { useRouter } from 'next/navigation';

// Define user roles and permissions
export type UserRole = 'super_admin' | 'admin' | 'user';

export interface UserPermissions {
  canRead: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canApprove: boolean;
  canListUsers: boolean;
  canManageAdmins: boolean;
  canViewAnalytics: boolean;
}

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  userRole: UserRole | null;
  permissions: UserPermissions | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: keyof UserPermissions) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Role-based permissions configuration
const ROLE_PERMISSIONS: Record<UserRole, UserPermissions> = {
  super_admin: {
    canRead: true,
    canEdit: true,
    canDelete: true,
    canApprove: true,
    canListUsers: true,
    canManageAdmins: true,
    canViewAnalytics: true,
  },
  admin: {
    canRead: true,
    canEdit: true,
    canDelete: false,
    canApprove: false,
    canListUsers: false,
    canManageAdmins: false,
    canViewAnalytics: false,
  },
  user: {
    canRead: true,
    canEdit: false,
    canDelete: false,
    canApprove: false,
    canListUsers: false,
    canManageAdmins: false,
    canViewAnalytics: false,
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await account.get();
      setUser(currentUser);

      // Get user role from database or preferences
      const role = await getUserRole(currentUser.$id);
      setUserRole(role);

      // Set permissions based on role
      const userPermissions = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.user;
      setPermissions(userPermissions);

    } catch (error) {
      setUser(null);
      setUserRole(null);
      setPermissions(null);
    } finally {
      setLoading(false);
    }
  };

  const getUserRole = async (userId: string): Promise<UserRole> => {
    try {
      // Try to get role from user preferences first
      const currentUser = await account.get();
      const roleFromPrefs = currentUser.prefs?.role as UserRole;

      if (roleFromPrefs && ['super_admin', 'admin', 'user'].includes(roleFromPrefs)) {
        return roleFromPrefs;
      }

      // If no role in preferences, check if user is in admin collection
      try {
        const adminDoc = await databases.getDocument(DATABASE_ID, 'admins', userId);
        return adminDoc.role || 'admin';
      } catch {
        // User is not in admin collection
        return 'user';
      }
    } catch {
      return 'user';
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await account.createEmailPasswordSession(email, password);
      await checkUser(); // Refresh user data and permissions
      router.push('/');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
      setUserRole(null);
      setPermissions(null);
      router.push('/signin');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const hasPermission = (permission: keyof UserPermissions): boolean => {
    return permissions?.[permission] || false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      userRole,
      permissions,
      loading,
      login,
      logout,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook for easier permission checking
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Utility function for permission checking in components
export function usePermissions() {
  const { hasPermission, userRole, permissions } = useAuth();

  return {
    hasPermission,
    userRole,
    permissions,
    isSuperAdmin: userRole === 'super_admin',
    isAdmin: userRole === 'admin' || userRole === 'super_admin',
    isUser: userRole === 'user',
    canEdit: hasPermission('canEdit'),
    canApprove: hasPermission('canApprove'),
    canDelete: hasPermission('canDelete'),
    canManageAdmins: hasPermission('canManageAdmins'),
  };
}
