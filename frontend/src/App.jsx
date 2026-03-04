import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const canvasRef = useRef(null)
  const objectsRef = useRef([])
  
  // Track our score in React state so the UI updates
  const [spawnCount, setSpawnCount] = useState(0)
  const [saveStatus, setSaveStatus] = useState('')

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
    
    // Update the score every time we spawn an object
    setSpawnCount(objectsRef.current.length)
  }

  // The Full-Stack Connection: Sending data to Node/MongoDB
  const saveScoreToDatabase = async () => {
    setSaveStatus('Saving to MongoDB...')
    try {
      const response = await fetch('http://localhost:5001/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerName: 'Guest Player',
          objectsSpawned: spawnCount
        })
      })

      if (response.ok) {
        setSaveStatus('Score Saved Successfully! 🚀')
        setTimeout(() => setSaveStatus(''), 3000) // Clear message after 3 seconds
      } else {
        setSaveStatus('Failed to save.')
      }
    } catch (error) {
      console.error(error)
      setSaveStatus('Server error. Is the backend running?')
    }
  }

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
    <div className="arena-container">
      <h1>Newton's Arena</h1>
      
      {/* Scoreboard and Full-Stack Controls */}
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <p style={{ fontSize: '1.2rem', margin: 0 }}>Objects Spawned: <strong>{spawnCount}</strong></p>
        <button 
          onClick={saveScoreToDatabase}
          style={{ padding: '10px 20px', fontSize: '1rem', cursor: 'pointer', borderRadius: '8px', border: 'none', background: '#646cff', color: 'white' }}
        >
          Save Score
        </button>
        <span style={{ color: '#4ade80', fontWeight: 'bold' }}>{saveStatus}</span>
      </div>

      <canvas 
        ref={canvasRef} 
        width={800} 
        height={600} 
        onClick={handleCanvasClick}
        style={{ border: '2px solid #646cff', background: '#1a1a1a', borderRadius: '8px', cursor: 'crosshair' }}
      />
    </div>
  )
}

export default App