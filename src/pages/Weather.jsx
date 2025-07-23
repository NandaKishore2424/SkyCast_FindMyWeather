import { useState, useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Weather() {
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const location = useLocation()
  const navigate = useNavigate()
  const city = location.state?.city

  const API_KEY = 'b2397675e951aa226fe123b570b005b6'

  const temperatureConversion = useMemo(() => {
    if (!weatherData) return { celsius: 0, fahrenheit: 0 }
    
    const celsius = Math.round(weatherData.main.temp - 273.15)
    const fahrenheit = Math.round((celsius * 9/5) + 32)
    
    return { celsius, fahrenheit }
  }, [weatherData])

  useEffect(() => {
    if (!city) {
      navigate('/')
      return
    }

    const fetchWeatherData = async () => {
      try {
        setLoading(true)
        setError('')
        
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
        )
        
        setWeatherData(response.data)
      } catch (err) {
        setError('City not found. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchWeatherData()
  }, [city, navigate])

  const handleBackToHome = () => {
    navigate('/')
  }

  if (loading) {
    return (
      <div className="weather-container">
        <div className="loading">Loading weather data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="weather-container">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={handleBackToHome} className="back-btn">
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="weather-container">
      <div className="weather-content">
        <button onClick={handleBackToHome} className="back-btn">
          ← Back to Home
        </button>
        
        <div className="weather-card">
          <h2 className="city-name">{weatherData.name}, {weatherData.sys.country}</h2>
          
          <div className="weather-main">
            <div className="temperature">
              <span className="temp-celsius">{temperatureConversion.celsius}°C</span>
              <span className="temp-fahrenheit">({temperatureConversion.fahrenheit}°F)</span>
            </div>
            <div className="weather-condition">
              {weatherData.weather[0].description}
            </div>
          </div>
          
          <div className="weather-details">
            <div className="detail-item">
              <span className="detail-label">Humidity</span>
              <span className="detail-value">{weatherData.main.humidity}%</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Wind Speed</span>
              <span className="detail-value">{weatherData.wind.speed} m/s</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Feels Like</span>
              <span className="detail-value">
                {Math.round(weatherData.main.feels_like - 273.15)}°C
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Pressure</span>
              <span className="detail-value">{weatherData.main.pressure} hPa</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Weather
