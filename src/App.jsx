// Main App Component - Root component that manages the entire application
import React, { useState } from "react";
import NewsFeed from "./component/NewsFeed";
import Header from "./component/Header";
import Hero from "./component/Hero";
import { alphaStories } from "./data/alphaStories.js";

function App() {
  // State to manage all stories (both existing and newly submitted ones)
  const [stories, setStories] = useState(alphaStories);

  // Function to add a new story to the stories array
  const addNewStory = (newStory) => {
    // Create a complete story object with auto-generated ID and random image
    const storyWithId = {
      id: stories.length + 1, // Auto-increment ID based on current array length
      ...newStory, // Spread the new story data (name, church, story)
      // Generate a random placeholder image with varying dimensions
      image: `https://picsum.photos/${300 + Math.floor(Math.random() * 200)}/${
        300 + Math.floor(Math.random() * 200)
      }`,
    };
    // Add the new story to the beginning of the array (so it appears first)
    setStories((prevStories) => [storyWithId, ...prevStories]);
  };

  return (
    <>
      {/* Top navigation bar with Alpha Story branding */}
      <Header />

      {/* Story submission form - passes addNewStory function as prop */}
      <Hero onStorySubmit={addNewStory} />

      {/* Grid of story images - receives stories array as prop */}
      <NewsFeed stories={stories} />
    </>
  );
}

export default App;
