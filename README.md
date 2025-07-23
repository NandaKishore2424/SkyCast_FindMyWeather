# SkyCast - Find My Weather
## Date: 21-07-2025
## Objective:
To build a responsive single-page application using React that allows users to enter a city name and retrieve real-time weather information using the OpenWeatherMap API. This project demonstrates the use of Axios for API calls, React Router for navigation, React Hooks for state management, controlled components with validation, and basic styling with CSS.
## Tasks:

#### 1. Project Setup
Initialize React app.

Install necessary dependencies: npm install axios react-router-dom

#### 2. Routing
Set up BrowserRouter in App.js.

Create two routes:

/ – Home page with input form.

/weather – Page to display weather results.

#### 3. Home Page (City Input)
Create a controlled input field for the city name.

Add validation to ensure the input is not empty.

On valid form submission, navigate to /weather and store the city name.

#### 4. Weather Page (API Integration)
Use Axios to fetch data from the OpenWeatherMap API using the city name.

Show temperature, humidity, wind speed, and weather condition.

Convert and display temperature in both Celsius and Fahrenheit using useMemo.

#### 5. React Hooks
Use useState for managing city, weather data, and loading state.

Use useEffect to trigger the Axios call on page load.

Use useCallback to optimize form submit handler.

Use useMemo for temperature conversion logic.

#### 6. UI Styling (CSS)
Create a responsive and clean layout using CSS.

Style form, buttons, weather display cards, and navigation links.

## Programs:

### \pages\Home.jsx
```
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
```

### \pages\Weather.jsx
```
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
```

### App.jsx
```
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Weather from './pages/Weather'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/weather" element={<Weather />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
```
### App.css
```
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f0f0f0;
  min-height: 100vh;
}

.app {
  min-height: 100vh;
  padding: 20px;
}

.home-container {
  max-width: 400px;
  margin: 50px auto;
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.app-title {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 10px;
}

.app-subtitle {
  font-size: 1rem;
  color: #666;
  margin-bottom: 30px;
}

.search-form {
  width: 100%;
}

.input-group {
  margin-bottom: 10px;
}

.city-input {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 15px;
}

.city-input:focus {
  border-color: #007bff;
  outline: none;
}

.city-input.error {
  border-color: #dc3545;
}

.search-btn {
  width: 100%;
  padding: 12px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

.search-btn:hover {
  background: #0056b3;
}

.error-message {
  color: #dc3545;
  font-size: 0.9rem;
  margin-top: 5px;
}

.weather-container {
  max-width: 500px;
  margin: 50px auto;
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.loading {
  text-align: center;
  font-size: 1.1rem;
  color: #666;
  padding: 40px;
}

.error-container {
  text-align: center;
  padding: 40px;
}

.back-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-bottom: 20px;
}

.back-btn:hover {
  background: #545b62;
}

.weather-card {
  text-align: center;
}

.city-name {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 20px;
}

.weather-main {
  margin-bottom: 20px;
}

.temperature {
  margin-bottom: 10px;
}

.temp-celsius {
  font-size: 3rem;
  font-weight: bold;
  color: #007bff;
}

.temp-fahrenheit {
  font-size: 1.2rem;
  color: #666;
  margin-left: 8px;
}

.weather-condition {
  font-size: 1.1rem;
  color: #666;
  text-transform: capitalize;
}

.weather-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-top: 20px;
}

.detail-item {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  text-align: center;
}

.detail-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 5px;
}

.detail-value {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
}

@media (max-width: 600px) {
  .home-container,
  .weather-container {
    margin: 20px;
    padding: 20px;
  }
  
  .weather-details {
    grid-template-columns: 1fr;
  }
  
  .temp-celsius {
    font-size: 2.5rem;
  }
}
```


## Output:

<img width="1365" height="681" alt="Screenshot 2025-07-23 084358" src="https://github.com/user-attachments/assets/c8938d58-a3b6-4bbb-a002-0401337ea50f" />

<img width="1365" height="679" alt="Screenshot 2025-07-23 084415" src="https://github.com/user-attachments/assets/444eabe2-9ad7-40d9-979e-1197a73fa94f" />



## Result:
A responsive single-page application using React that allows users to enter a city name and retrieve real-time weather information using the OpenWeatherMap API has been built successfully. 
