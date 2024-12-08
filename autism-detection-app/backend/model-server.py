from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import io

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests



model = tf.keras.models.load_model('./mobilenet.h5', compile=False)


def preprocess_image(image):
    """
    Preprocess the image for model prediction.
    Resize, normalize, and expand dimensions to match model input.
    """
    image = image.resize((224, 224))  # Resize to model's input size
    image = np.array(image) / 255.0  # Normalize pixel values (if required)
    image = np.expand_dims(image, axis=0)  # Add batch dimension
    return image

@app.route("/predict-image", methods=["POST"])
def predict():
    print(f"Request files: {request.files}")  # Debug uploaded files
    if "image" not in request.files:
        print("No image uploaded")
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]
    try:
        print("Reading image")
        image = Image.open(io.BytesIO(file.read()))
        processed_image = preprocess_image(image)
        prediction = model.predict(processed_image)
        return jsonify({"prediction": prediction.tolist()})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(port=5433, debug=True)  # Enable debug mode for development

