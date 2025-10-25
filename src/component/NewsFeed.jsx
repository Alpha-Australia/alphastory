import React, { useState } from "react";

export default function NewsFeed({ stories = [] }) {
  const [selectedStory, setSelectedStory] = useState(null);
  const [currentFilter, setCurrentFilter] = useState("all");

  // Debug logs
  console.log("📊 NewsFeed rendered with stories:", stories.length);
  console.log("📊 selectedStory state:", selectedStory);
  console.log("📊 First story:", stories[0]);

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
    console.log("🎯 openModal called with story:", story);
    console.log("🎯 Story name:", story?.name);
    console.log("🎯 Story id:", story?.id);
    setSelectedStory(story);
    console.log("🎯 selectedStory state should be set now");
  };

  const closeModal = () => {
    setSelectedStory(null);
  };

  return (
    <div className="min-h-screen bg-white p-4">
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
      {console.log("🎭 Modal check - selectedStory:", selectedStory)}
      {selectedStory && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(160, 160, 160, 0.8)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={closeModal}
        >
          {console.log("🎭 Modal should be visible now!")}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              maxWidth: "500px",
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
              padding: "20px",
            }}
            onClick={(e) => {
              e.stopPropagation();
              console.log("Clicked inside modal"); // Debug log
            }}
          >
            <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>
              {selectedStory.name}'s Story
            </h2>
            <button
              onClick={closeModal}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                backgroundColor: "#999999ff",
                color: "white",
                border: "none",
                borderRadius: "100%",
                width: "30px",
                height: "30px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ×
            </button>
            <p>{selectedStory.story}</p>
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
