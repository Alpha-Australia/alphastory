<<<<<<< HEAD
import React, { useEffect, useMemo, useState } from 'react'

const artStylePrompts = {
  renaissance:
    "Renaissance-style painting of {story}, featuring opulent details and rich colors, oil painting, sfumato technique, chiaroscuro dramatic lighting and shadows, classical composition with balanced symmetry, realistic human anatomy and proportions, elaborate period-appropriate costumes and drapery, intricate architectural details, atmospheric perspective, masterful brushwork in the manner of Leonardo da Vinci, Raphael, Titian, or Botticelli, 15th-16th century Italian Renaissance art style, highly detailed and realistic",
  minimalist:
    "Minimalist line drawing of {story}, simple clean black lines on white background, elegant minimal linework, continuous line art style, essential forms only with no shading, modern minimalist aesthetic, refined simplicity, uncluttered composition, single weight lines, artistic sketch quality, contemporary minimalist illustration, focus on essential shapes and contours, zen-like simplicity, sophisticated and refined",
  cartoon:
    "Cartoon illustration of {story}, vibrant bright colors, bold outlines and clean lines, expressive characters with exaggerated features, dynamic poses and emotions, playful friendly style, flat color fills with simple shading, fun and engaging composition, in the style of modern animation or comic books, cheerful and energetic, suitable for all ages, colorful and whimsical, professional cartoon art quality",
}

export default function App() {
  const [apiKey, setApiKey] = useState("")
  const [userName, setUserName] = useState("")
  const [churchName, setChurchName] = useState("")
  const [artStyle, setArtStyle] = useState("renaissance")
  const [story, setStory] = useState("")
  const [error, setError] = useState("")
  const [currentImageUrl, setCurrentImageUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [feedItems, setFeedItems] = useState([])
  const [modalItem, setModalItem] = useState(null)
  const [regeneratingId, setRegeneratingId] = useState(null)

  // Load persisted values
  useEffect(() => {
    const savedApi = localStorage.getItem('openai_api_key')
    if (savedApi) setApiKey(savedApi)

    const savedFeed = localStorage.getItem('renaissance_feed')
    if (savedFeed) setFeedItems(JSON.parse(savedFeed))
  }, [])

  // Persist API key
  useEffect(() => {
    if (apiKey) localStorage.setItem('openai_api_key', apiKey)
  }, [apiKey])

  // Persist feed
  useEffect(() => {
    localStorage.setItem('renaissance_feed', JSON.stringify(feedItems))
  }, [feedItems])

  const placeholderContent = useMemo(() => (
    <div className="placeholder">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p>Your Renaissance masterpiece will appear here</p>
    </div>
  ), [])

  function showError(msg) {
    setError(msg)
  }

  function resetForm() {
    setStory("")
    setUserName("")
    setChurchName("")
    setArtStyle('renaissance')
  }

  function saveFeedItem(imageUrl, s, uName, cName, aStyle) {
    const item = {
      id: Date.now(),
      imageUrl,
      story: s,
      userName: uName || 'Anonymous',
      churchName: cName || 'Unknown Church',
      artStyle: aStyle || 'renaissance',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    }
    setFeedItems(prev => [item, ...prev])
  }

  async function generateImage() {
    setError("")

    if (!apiKey) return showError('Please enter your OpenAI API key.')
    if (!userName) return showError('Please enter your name.')
    if (!churchName) return showError('Please enter your church name.')
    if (!story) return showError('Please enter a story to generate an image.')

    setLoading(true)
    setCurrentImageUrl(null)

    try {
      const promptTemplate = artStylePrompts[artStyle]
      const fullPrompt = promptTemplate.replace('{story}', story)

      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: fullPrompt,
          n: 1,
          size: '1024x1024',
          quality: 'standard'
        })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data?.error?.message || 'Failed to generate image')

      const url = data.data[0].url
      setCurrentImageUrl(url)
      saveFeedItem(url, story, userName, churchName, artStyle)
      resetForm()
    } catch (e) {
      showError(`Error: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  async function downloadImage() {
    if (!currentImageUrl) return
    try {
      const res = await fetch(currentImageUrl)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `renaissance-image-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (e) {
      showError('Failed to download image. Please try right-clicking the image and selecting "Save Image As..."')
    }
  }

  function openModal(item) { setModalItem(item) }
  function closeModal() { setModalItem(null) }

  function deleteFeedItem(id) {
    if (!confirm('Are you sure you want to delete this artwork?')) return
    setFeedItems(prev => prev.filter(i => i.id !== id))
  }

  async function regenerateImage(itemId) {
    const item = feedItems.find(i => i.id === itemId)
    if (!item) return
    if (!apiKey) return alert('Please enter your OpenAI API key in the form above first.')

    setRegeneratingId(itemId)
    try {
      const promptTemplate = artStylePrompts[item.artStyle || 'renaissance']
      const fullPrompt = promptTemplate.replace('{story}', item.story)

      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: fullPrompt,
          n: 1,
          size: '1024x1024',
          quality: 'standard'
        })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data?.error?.message || 'Failed to regenerate image')

      const newUrl = data.data[0].url
      setFeedItems(prev => prev.map(i => i.id === itemId ? { ...i, imageUrl: newUrl, date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) } : i))
    } catch (e) {
      alert(`Error regenerating image: ${e.message}`)
    } finally {
      setRegeneratingId(null)
    }
  }

  return (
    <div className="main-wrapper">
      <div className="container">
        <div className="header">
          <h1>🎨 Renaissance Image Generator</h1>
          <p>Transform your stories into beautiful Renaissance-style artwork</p>
        </div>

        <div className="image-container">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Creating your Renaissance masterpiece...</p>
            </div>
          ) : currentImageUrl ? (
            <img src={currentImageUrl} alt="Generated Renaissance Image" />
          ) : (
            placeholderContent
          )}
        </div>

        <div className="input-section">
          <div className="api-key-section">
            <label htmlFor="apiKey">OpenAI API Key</label>
            <input
              type="password"
              id="apiKey"
              placeholder="sk-..."
              autoComplete="off"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <small>
              Your API key is stored locally and never sent anywhere except OpenAI. Get one at
              {' '}
              <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer">platform.openai.com</a>
            </small>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 15, marginBottom: 20 }}>
            <div>
              <label htmlFor="userName">Your Name</label>
              <input
                type="text"
                id="userName"
                placeholder="Enter your name"
                style={{ width: '100%', padding: 10, border: '2px solid #ddd', borderRadius: 6, fontSize: '1em', fontFamily: 'Georgia, serif' }}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="churchName">Church Name</label>
              <input
                type="text"
                id="churchName"
                placeholder="Enter church name"
                style={{ width: '100%', padding: 10, border: '2px solid #ddd', borderRadius: 6, fontSize: '1em', fontFamily: 'Georgia, serif' }}
                value={churchName}
                onChange={(e) => setChurchName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="artStyle">Art Style</label>
              <select
                id="artStyle"
                style={{ width: '100%', padding: 10, border: '2px solid #ddd', borderRadius: 6, fontSize: '1em', fontFamily: 'Georgia, serif', background: 'white', cursor: 'pointer' }}
                value={artStyle}
                onChange={(e) => setArtStyle(e.target.value)}
              >
                <option value="renaissance">Renaissance</option>
                <option value="minimalist">Minimalist / Line Drawing</option>
                <option value="cartoon">Cartoon</option>
              </select>
            </div>
          </div>

          <label htmlFor="story">Tell Your Story</label>
          <textarea
            id="story"
            placeholder="Enter your story here... e.g., 'A noble knight in shining armor stands in a grand cathedral, holding a golden chalice, surrounded by saints and angels in a heavenly setting'"
            value={story}
            onChange={(e) => setStory(e.target.value)}
            onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') generateImage() }}
          />

          <div className="button-group">
            <button onClick={generateImage} disabled={loading} id="generateBtn">
              {loading ? 'Generating...' : 'Generate Renaissance Image'}
            </button>
            <button onClick={downloadImage} id="downloadBtn" className={`download-btn ${currentImageUrl ? 'visible' : ''}`}>
              Download Image
            </button>
          </div>

          {error && (
            <div id="error" className="error" style={{ display: 'block' }}>{error}</div>
          )}
        </div>
      </div>

      {/* Feed Section */}
      <div className="feed-container">
        <div className="feed-header">
          <h2>Renaissance Gallery</h2>
          <p style={{ color: '#666' }}>Your generated masterpieces</p>
        </div>

        <div className="feed-grid">
          {feedItems.length === 0 ? (
            <div className="empty-feed">
              <p>No artworks yet</p>
              <small>Generate your first Renaissance masterpiece above!</small>
            </div>
          ) : (
            feedItems.map(item => (
              <div key={item.id} className="feed-tile" onClick={() => openModal(item)}>
                <img id={`img-${item.id}`} src={item.imageUrl} alt="Renaissance Art" />
                <button
                  className="delete-btn"
                  title="Delete"
                  onClick={(e) => { e.stopPropagation(); deleteFeedItem(item.id) }}
                >
                  ×
                </button>
                <button
                  id={`regen-${item.id}`}
                  className="regenerate-btn"
                  title="Regenerate"
                  disabled={regeneratingId === item.id}
                  onClick={(e) => { e.stopPropagation(); regenerateImage(item.id) }}
                >
                  {regeneratingId === item.id ? '⟳' : '⟳'}
                </button>
                <div className="feed-tile-info">
                  <div className="feed-tile-name">{item.userName || 'Anonymous'}</div>
                  <div className="feed-tile-church">{item.churchName || 'Unknown Church'}</div>
                  <div className="feed-tile-date">{item.date}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      <div className={`modal ${modalItem ? 'active' : ''}`} onClick={(e) => { if (e.target.classList.contains('modal')) closeModal() }}>
        {modalItem && (
          <>
            <span className="modal-close" onClick={closeModal}>&times;</span>
            <div className="modal-content">
              <img className="modal-image" src={modalItem.imageUrl} alt="Renaissance Art" />
              <div className="modal-story">
                <h3>Story</h3>
                <p>{modalItem.story}</p>
                <div className="modal-metadata">
                  <div className="modal-user-info">
                    <div className="modal-info-item">
                      <div className="modal-info-label">Name</div>
                      <div className="modal-info-value">{modalItem.userName || 'Anonymous'}</div>
                    </div>
                    <div className="modal-info-item">
                      <div className="modal-info-label">Church</div>
                      <div className="modal-info-value">{modalItem.churchName || 'Unknown Church'}</div>
                    </div>
                  </div>
                  <div className="modal-date">{modalItem.date}</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

=======
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
>>>>>>> f75587c (Update basic UI)
