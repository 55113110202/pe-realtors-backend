"use client";
import React, { useState, useEffect } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useAuth } from "@/context/AuthContext";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const { user, logout } = useAuth();

  useEffect(() => {
    const updateTime = () => {
      const indiaTime = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'medium',
        timeStyle: 'short',
        hour12: true
      }).format(new Date());
      setCurrentTime(indiaTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
  e.stopPropagation();
  setIsOpen((prev) => !prev);
}

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleLogout = async () => {
    closeDropdown();
    await logout();
  };
  return (
    <div className="relative">
      <button
        onClick={toggleDropdown} 
        className="flex items-center text-gray-700 dark:text-gray-400 dropdown-toggle"
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11 bg-brand-500 flex items-center justify-center text-white font-semibold">
          {user?.name?.charAt(0).toUpperCase() || 'A'}
        </span>

        <span className="block mr-1 font-medium text-theme-sm">{user?.name || 'Admin'}</span>

        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[280px] flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        {/* User Info */}
        <div className="pb-4 border-b border-gray-200 dark:border-gray-800">
          <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
            {user?.name || 'Admin'}
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            {user?.email || ''}
          </span>
        </div>

        {/* Profile Button */}
        <div className="py-3 border-b border-gray-200 dark:border-gray-800">
          <a
            href="/profile"
            className="flex items-center gap-3 px-3 py-2.5 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-50 hover:text-brand-600 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-brand-400 w-full transition-colors"
          >
            <svg
              className="fill-gray-500 group-hover:fill-brand-600 dark:group-hover:fill-brand-400"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4ZM6 8C6 4.68629 8.68629 2 12 2C15.3137 2 18 4.68629 18 8C18 11.3137 15.3137 14 12 14C8.68629 14 6 11.3137 6 8ZM8 16C6.34315 16 5 17.3431 5 19V21C5 21.5523 4.55228 22 4 22C3.44772 22 3 21.5523 3 21V19C3 16.2386 5.23858 14 8 14H16C18.7614 14 21 16.2386 21 19V21C21 21.5523 20.5523 22 20 22C19.4477 22 19 21.5523 19 21V19C19 17.3431 17.6569 16 16 16H8Z"
                fill=""
              />
            </svg>
            View Profile
          </a>
        </div>

        {/* India Date & Time */}
        <div className="py-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium">{currentTime}</span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-500 ml-7">India (IST)</span>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400 w-full transition-colors"
        >
          <svg
            className="fill-gray-500 group-hover:fill-red-600 dark:group-hover:fill-red-400"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.1007 19.247C14.6865 19.247 14.3507 18.9112 14.3507 18.497L14.3507 14.245H12.8507V18.497C12.8507 19.7396 13.8581 20.747 15.1007 20.747H18.5007C19.7434 20.747 20.7507 19.7396 20.7507 18.497L20.7507 5.49609C20.7507 4.25345 19.7433 3.24609 18.5007 3.24609H15.1007C13.8581 3.24609 12.8507 4.25345 12.8507 5.49609V9.74501L14.3507 9.74501V5.49609C14.3507 5.08188 14.6865 4.74609 15.1007 4.74609L18.5007 4.74609C18.9149 4.74609 19.2507 5.08188 19.2507 5.49609L19.2507 18.497C19.2507 18.9112 18.9149 19.247 18.5007 19.247H15.1007ZM3.25073 11.9984C3.25073 12.2144 3.34204 12.4091 3.48817 12.546L8.09483 17.1556C8.38763 17.4485 8.86251 17.4487 9.15549 17.1559C9.44848 16.8631 9.44863 16.3882 9.15583 16.0952L5.81116 12.7484L16.0007 12.7484C16.4149 12.7484 16.7507 12.4127 16.7507 11.9984C16.7507 11.5842 16.4149 11.2484 16.0007 11.2484L5.81528 11.2484L9.15585 7.90554C9.44864 7.61255 9.44847 7.13767 9.15547 6.84488C8.86248 6.55209 8.3876 6.55226 8.09481 6.84525L3.52309 11.4202C3.35673 11.5577 3.25073 11.7657 3.25073 11.9984Z"
              fill=""
            />
          </svg>
          Sign out
        </button>
      </Dropdown>
    </div>
  );
}
