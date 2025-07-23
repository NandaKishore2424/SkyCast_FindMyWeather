import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
  const [city, setCity] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    
    if (city.trim() === '') {
      setError('Please enter a city name')
      return
    }
    
    setError('')
    navigate('/weather', { state: { city: city.trim() } })
  }, [city, navigate])

  const handleInputChange = (e) => {
    setCity(e.target.value)
    if (error) {
      setError('')
    }
  }

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="app-title">SkyCast</h1>
        <p className="app-subtitle">Find My Weather</p>
        
        <form onSubmit={handleSubmit} className="search-form">
          <div className="input-group">
            <input
              type="text"
              value={city}
              onChange={handleInputChange}
              placeholder="Enter city name..."
              className={`city-input ${error ? 'error' : ''}`}
            />
            <button type="submit" className="search-btn">
              Get Weather
            </button>
          </div>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  )
}

export default Home
