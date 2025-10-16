"use client";

import { useEffect, useState } from "react";
import { databases, storage, DATABASE_ID, COLLECTION_ID, BUCKET_ID } from "@/lib/appwrite";
import { Query } from "appwrite";
import PropertyEditModal from "@/components/properties/PropertyEditModal";

interface Property {
  $id: string;
  propertyType: string;
  listingType: string;
  custId: string;
  status: string;
  listing: string;
  rentPerMonth?: number;
  advanceAmount?: number;
  leaseAmount?: number;
  contractMonths?: number;
  facing?: string;
  floors?: number;
  description?: string;
  photos?: string[];
  $createdAt: string;
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [listingFilter, setListingFilter] = useState("all");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [Query.orderDesc("$createdAt"), Query.limit(100)]
      );
      setProperties(response.documents as unknown as Property[]);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    setIsEditModalOpen(true);
  };

  const handleSaveProperty = async (updatedProperty: Property) => {
    try {
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        updatedProperty.$id,
        {
          propertyType: updatedProperty.propertyType,
          listingType: updatedProperty.listingType,
          custId: updatedProperty.custId,
          status: updatedProperty.status,
          listing: updatedProperty.listing,
          rentPerMonth: updatedProperty.rentPerMonth,
          advanceAmount: updatedProperty.advanceAmount,
          leaseAmount: updatedProperty.leaseAmount,
          contractMonths: updatedProperty.contractMonths,
          facing: updatedProperty.facing,
          floors: updatedProperty.floors,
          description: updatedProperty.description,
        }
      );
      // Refresh properties list
      fetchProperties();
    } catch (error) {
      console.error("Error updating property:", error);
    }
  };

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.custId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.propertyType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.listingType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || property.status === statusFilter;

    const matchesListing =
      listingFilter === "all" || property.listing === listingFilter;

    return matchesSearch && matchesStatus && matchesListing;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Properties</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage all property listings
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Properties
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {properties.length}
              </p>
            </div>
            <div className="p-3 bg-brand-50 rounded-lg dark:bg-brand-900/20">
              <svg className="w-6 h-6 text-brand-600 dark:text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Approved
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {properties.filter((p) => p.status === "Approved").length}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg dark:bg-green-900/20">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Pending
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {properties.filter((p) => p.status === "Pending").length}
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg dark:bg-yellow-900/20">
              <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Listed
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {properties.filter((p) => p.listing === "Yes").length}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg dark:bg-blue-900/20">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by Customer ID, Type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg dark:border-gray-800 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg dark:border-gray-800 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Status</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Listing
            </label>
            <select
              value={listingFilter}
              onChange={(e) => setListingFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg dark:border-gray-800 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Listings</option>
              <option value="Yes">Listed</option>
              <option value="No">Not Listed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Customer ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Property Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Listing Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Listed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filteredProperties.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No properties found
                  </td>
                </tr>
              ) : (
                filteredProperties.map((property) => (
                  <tr 
                    key={property.$id} 
                    onClick={() => handlePropertyClick(property)}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {property.custId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {property.propertyType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {property.listingType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          property.status === "Approved"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                            : property.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                        }`}
                      >
                        {property.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          property.listing === "Yes"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                      >
                        {property.listing}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(property.$createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <PropertyEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        property={selectedProperty}
        onSave={handleSaveProperty}
      />
    </div>
  );
}
