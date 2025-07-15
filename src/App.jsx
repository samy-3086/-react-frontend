import { useEffect, useState } from 'react'

function App() {
  const [message, setMessage] = useState('Loading...')

  useEffect(() => {
    fetch('http://127.0.0.1:8000/')
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => setMessage('Error fetching data'))
  }, [])

  return (
    <div style={{ padding: '2rem' }}>
      <h1>FastAPI + React Project</h1>
      <p>{message}</p>
    </div>
  )
}

export default App
