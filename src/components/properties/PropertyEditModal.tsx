"use client";
import React, { useState, useEffect } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Select from "../form/Select";
import Image from "next/image";
import { storage, BUCKET_ID } from "@/lib/appwrite";

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

interface PropertyEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
  onSave: (property: Property) => void;
}

export default function PropertyEditModal({
  isOpen,
  onClose,
  property,
  onSave,
}: PropertyEditModalProps) {
  const [formData, setFormData] = useState<Property | null>(property);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState<boolean>(false);

  // Update formData when property changes
  useEffect(() => {
    if (property) {
      setFormData(property);
      
      // Convert photo IDs to URLs
      if (property.photos && property.photos.length > 0) {
        const loadPhotoUrls = async () => {
          setLoadingPhotos(true);

          // Debug: Log the photo IDs we're trying to load
          console.log('Attempting to load photos:', property.photos);
          console.log('Bucket ID:', BUCKET_ID);

          // Test Appwrite storage access
          try {
            const files = await storage.listFiles(BUCKET_ID);
            console.log('Files in bucket:', files);
          } catch (storageError) {
            console.error('Storage access test failed:', storageError);
          }

          try {
            const urls = await Promise.all(
              property.photos!
                .filter((photo) => photo && typeof photo === 'string' && photo.trim() !== "")
                .map(async (photo) => {
                  // If it's already a full URL, use it
                  if (photo.startsWith('http://') || photo.startsWith('https://')) {
                    return photo;
                  }
                  try {
                    // Use getFileView() instead of getFilePreview() to avoid transformation restrictions
                    const fileViewUrl = storage.getFileView(BUCKET_ID, photo);
                    return fileViewUrl;
                  } catch (error) {
                    console.error('getFileView failed, using direct download URL:', error);
                    // Fallback to direct download URL (no transformations)
                    return `https://cloud.appwrite.io/v1/storage/buckets/${BUCKET_ID}/files/${photo}/download?project=perealtors`;
                  }
                })
            );

            setPhotoUrls(urls.filter((url): url is string => url !== null));
          } catch (error) {
            console.error('Error loading photos:', error);
            setPhotoUrls([]);
          } finally {
            setLoadingPhotos(false);
          }
        };

        loadPhotoUrls();
      } else {
        setPhotoUrls([]);
      }
    }
  }, [property]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    if (!formData) return;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = () => {
    if (formData) {
      onSave(formData);
      onClose();
    }
  };

  if (!property || !formData) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[900px] m-4">
      <div className="relative w-full max-w-[900px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-8">
        <div className="px-2 pr-14 mb-6">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Edit Property
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Update property details and photos
          </p>
        </div>

        <div className="custom-scrollbar max-h-[600px] overflow-y-auto px-2 pb-3">
          {/* Photos Section */}
          <div className="mb-6">
            <Label>Property Photos</Label>

            {loadingPhotos && (
              <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                Loading photos...
              </div>
            )}

            {photoUrls.length > 0 && !loadingPhotos && (
              <div className="grid grid-cols-2 gap-4 mt-3 md:grid-cols-3">
                {photoUrls.map((photoUrl, index) =>
                  photoUrl && photoUrl.trim() !== "" ? (
                    <div
                      key={index}
                      className="relative overflow-hidden border border-gray-200 rounded-lg aspect-video dark:border-gray-800 bg-gray-100 dark:bg-gray-800"
                    >
                      <Image
                        src={photoUrl}
                        alt={`Property photo ${index + 1}`}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          console.error(`Failed to load image ${index + 1}:`, photoUrl);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  ) : null
                )}
              </div>
            )}

            {property?.photos && property.photos.length > 0 && photoUrls.length === 0 && !loadingPhotos && (
              <div className="mt-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-900/20 dark:border-yellow-800">
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  <p className="font-semibold mb-2">Unable to load {property.photos.length} photo(s)</p>
                  <p className="mb-3">This usually means:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Files don't exist in the Appwrite storage bucket</li>
                    <li>Storage bucket doesn't have public read permissions</li>
                    <li>Project ID or bucket ID is incorrect</li>
                    <li>On free plans, image previews may be blocked - using direct file access instead</li>
                  </ul>
                  <p className="mt-3 text-xs">
                    Check the browser console for detailed error messages and verify your Appwrite storage configuration.
                  </p>
                </div>
              </div>
            )}
          </div>
          {property?.photos && property.photos.length > 0 && photoUrls.length === 0 && (
            <div className="mb-6">
              <Label>Property Photos</Label>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {property.photos.length} photo(s) found but unable to load preview
              </p>
            </div>
          )}

          {/* Basic Information */}
          <div className="mb-6">
            <h5 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">
              Basic Information
            </h5>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div>
                <Label>Customer ID</Label>
                <Input
                  type="text"
                  name="custId"
                  defaultValue={formData.custId}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label>Property Type</Label>
                <Select
                  options={[
                    { value: "Apartment", label: "Apartment" },
                    { value: "Villa", label: "Villa" },
                    { value: "House", label: "House" },
                    { value: "Commercial", label: "Commercial" },
                  ]}
                  defaultValue={formData.propertyType}
                  onChange={(value) => handleSelectChange("propertyType", value)}
                />
              </div>

              <div>
                <Label>Listing Type</Label>
                <Select
                  options={[
                    { value: "Rent", label: "Rent" },
                    { value: "Sale", label: "Sale" },
                    { value: "Lease", label: "Lease" },
                  ]}
                  defaultValue={formData.listingType}
                  onChange={(value) => handleSelectChange("listingType", value)}
                />
              </div>

              <div>
                <Label>Status</Label>
                <Select
                  options={[
                    { value: "Pending", label: "Pending" },
                    { value: "Approved", label: "Approved" },
                    { value: "Rejected", label: "Rejected" },
                  ]}
                  defaultValue={formData.status}
                  onChange={(value) => handleSelectChange("status", value)}
                />
              </div>

              <div>
                <Label>Listed</Label>
                <Select
                  options={[
                    { value: "Yes", label: "Yes" },
                    { value: "No", label: "No" },
                  ]}
                  defaultValue={formData.listing}
                  onChange={(value) => handleSelectChange("listing", value)}
                />
              </div>

              <div>
                <Label>Facing</Label>
                <Select
                  options={[
                    { value: "North", label: "North" },
                    { value: "South", label: "South" },
                    { value: "East", label: "East" },
                    { value: "West", label: "West" },
                  ]}
                  defaultValue={formData.facing || ""}
                  onChange={(value) => handleSelectChange("facing", value)}
                />
              </div>
            </div>
          </div>

          {/* Financial Details */}
          <div className="mb-6">
            <h5 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">
              Financial Details
            </h5>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div>
                <Label>Rent Per Month</Label>
                <Input
                  type="number"
                  name="rentPerMonth"
                  defaultValue={formData.rentPerMonth}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label>Advance Amount</Label>
                <Input
                  type="number"
                  name="advanceAmount"
                  defaultValue={formData.advanceAmount}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label>Lease Amount</Label>
                <Input
                  type="number"
                  name="leaseAmount"
                  defaultValue={formData.leaseAmount}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label>Contract Months</Label>
                <Input
                  type="number"
                  name="contractMonths"
                  defaultValue={formData.contractMonths}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="mb-6">
            <h5 className="mb-4 text-lg font-medium text-gray-800 dark:text-white/90">
              Property Details
            </h5>
            <div className="grid grid-cols-1 gap-5">
              <div>
                <Label>Number of Floors</Label>
                <Input
                  type="number"
                  name="floors"
                  defaultValue={formData.floors}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <Label>Description</Label>
                <textarea
                  name="description"
                  defaultValue={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
          <Button size="sm" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
}
