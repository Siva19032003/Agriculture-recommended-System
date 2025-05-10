// Replace with your OpenWeatherMap API Key
const apiKey = '26888bd7d07fedef5c82d21fc205a56b';

// Function to fetch weather data
async function fetchWeatherData(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        //data is available
        if (data.main && data.main.pressure) {
            const pressure = data.main.pressure; // Pressure in hPa
            document.getElementById('pressure').value = pressure;
        } else {
            console.log('No pressure data available.');
            document.getElementById('pressure').value = 0; // Default to 0 if no data
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Failed to fetch weather data. Please try again.');
    }
}


function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetchWeatherData(lat, lon); // Fetch weather data using coordinates
            },
            (error) => {
                console.error('Error getting location:', error);
                alert('Unable to retrieve your location. Please enable location access.');
            }
        );
    } else {
        alert('Geolocation is not supported by your browser.');
    }
}