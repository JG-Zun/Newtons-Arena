import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const canvasRef = useRef(null)
  const objectsRef = useRef([])
  
  // New State Variables for the Leaderboard and Username
  const [spawnCount, setSpawnCount] = useState(0)
  const [saveStatus, setSaveStatus] = useState('')
  const [username, setUsername] = useState('')
  const [leaderboard, setLeaderboard] = useState([])

  // 1. Fetch the Top 5 Scores from MongoDB
  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/scores')
      if (response.ok) {
        const data = await response.json()
        setLeaderboard(data)
      }
    } catch (error) {
      console.error('Could not fetch leaderboard:', error)
    }
  }

  // Load the leaderboard as soon as the website opens
  useEffect(() => {
    fetchLeaderboard()
  }, [])

  // 2. Handle the physics engine spawning
  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const clickX = event.clientX - rect.left
    const clickY = event.clientY - rect.top

    objectsRef.current.push({
      x: clickX,
      y: clickY,
      radius: Math.random() * 15 + 10,
      velocityY: 0,
      velocityX: (Math.random() - 0.5) * 6,
      color: `hsl(${Math.random() * 360}, 80%, 60%)`,
      gravity: 0.5,
      bounce: -0.7
    })
    
    setSpawnCount(objectsRef.current.length)
  }

  // 3. Save the score with the custom username
  const saveScoreToDatabase = async () => {
    // Prevent saving if they haven't typed a name
    if (username.trim() === '') {
      setSaveStatus('⚠️ Please enter a username first!')
      return
    }

    setSaveStatus('Saving to MongoDB...')
    try {
      const response = await fetch('http://localhost:5001/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerName: username,
          objectsSpawned: spawnCount
        })
      })

      if (response.ok) {
        setSaveStatus('Score Saved Successfully! 🚀')
        fetchLeaderboard() // Instantly refresh the leaderboard!
        setTimeout(() => setSaveStatus(''), 3000)
      } else {
        setSaveStatus('Failed to save.')
      }
    } catch (error) {
      console.error(error)
      setSaveStatus('Server error. Is the backend running?')
    }
  }

  // 4. The Physics Render Loop
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationFrameId
    
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      objectsRef.current.forEach(obj => {
        obj.velocityY += obj.gravity
        obj.y += obj.velocityY
        obj.x += obj.velocityX

        if (obj.y + obj.radius > canvas.height) {
          obj.y = canvas.height - obj.radius
          obj.velocityY *= obj.bounce
        }
        
        if (obj.x + obj.radius > canvas.width || obj.x - obj.radius < 0) {
          obj.velocityX *= -1 
        }

        ctx.beginPath()
        ctx.arc(obj.x, obj.y, obj.radius, 0, 2 * Math.PI)
        ctx.fillStyle = obj.color
        ctx.fill()
      })
      
      animationFrameId = window.requestAnimationFrame(render)
    }
    
    render()
    return () => window.cancelAnimationFrame(animationFrameId)
  }, [])

  return (
    <div className="arena-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <h1>Newton's Arena</h1>
      
      {/* Controls: Username, Score, and Save Button */}
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <p style={{ fontSize: '1.2rem', margin: 0 }}>Objects Spawned: <strong>{spawnCount}</strong></p>
        
        <input 
          type="text" 
          placeholder="Enter username..." 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: '10px', fontSize: '1rem', borderRadius: '8px', border: '1px solid #646cff', background: '#1a1a1a', color: 'white' }}
        />

        <button 
          onClick={saveScoreToDatabase}
          style={{ padding: '10px 20px', fontSize: '1rem', cursor: 'pointer', borderRadius: '8px', border: 'none', background: '#646cff', color: 'white' }}
        >
          Save Score
        </button>
        <span style={{ color: '#4ade80', fontWeight: 'bold' }}>{saveStatus}</span>
      </div>

      {/* Game and Leaderboard Layout */}
      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
        
        {/* The Physics Canvas */}
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={600} 
          onClick={handleCanvasClick}
          style={{ border: '2px solid #646cff', background: '#1a1a1a', borderRadius: '8px', cursor: 'crosshair' }}
        />

        {/* The Global Leaderboard */}
        <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '8px', border: '2px solid #646cff', minWidth: '250px' }}>
          <h2>🏆 Top 10 Arena Masters</h2>
          {leaderboard.length === 0 ? (
            <p>No scores yet. Be the first!</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '1.1rem' }}>
              {leaderboard.map((score, index) => (
                <li key={index} style={{ padding: '10px 0', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between' }}>
                  <span><strong>#{index + 1}</strong> {score.playerName}</span>
                  <span style={{ color: '#646cff', fontWeight: 'bold' }}>{score.objectsSpawned}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        
      </div>
    </div>
  )
}

export default App