import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('Loading backend response...')
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('http://localhost:8081/api/hello')
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok')
        }
        return res.json()
      })
      .then(data => setMessage(data.message))
      .catch(err => {
        console.error('Fetch error:', err)
        setError('Failed to connect to backend.')
      })
  }, [])

  return (
    <div className="app-container">
      <header className="header">
        <div className="title-group">
          <h1>Household Budget</h1>
          <p className="subtitle">Track your finances with ease</p>
        </div>
      </header>

      <main className="main-content">
        <section className="status-card">
          <h2>Backend Status</h2>
          <div className={`status-indicator ${error ? 'error' : message !== 'Loading backend response...' ? 'success' : 'loading'}`}>
            <span className="pulse-dot"></span>
            {error ? error : message}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
