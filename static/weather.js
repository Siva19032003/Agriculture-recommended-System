const sidenav = document.getElementById('sidenav');
const mainContent = document.getElementById('mainContent');
const toggleBtn = document.getElementById('toggleBtn');

toggleBtn.addEventListener('click', () => {
  sidenav.classList.toggle('expanded');
  mainContent.classList.toggle('expanded');
});




// API Key and Base URL for OpenWeatherMap
const API_KEY = '26888bd7d07fedef5c82d21fc205a56b'; // Replace with your OpenWeatherMap API key
const CURRENT_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';

// DOM Elements
const cityInput = document.getElementById('city-input');
const temperature = document.getElementById('temperature');
const humidity = document.getElementById('humidity');
const rainfall = document.getElementById('rainfall');
const windSpeed = document.getElementById('wind-speed');
const cloudiness = document.getElementById('cloudiness');
const visibility = document.getElementById('visibility');
const pressure = document.getElementById('pressure');
const feelsLike = document.getElementById('feels-like');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');
const country = document.getElementById('country');
const coord = document.getElementById('coord');
const forecastContainer = document.getElementById('forecast-container');

// Function to fetch current weather data
async function getWeather() {
    const city = cityInput.value.trim();
    

    const currentWeatherUrl = `${CURRENT_WEATHER_URL}?q=${city}&appid=${API_KEY}&units=metric`;
    const forecastUrl = `${FORECAST_URL}?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        // Fetch current weather
        const currentResponse = await fetch(currentWeatherUrl);
        if (!currentResponse.ok) {
            throw new Error('City not found. Please try again.');
        }
        const currentData = await currentResponse.json();
        updateWeatherData(currentData);

        // Fetch 5-day forecast
        const forecastResponse = await fetch(forecastUrl);
        if (!forecastResponse.ok) {
            throw new Error('Forecast data not available.');
        }
        const forecastData = await forecastResponse.json();
        updateForecastData(forecastData);
    } catch (error) {
        console.error(error);
    }
}

// Function to update the DOM with current weather data
function updateWeatherData(data) {
    // Main weather details
    temperature.textContent = `${data.main.temp}°C`;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${data.wind.speed} m/s`;
    cloudiness.textContent = `${data.clouds.all}%`;
    visibility.textContent = `${data.visibility} m`;
    pressure.textContent = `${data.main.pressure} hPa`;
    feelsLike.textContent = `${data.main.feels_like}°C`;

    // Rainfall (if available)
    if (data.rain) {
        // Check for 1h or 3h rainfall data
        const rainfall1h = data.rain['1h'];
        const rainfall3h = data.rain['3h'];
        if (rainfall1h !== undefined) {
            rainfall.textContent = `${rainfall1h} mm (last 1 hour)`;
        } else if (rainfall3h !== undefined) {
            rainfall.textContent = `${rainfall3h} mm (last 3 hours)`;
        } else {
            rainfall.textContent = '0 mm';
        }
    } else {
        rainfall.textContent = '0 mm';
    }

    // Sunrise and Sunset (convert timestamp to time)
    sunrise.textContent = formatTime(data.sys.sunrise);
    sunset.textContent = formatTime(data.sys.sunset);

    // Location details
    country.textContent = data.sys.country;
    coord.textContent = `Lat: ${data.coord.lat}, Lon: ${data.coord.lon}`;
}

// Function to update the DOM with weekly forecast data
function updateForecastData(data) {
    // Clear previous forecast data
    forecastContainer.innerHTML = '';

    // Group forecast data by day
    const dailyForecast = {};
    data.list.forEach((item) => {
        const date = item.dt_txt.split(' ')[0]; // Extract date (YYYY-MM-DD)
        if (!dailyForecast[date]) {
            dailyForecast[date] = [];
        }
        dailyForecast[date].push(item);
    });

    // Display forecast for each day
    Object.keys(dailyForecast).forEach((date) => {
        const dayData = dailyForecast[date];
        const dayCard = document.createElement('div');
        dayCard.className = 'forecast-item';

        // Get the day name (e.g., Monday, Tuesday)
        const dayName = new Date(date).toLocaleDateString('en', { weekday: 'long' });

        // Calculate average temperature for the day
        const avgTemp = (
            dayData.reduce((sum, item) => sum + item.main.temp, 0) / dayData.length
        ).toFixed(1);

        // Get weather icon and description
        const weatherIcon = dayData[0].weather[0].icon;
        const weatherDescription = dayData[0].weather[0].description;

        // Populate the forecast card
        dayCard.innerHTML = `
            <p><strong>${dayName}</strong></p>
            <img src="https://openweathermap.org/img/wn/${weatherIcon}.png" alt="${weatherDescription}">
            <p>${avgTemp}°C</p>
            <p>${weatherDescription}</p>
        `;

        forecastContainer.appendChild(dayCard);
    });
}

// Function to format timestamp to readable time
function formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Attach event listener to the button
document.querySelector('button').addEventListener('click', getWeather);