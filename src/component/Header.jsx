// Header Component - Top navigation bar with branding
import React from "react";

export default function Header() {
  return (
    // Main header with white background and subtle shadow
    <header className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Alpha Story Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900">
                {/* "Alpha" in red theme color, "Story" in gray */}
                <span className="text-[#ef4444]">Alpha</span>{" "}
                <span className="text-gray-800">Story</span>
              </h1>
            </div>
          </div>

          {/* Right side - Navigation placeholder for future features */}
          <div className="flex items-center space-x-4">
            {/* Navigation items can be added here later (e.g., login, about, etc.) */}
          </div>
        </div>
      </div>
    </header>
  );
}
