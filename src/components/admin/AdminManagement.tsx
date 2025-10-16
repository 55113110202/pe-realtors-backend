"use client";

import React, { useState, useEffect } from 'react';
import { usePermissions } from '@/context/AuthContext';
import { account, databases, DATABASE_ID } from '@/lib/appwrite';
import { ID, Models } from 'appwrite';
import Button from '@/components/ui/button/Button';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';

interface AdminUser extends Models.Document {
  userId: string;
  email: string;
  role: 'admin' | 'super_admin';
  name: string;
  createdAt: string;
  createdBy: string;
}

export default function AdminManagement() {
  const { isSuperAdmin } = usePermissions();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    email: '',
    name: '',
    role: 'admin' as 'admin' | 'super_admin'
  });

  // Super admin only can access this component
  if (!isSuperAdmin) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 dark:text-red-400">
          Access denied. Only super administrators can manage admin users.
        </p>
      </div>
    );
  }

  useEffect(() => {
    if (isSuperAdmin) {
      loadAdmins();
    }
  }, [isSuperAdmin]);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const response = await databases.listDocuments(
        DATABASE_ID,
        'admins'
      );
      setAdmins(response.documents as unknown as AdminUser[]);
    } catch (error) {
      console.error('Error loading admins:', error);
    } finally {
      setLoading(false);
    }
  };

  const createAdminUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newAdmin.email || !newAdmin.name) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);

      // Create the user account first
      const user = await account.create(
        ID.unique(),
        newAdmin.email,
        'temp_password_123', // You should generate a secure temporary password
        newAdmin.name
      );

      // Create admin document
      await databases.createDocument(
        DATABASE_ID,
        'admins',
        user.$id,
        {
          userId: user.$id,
          email: newAdmin.email,
          role: newAdmin.role,
          name: newAdmin.name,
          createdBy: 'current_user_id', // You should get this from auth context
        }
      );

      // Set user role in preferences
      await account.updatePrefs({
        role: newAdmin.role,
      });

      setNewAdmin({ email: '', name: '', role: 'admin' });
      setShowAddForm(false);
      loadAdmins();

      alert(`Admin user created successfully! Temporary password: temp_password_123`);

    } catch (error) {
      console.error('Error creating admin:', error);
      alert('Error creating admin user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeAdmin = async (adminId: string) => {
    if (!confirm('Are you sure you want to remove this admin?')) {
      return;
    }

    try {
      setLoading(true);
      await databases.deleteDocument(DATABASE_ID, 'admins', adminId);
      loadAdmins();
      alert('Admin removed successfully');
    } catch (error) {
      console.error('Error removing admin:', error);
      alert('Error removing admin. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
          Admin Management
        </h2>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          disabled={loading}
        >
          Add New Admin
        </Button>
      </div>

      {showAddForm && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg dark:border-gray-700">
          <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-white/90">
            Create New Admin
          </h3>
          <form onSubmit={createAdminUser} className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                type="text"
                defaultValue={newAdmin.name}
                onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                placeholder="Enter admin name"
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                defaultValue={newAdmin.email}
                onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                placeholder="Enter admin email"
              />
            </div>

            <div>
              <Label>Role</Label>
              <select
                value={newAdmin.role}
                onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value as 'admin' | 'super_admin' })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              >
                <option value="admin">Admin (can read/edit forms, cannot approve or manage other admins)</option>
                <option value="super_admin">Super Admin (full access)</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Admin'}
              </button>
              <Button
                variant="outline"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white/90">
          Current Admins ({admins.length})
        </h3>

        {loading && <p>Loading admins...</p>}

        {!loading && admins.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400">No admins found.</p>
        )}

        {admins.map((admin) => (
          <div
            key={admin.$id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-700"
          >
            <div>
              <h4 className="font-medium text-gray-800 dark:text-white/90">
                {admin.name}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {admin.email} • Role: {admin.role}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Created: {new Date(admin.$createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex gap-2">
              <span className={`px-2 py-1 text-xs rounded-full ${
                admin.role === 'super_admin'
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
              }`}>
                {admin.role}
              </span>

              {admin.role !== 'super_admin' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removeAdmin(admin.$id)}
                  disabled={loading}
                  className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
          Admin Role Permissions
        </h4>
        <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
          <div><strong>Admin:</strong> Can read and edit forms, update database</div>
          <div><strong>Super Admin:</strong> Full access including user management and approvals</div>
        </div>
      </div>
    </div>
  );
}