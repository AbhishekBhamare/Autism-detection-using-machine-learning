import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignupPage() {
  const [username, setUsername] = useState('');
  const [number, setNumber] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Log the input data
    console.log('Username:', username);
    console.log('Phone Number:', number);
    console.log('Password:', password);

    // Send the form data to the backend
    axios.post('http://localhost:5000/signup', {  // Make sure this URL matches your backend
      username: username,
      number: number,
      password: password
    })
    .then((response) => {
      console.log('Response:', response);
      navigate('/login');
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-600">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="pb-4 text-2xl font-bold text-center text-gray-800 border-b">Signup</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:border-slate-500"
          />
          <input 
            type="tel" 
            placeholder="Phone Number" 
            pattern="[0-9]{10}"
            maxLength="10"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            title="Please enter a valid 10-digit phone number"
            className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:border-slate-500"
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:border-slate-500"
          />
          <button 
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white rounded-lg bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring focus:ring-slate-500"
          >
            Signup
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
