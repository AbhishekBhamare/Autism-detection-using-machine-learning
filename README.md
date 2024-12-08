Autism Detection App
====================

Project Structure:
------------------
This repository contains two main folders:
1. frontend - Contains the user interface of the application.
2. backend - Contains the server-side logic and ML model integration.

How to Run the Application:
---------------------------
Follow the steps below to set up and run the application:

### Frontend Setup
1. Navigate to the `frontend` folder:
   cd frontend
2. Install the required dependencies:
   npm install
3. Start the frontend server:
   npm start
4. The frontend will be accessible at `http://localhost:3000`.

### Backend and ML Models Setup
You need three separate terminals to run the backend and the ML models:

1. Terminal 1: Backend Server
   - Navigate to the `backend` folder:
     cd backend
   - Start the backend server:
     node server.js
   - The backend will be running on `http://localhost:5000`.

2. Terminal 2: ML Model Server
   - Run the ML model server script:
     python model-server.py

3. Terminal 3: ML Model Script
   - Run the additional ML model script:
     python ml-model.py

- Ensure all servers are running before accessing the frontend application.
