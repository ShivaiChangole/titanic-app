from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np

# Create Flask app
app = Flask(__name__)
CORS(app)  # Allow React to talk to Flask

# Load the saved ML model
with open('titanic_model.pkl', 'rb') as f:
    model = pickle.load(f)

print("Model loaded successfully! ✅")

# Home route — just to test
@app.route('/')
def home():
    return jsonify({'message': 'Titanic API is running! 🚢'})

# Prediction route — this is what React will call
@app.route('/predict', methods=['POST'])
def predict():
    # Get data sent from React
    data = request.get_json()

    # Extract each feature
    features = [[
        int(data['pclass']),
        int(data['sex']),
        float(data['age']),
        int(data['sibsp']),
        int(data['parch']),
        float(data['fare']),
        int(data['embarked'])
    ]]

    # Make prediction
    prediction = model.predict(features)[0]
    probability = model.predict_proba(features)[0]

    # Send result back to React
    return jsonify({
        'survived': int(prediction),
        'probability': round(float(probability[1]) * 100, 1),
        'message': 'Survived! 🎉' if prediction == 1 else 'Did not survive 💀'
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)