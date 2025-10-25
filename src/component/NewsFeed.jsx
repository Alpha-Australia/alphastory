// NewsFeed Component - Displays Alpha stories in a grid layout with modal functionality
import React, { useState } from "react";

export default function NewsFeed({ stories = [] }) {
  // State for managing which story is currently displayed in the modal
  const [selectedStory, setSelectedStory] = useState(null);

  // State for managing the current filter (all stories vs church stories only)
  const [currentFilter, setCurrentFilter] = useState("all");

  // Filter stories based on the current filter selection
  const filteredStories =
    currentFilter === "all"
      ? stories // Show all stories
      : stories.filter((story) => story.church !== "Unknown"); // Only show stories with known churches

  // Utility function to truncate long story text for preview (currently unused but available)
  const truncateStory = (story, maxLength = 150) => {
    if (story.length <= maxLength) return story;
    return story.substring(0, maxLength) + "...";
  };

  // Function to open the story modal when a story image is clicked
  const openModal = (story) => {
    setSelectedStory(story);
  };

  // Function to close the story modal
  const closeModal = () => {
    setSelectedStory(null);
  };

  return (
    <div className="min-h-screen bg-white p-4">
      {/* Filter Toggle - Allows users to switch between all stories and church stories */}
      <div className="flex justify-center my-6">
        <div className="flex bg-gray-100 gap-6 rounded-lg p-1 my-8">
          {/* "All Stories" button */}
          <button
            onClick={() => setCurrentFilter("all")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentFilter === "all"
                ? "bg-[#ef4444] text-white" // Active state: red background, white text
                : "text-gray-600 hover:text-gray-800" // Inactive state: gray text
            }`}
          >
            All Stories ({stories.length})
          </button>

          {/* "Church Stories" button - filters out stories with "Unknown" church */}
          <button
            onClick={() => setCurrentFilter("church")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentFilter === "church"
                ? "bg-[#ef4444] text-white" // Active state: red background, white text
                : "text-gray-600 hover:text-gray-800" // Inactive state: gray text
            }`}
          >
            Church Stories (
            {stories.filter((s) => s.church !== "Unknown").length})
          </button>
        </div>
      </div>

      {/* Images Grid - 3 column grid layout displaying story images */}
      <div className="grid grid-cols-3 gap-4">
        {filteredStories.map((story) => (
          // Each story is rendered as a clickable button with an image
          <button
            key={story.id} // Unique key for React rendering
            className="aspect-square overflow-hidden rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer border-none border-gray-200 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => openModal(story)} // Open modal when clicked
          >
            <img
              src={story.image}
              alt={`${story.name}'s story`}
              className="w-full h-full object-cover" // Cover entire button area
            />
          </button>
        ))}
      </div>

      {/* Modal - Displays full story details when a story image is clicked */}
      {selectedStory && (
        // Full screen overlay with semi-transparent background - clicking here closes modal
        <div
          className="fixed inset-0 bg-[#000000]/50 bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={closeModal} // Close modal when clicking on the backdrop
        >
          {/* Modal content container - prevent click propagation to keep modal open when clicking inside */}
          <div
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
          >
            {/* Modal header with story title and close button */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-900">
                {selectedStory.name}'s Story
              </h2>
              {/* Close button with red styling to match theme - smaller, elegant design */}
            </div>

            {/* Modal body content */}
            <div className="p-6">
              {/* Story image */}
              <div className="mb-4">
                <img
                  src={selectedStory.image}
                  alt={`${selectedStory.name}'s story`}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>

              {/* Church/location information with icon */}
              <div className="mb-4">
                <p className="text-gray-500 flex items-center">
                  {/* Location pin SVG icon */}
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {selectedStory.church}
                </p>
              </div>

              {/* Full story text with proper formatting */}
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-900 leading-relaxed whitespace-pre-line">
                  {selectedStory.story}
                </p>
              </div>

              {/* Optional source link (if story has a source URL) */}
              {selectedStory.source && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <a
                    href={selectedStory.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Read more at {selectedStory.source} →
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer - Information about Alpha and external link */}
      <div className="text-center mt-12 pt-8 border-t border-gray-200">
        <p className="text-gray-500 text-sm">
          These stories are from real people who have participated in Alpha
          courses.
          <br />
          <a
            href="https://alpha.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700"
          >
            Learn more about Alpha →
          </a>
        </p>
      </div>
    </div>
  );
}
