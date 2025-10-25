// Hero Component - Story submission form section
import React, { useState } from "react";

export default function Hero({ onStorySubmit }) {
  // Form state management - tracks user input
  const [story, setStory] = useState(""); // User's story text
  const [userName, setUserName] = useState(""); // User's name
  const [churchName, setChurchName] = useState(""); // User's church (optional)
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state during submission

  // Handle form submission when user clicks "Share My Alpha Story"
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Validation: Ensure required fields are filled
    if (!story.trim() || !userName.trim()) {
      alert("Please fill in your name and story");
      return;
    }

    setIsSubmitting(true); // Show loading state

    // Create the new story object with cleaned data
    const newStory = {
      name: userName.trim(), // Remove whitespace from name
      church: churchName.trim() || "Unknown", // Use "Unknown" if no church provided
      story: story.trim(), // Remove whitespace from story
    };

    // Call the parent function (from App.jsx) to add story to main stories array
    if (onStorySubmit) {
      onStorySubmit(newStory);
    }

    // Simulate submission delay and show success message
    setTimeout(() => {
      setIsSubmitting(false); // Hide loading state
      alert(
        "Thank you for sharing your story! It has been added to the news feed."
      );
      // Reset all form fields to empty state
      setStory("");
      setUserName("");
      setChurchName("");
    }, 1000);
  };

  return (
    // Main hero section with gradient background and centered content
    <section className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center py-16 px-4">
      <div className="max-w-3xl w-full">
        {/* Hero Header - Main title and description */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Share Your <span className="text-[#ef4444]">Alpha Story</span>
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Your journey matters. Share how Alpha has transformed your life and
            inspire others to discover faith, hope, and community.
          </p>
        </div>

        {/* Story Form - White card containing the submission form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name and Church Row - Two input fields side by side */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* User Name Input - Required field */}
              <div>
                <label
                  htmlFor="userName"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Your Name *
                </label>
                <input
                  type="text"
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#ef4444] focus:outline-none transition-colors duration-200"
                  placeholder="Enter your name"
                  required
                />
              </div>

              {/* Church Name Input - Optional field */}
              <div>
                <label
                  htmlFor="churchName"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Church Name (Optional)
                </label>
                <input
                  type="text"
                  id="churchName"
                  value={churchName}
                  onChange={(e) => setChurchName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#ef4444] focus:outline-none transition-colors duration-200"
                  placeholder="Your church or community"
                />
              </div>
            </div>

            {/* Story Text Area - Main story input field */}
            <div>
              <label
                htmlFor="story"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Your Alpha Story *
              </label>
              <textarea
                id="story"
                value={story}
                onChange={(e) => setStory(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#ef4444] focus:outline-none transition-colors duration-200 resize-vertical"
                placeholder="Tell us about your Alpha journey... How did you discover Alpha? What questions did you have? How has your life changed? Share as much or as little as you'd like."
                required
              />
              {/* Character counter */}
              <div className="text-right text-sm text-gray-500 mt-1">
                {story.length} characters
              </div>
            </div>

            {/* Submit Button - Changes appearance based on loading state */}
            <div className="text-center pt-4">
              <button
                type="submit"
                disabled={isSubmitting || !story.trim() || !userName.trim()}
                className="bg-[#ef4444] hover:bg-[#dc2626] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
              >
                {/* Conditional button content - shows spinner when submitting */}
                {isSubmitting ? (
                  <span className="flex items-center">
                    {/* Loading spinner SVG */}
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sharing Your Story...
                  </span>
                ) : (
                  "Share My Alpha Story"
                )}
              </button>
            </div>
          </form>

          {/* Encouragement Text - Inspirational message below form */}
          <div className="mt-8 p-6 bg-amber-50 rounded-lg border-l-4 border-[#ef4444]">
            <p className="text-gray-700 text-center italic">
              "Every story matters. Your experience could be exactly what
              someone else needs to hear today."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
