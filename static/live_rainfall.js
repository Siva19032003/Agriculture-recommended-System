// Replace with your OpenWeatherMap API Key
const apiKey = '26888bd7d07fedef5c82d21fc205a56b';

// Function to fetch weather data
async function fetchWeatherData(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        //data is available
        if (data.rain && data.rain['1h']) {
            const rainfall = data.rain['1h']; // Rainfall in the last 1 hour (in mm)
            document.getElementById('rainfall').value = rainfall;
        } else {
            console.log('No rainfall data available.');
            document.getElementById('rainfall').value = 0; // Default to 0 if no data
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
