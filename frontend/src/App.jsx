import { useEffect, useRef } from 'react'
import './App.css'

function App() {
  const canvasRef = useRef(null)
  
  // We store our array of objects in a ref so updating them doesn't lag the game
  const objectsRef = useRef([])

  // This function fires every time you click the canvas
  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    
    // Calculate exact mouse coordinates inside the canvas
    const clickX = event.clientX - rect.left
    const clickY = event.clientY - rect.top

    // Add a brand new physics object to our array
    objectsRef.current.push({
      x: clickX,
      y: clickY,
      radius: Math.random() * 15 + 10, // Random size between 10 and 25
      velocityY: 0,
      velocityX: (Math.random() - 0.5) * 6, // Random horizontal speed
      color: `hsl(${Math.random() * 360}, 80%, 60%)`, // Random neon color
      gravity: 0.5,
      bounce: -0.7
    })
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationFrameId
    
    const render = () => {
      // 1. Clear the arena for the new frame
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // 2. Loop through every object in our array and apply physics
      objectsRef.current.forEach(obj => {
        // Gravity & Movement
        obj.velocityY += obj.gravity
        obj.y += obj.velocityY
        obj.x += obj.velocityX

        // Floor Collision
        if (obj.y + obj.radius > canvas.height) {
          obj.y = canvas.height - obj.radius
          obj.velocityY *= obj.bounce
        }
        
        // Wall Collision (Bounce off the sides)
        if (obj.x + obj.radius > canvas.width || obj.x - obj.radius < 0) {
          obj.velocityX *= -1 
        }

        // 3. Draw the object
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
      <p>Click anywhere inside the box to spawn objects!</p>
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