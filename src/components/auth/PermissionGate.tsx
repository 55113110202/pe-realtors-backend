"use client";

import React from 'react';
import { usePermissions } from '@/context/AuthContext';

interface PermissionGateProps {
  children: React.ReactNode;
  permissions?: Array<keyof import('@/context/AuthContext').UserPermissions>;
  requireAll?: boolean; // If true, user must have ALL permissions. If false, user needs ANY of the permissions
  fallback?: React.ReactNode;
}

/**
 * PermissionGate component - conditionally renders children based on user permissions
 *
 * @param children - Content to render if user has required permissions
 * @param permissions - Array of permission keys to check
 * @param requireAll - If true, user must have ALL permissions. If false, user needs ANY permission
 * @param fallback - Content to render if user lacks permissions
 */
export default function PermissionGate({
  children,
  permissions = [],
  requireAll = false,
  fallback = null
}: PermissionGateProps) {
  const { hasPermission } = usePermissions();

  // If no permissions specified, render children (no restrictions)
  if (permissions.length === 0) {
    return <>{children}</>;
  }

  // Check if user has required permissions
  const hasAccess = requireAll
    ? permissions.every(permission => hasPermission(permission))
    : permissions.some(permission => hasPermission(permission));

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

// Convenience components for common permission checks
export function AdminOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <PermissionGate permissions={['canEdit']} fallback={fallback}>
      {children}
    </PermissionGate>
  );
}

export function SuperAdminOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const { isSuperAdmin } = usePermissions();

  return isSuperAdmin ? <>{children}</> : <>{fallback}</>;
}

export function EditPermissionRequired({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <PermissionGate permissions={['canEdit']} fallback={fallback}>
      {children}
    </PermissionGate>
  );
}

export function ApprovalPermissionRequired({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <PermissionGate permissions={['canApprove']} fallback={fallback}>
      {children}
    </PermissionGate>
  );
}