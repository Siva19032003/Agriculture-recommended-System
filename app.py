from flask import Flask, render_template, request, jsonify,redirect, url_for, flash
import requests
import joblib
import numpy as np
import pandas as pd

app = Flask(__name__)


app.secret_key = 'your_secret_key'  # Required for flashing messages

# Sample user data (can be replaced with a database)
user_data = {
    "username": "john_doe",
    "email": "john.doe@example.com",
    "notifications": True,
    "theme": "light",
}

market_data = {
    "total_sales": 150000,
    "market_growth": 12.5,
    "top_products": [
        {"name": "Product A", "sales": 50000},
        {"name": "Product B", "sales": 45000},
        {"name": "Product C", "sales": 40000},
    ],
    "trends": {
        "labels": ["Jan", "Feb", "Mar", "Apr", "May"],
        "data": [20000, 30000, 25000, 40000, 35000],
    },
}

# OpenWeatherMap API Key
API_KEY = '26888bd7d07fedef5c82d21fc205a56b'
BASE_URL = 'http://api.openweathermap.org/data/2.5/weather'
DEFAULT_CITY = 'guindy'

# Load all models and label encoders
crop_model = joblib.load('models/Crop.pkl')
fertilizer_model = joblib.load('models/Fertilizer.pkl')
irrigation_model = joblib.load('models/Irrigation.pkl')
rotational_model = joblib.load('models/Rotation.pkl')

crop_label_encoder = joblib.load('models/Crop_label.pkl')
fertilizer_label_encoder = joblib.load('models/Fertilizer_label.pkl')
irrigation_label_encoder = joblib.load('models/Irrigation_label.pkl')
rotational_label_encoder = joblib.load('models/Rotation_label.pkl')

# Home Page
@app.route('/')
def home():
    return render_template('home.html')

# Crop Recommendation
@app.route('/crop_recommend', methods=['GET', 'POST'])
def crop_recommend():
    if request.method == 'POST':
        N = float(request.form['nitrogen'])
        P = float(request.form['phosphorus'])
        K = float(request.form['potassium'])
        temperature = float(request.form['temperature'])
        humidity = float(request.form['humidity'])
        ph = float(request.form['ph'])
        rainfall = float(request.form['rainfall'])

        input_data = np.array([[N, P, K, temperature, humidity, ph, rainfall]])
        prediction = crop_model.predict(input_data)
        recommended_crop = crop_label_encoder.inverse_transform(prediction)[0]

        return render_template('result.html', prediction=recommended_crop, module='Crop Recommendation')
    return render_template('crop_recommend.html')

# Fertilizer Suggestion
@app.route('/fertilizer_suggestion', methods=['GET', 'POST'])
def fertilizer_suggestion():
    if request.method == 'POST':
        soil_color = request.form['soil_color']
        nitrogen = float(request.form['nitrogen'])
        phosphorus = float(request.form['phosphorus'])
        potassium = float(request.form['potassium'])
        ph = float(request.form['ph'])
        rainfall = float(request.form['rainfall'])
        temperature = float(request.form['temperature'])
        crop = request.form['crop']

        # Encode inputs
        soil_color_encoded = fertilizer_label_encoder['Soil_color'].transform([soil_color])[0]
        crop_encoded = fertilizer_label_encoder['Crop'].transform([crop])[0]

        input_data = np.array([[soil_color_encoded, nitrogen, phosphorus, potassium, ph, rainfall, temperature, crop_encoded]])
        prediction = fertilizer_model.predict(input_data)
        recommended_fertilizer = fertilizer_label_encoder['Fertilizer'].inverse_transform(prediction)[0]

        return render_template('result.html', prediction=recommended_fertilizer, module='Fertilizer Suggestion')
    return render_template('fertilizer_suggestion.html')

# Rotational Crop
@app.route('/rotational_crop', methods=['GET', 'POST'])
def rotational_crop():
    if request.method == 'POST':
        previous_crop = request.form['previous_crop']
        soil_ph = float(request.form['soil_ph'])
        soil_moisture = float(request.form['soil_moisture'])
        nitrogen = float(request.form['nitrogen'])
        phosphorus = float(request.form['phosphorus'])
        potassium = float(request.form['potassium'])
        temperature = float(request.form['temperature'])
        humidity = float(request.form['humidity'])
        rainfall = float(request.form['rainfall'])

        input_data = {
            'Previous_Crop': rotational_label_encoder.transform([previous_crop])[0],
            'Soil_pH': soil_ph,
            'Soil_Moisture': soil_moisture,
            'Nitrogen': nitrogen,
            'Phosphorus': phosphorus,
            'Potassium': potassium,
            'Temperature': temperature,
            'Humidity': humidity,
            'Rainfall': rainfall
        }
        input_df = pd.DataFrame([input_data])
        prediction = rotational_model.predict(input_df)
        recommended_crop = rotational_label_encoder.inverse_transform(prediction)[0]

        return render_template('result.html', prediction=recommended_crop, module='Rotational Crop')
    return render_template('rotational_crop.html')

# Irrigation Advice
@app.route('/irrigation_advice', methods=['GET', 'POST'])
def irrigation_advice():
    if request.method == 'POST':
        temperature = float(request.form['temperature'])
        pressure = float(request.form['pressure'])
        soil_moisture = float(request.form['soil_moisture'])
        humidity = float(request.form['humidity'])

        input_data = np.array([[temperature, pressure, soil_moisture, humidity]])
        prediction = irrigation_model.predict(input_data)
        irrigation_advice = irrigation_label_encoder.inverse_transform(prediction)[0]

        return render_template('result.html', prediction=irrigation_advice, module='Irrigation Advice')
    return render_template('irrigation_advice.html')

# Weather Forecast
@app.route('/weather', methods=['GET', 'POST'])
def weather():
    return render_template('weather.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/instagram')
def instagram():
    return render_template('instagram.html')
@app.route('/facebook')
def facebook():
    return render_template('facebook.html')
@app.route('/twitter')
def twitter():
    return render_template('twitter.html')
@app.route('/linkedIn')
def linkedIn():
    return render_template('linkedIn.html')


@app.route('/setting', methods=['GET', 'POST'])
def settings():
    if request.method == 'POST':
        # Update user data based on form submission
        user_data['username'] = request.form.get('username', user_data['username'])
        user_data['email'] = request.form.get('email', user_data['email'])
        user_data['notifications'] = True if request.form.get('notifications') == 'on' else False
        user_data['theme'] = request.form.get('theme', user_data['theme'])

        # Flash a success message
        flash('Settings updated successfully!', 'success')
        return redirect(url_for('settings'))

    return render_template('settings.html', user=user_data)

@app.route('/market')
def market():
    return render_template('market_analysis.html')

@app.route('/api/market-data')
def get_market_data():
    return jsonify(market_data)


if __name__ == '__main__':
    app.run(debug=True)