import React, { useState } from "react";

export default function NewsFeed({ stories = [] }) {
  const [selectedStory, setSelectedStory] = useState(null);
  const [currentFilter, setCurrentFilter] = useState("all");

  // Use stories prop instead of imported alphaStories
  const filteredStories =
    currentFilter === "all"
      ? stories
      : stories.filter((story) => story.church !== "Unknown");

  const truncateStory = (story, maxLength = 150) => {
    if (story.length <= maxLength) return story;
    return story.substring(0, maxLength) + "...";
  };

  const openModal = (story) => {
    setSelectedStory(story);
  };

  const closeModal = () => {
    setSelectedStory(null);
  };

  return (
    <div className="min-h-screen bg-white p-4">
      {/* Filter Buttons */}
      <div className="mb-6 flex justify-center gap-4">
        <button
          onClick={() => setCurrentFilter("all")}
          className={`px-6 py-2 rounded-full font-medium transition-colors ${
            currentFilter === "all"
              ? "bg-[#ef4444] text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          All Stories ({stories.length})
        </button>
        <button
          onClick={() => setCurrentFilter("church")}
          className={`px-6 py-2 rounded-full font-medium transition-colors ${
            currentFilter === "church"
              ? "bg-[#ef4444] text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Church Stories ({stories.filter((s) => s.church !== "Unknown").length}
          )
        </button>
      </div>

      {/* Images Grid - 3 Columns with Gaps */}
      <div className="grid grid-cols-3 gap-6">
        {filteredStories.map((story) => (
          <button
            key={story.id}
            className="aspect-square overflow-hidden rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer border-2 border-gray-200 hover:border-[#ef4444] focus:outline-none focus:ring-2 focus:ring-[#ef4444]"
            onClick={() => openModal(story)}
          >
            <img
              src={story.image}
              alt={`${story.name}'s story`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Modal - Fixed positioning and click handlers */}
      {selectedStory && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => {
              e.stopPropagation();
              console.log("Clicked inside modal"); // Debug log
            }}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedStory.name}'s Story
              </h2>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeModal();
                }}
                className="bg-[#ef4444] hover:bg-[#dc2626] text-white text-lg font-normal w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#ef4444] focus:ring-offset-2"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Story Image */}
              <div className="mb-4">
                <img
                  src={selectedStory.image}
                  alt={`${selectedStory.name}'s story`}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>

              {/* Church/Location Info */}
              <div className="mb-4">
                <p className="text-gray-500 flex items-center">
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

              {/* Full Story Text */}
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {selectedStory.story}
                </p>
              </div>

              {/* Optional Source Link */}
              {selectedStory.source && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <a
                    href={selectedStory.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#ef4444] hover:text-[#dc2626] text-sm font-medium"
                  >
                    Read more at {selectedStory.source} →
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center mt-12 pt-8 border-t border-gray-200">
        <p className="text-gray-500 text-sm">
          These stories are from real people who have participated in Alpha
          courses.
          <br />
          <a
            href="https://alpha.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#ef4444] hover:text-[#dc2626] font-medium"
          >
            Learn more about Alpha →
          </a>
        </p>
      </div>
    </div>
  );
}
