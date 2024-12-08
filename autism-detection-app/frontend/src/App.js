import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Components/Pages/Login';
import SignupPage from './Components/Pages/Signup';
import Home from './Components/Pages/Home';
import Dashboard from './Components/Pages/Dashboard';
import Questionnaire from './Components/Pages/Questionnaire';
import Layout from './Components/Pages/Layout';
import Image from './Components/Pages/Image';
import Profile from './Components/Pages/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/adults" element={<Questionnaire />} />
        <Route path="/child" element={<Image />} />
        <Route path="/profile" element={<Profile />} />

        </Route>.
      </Routes>
    </Router>
  );
}

export default App;