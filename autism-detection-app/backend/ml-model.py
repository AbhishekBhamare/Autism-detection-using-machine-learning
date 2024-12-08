from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

app = Flask(__name__)
CORS(app)  


model = joblib.load('./clf_xgb.joblib')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json.get('arr', [])
    if len(data) >= 21:  # Validate the number of inputs
        prediction = model.predict([data])  # Replace with preprocessing if needed
        return jsonify({'prediction': prediction.tolist()})
    else:
        return jsonify({'error': 'Invalid input'}), 400

if __name__ == '__main__':
    app.run(port=5432)
