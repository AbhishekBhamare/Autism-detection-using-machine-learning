import React, { useState, useRef } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";

const ImagePage = () => {
  // States for image upload, questions, and prediction
  const [childName, setChildName] = useState("");
  const [parentName, setParentName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState("");
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null); // To store prediction result
  const [loading, setLoading] = useState(false); // Loading state for prediction
  const [isPredictionDone, setIsPredictionDone] = useState(false); // To enable Submit button after prediction

  // Camera capture logic
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        })
        .catch((err) => console.log(err));
    }
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageUrl = canvas.toDataURL();
    setImage(imageUrl);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handlePredict = async () => {
    if (!image) {
      setPrediction("Please upload or capture an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", dataURLToBlob(image)); // Convert base64 image to Blob

    try {
      setLoading(true);
      const response = await fetch("http://127.0.0.1:5433/predict-image", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log("Prediction result:", result);

      if (response.ok) {
        // Update prediction based on the prediction value
        if (result.prediction < 0.6) {
          setPrediction("No Autism");
        } else {
          setPrediction("Autism");
        }
        setIsPredictionDone(true); // Enable Submit button
      } else {
        setPrediction(`Error: ${result.error}`);
      }
    } catch (err) {
      console.error(err);
      setPrediction("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitData = async () => {
    try {
      const response = await axios.post("http://localhost:5000/child", {
        childName,
        parentName,
        phoneNumber,
        city,
        prediction,
      });
      console.log("Data stored successfully:", response.data.message);
      alert("Data submitted successfully!");
      setChildName("");
      setParentName("");
      setPhoneNumber("");
      setCity("");
      setImage(null);
      setPrediction(null);
      setIsPredictionDone(false);
    } catch (error) {
      console.error("Error occurred while submitting data:", error);
      alert("Failed to submit data.");
    }
  };

  // Helper function to convert base64 to Blob
  const dataURLToBlob = (dataURL) => {
    const byteString = atob(dataURL.split(",")[1]);
    const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
    const buffer = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      buffer[i] = byteString.charCodeAt(i);
    }
    return new Blob([buffer], { type: mimeString });
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 h-screen p-8 ml-64 space-y-8 overflow-y-auto">
        <h1 className="text-3xl font-semibold text-center">
          Upload Details and Image
        </h1>
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Input fields for child and guardian details */}
          <input
            type="text"
            placeholder="Child Name"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Parent/Guardian Name"
            value={parentName}
            onChange={(e) => setParentName(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full p-2 border rounded"
          />

          {/* Image Upload or Camera Capture */}
          <div className="flex space-x-8">
            <div className="flex-1">
              <h2 className="text-xl font-medium">Upload an Image</h2>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mt-4"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-medium">Capture Image Using Camera</h2>
              <button
                onClick={startCamera}
                className="px-4 py-2 mt-4 text-white bg-blue-500 rounded"
              >
                Start Camera
              </button>
              <div className="relative mt-4">
                <video ref={videoRef} width="100%" height="auto" className="border" />
                <button
                  onClick={capturePhoto}
                  className="absolute px-4 py-2 text-white transform -translate-x-1/2 bg-green-500 rounded bottom-4 left-1/2"
                >
                  Capture
                </button>
                <canvas ref={canvasRef} width="640" height="480" className="hidden" />
              </div>
            </div>
          </div>

          {image && (
            <div className="mt-8">
              <h3 className="text-xl font-medium">Uploaded or Captured Image</h3>
              <img
                src={image}
                alt="Uploaded or Captured"
                className="border"
                style={{ maxWidth: "300px" }}
              />
            </div>
          )}

          {/* Predict Button */}
          {image && (
            <div className="mt-4 text-center">
              <button
                onClick={handlePredict}
                className="px-6 py-2 text-white bg-purple-600 rounded"
                disabled={loading}
              >
                {loading ? "Predicting..." : "Predict"}
              </button>
            </div>
          )}

          {/* Display Prediction */}
          {prediction && (
            <div className="max-w-4xl p-6 mx-auto bg-blue-100 border-l-4 border-blue-500 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-blue-700">Prediction Result</h2>
              <p className="mt-4 text-lg text-blue-600">{prediction}</p>
            </div>
          )}

          {/* Submit Button */}
          {isPredictionDone && (
            <div className="mt-4 text-center">
              <button
                onClick={handleSubmitData}
                className="px-6 py-2 text-white bg-green-600 rounded"
              >
                Submit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImagePage;
