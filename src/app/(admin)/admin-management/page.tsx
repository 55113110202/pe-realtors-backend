"use client";

import AdminManagement from '@/components/admin/AdminManagement';

export default function AdminManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white/90">
          Admin Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage admin users and their permissions
        </p>
      </div>

      <AdminManagement />
    </div>
  );
}