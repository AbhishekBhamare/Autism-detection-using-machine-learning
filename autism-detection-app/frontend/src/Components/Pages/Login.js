import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [number, setNumber] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    console.log("number", number);
    console.log("password", password);
    e.preventDefault();

    axios.post('http://localhost:5000/login', { number, password }, { withCredentials: true })
      .then(response => {
        console.log('going to dashboard :',response.data.message);
        navigate('/dashboard');
      })
      .catch(error => {
        console.error('Login failed:', error);
      });
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-600">
  <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
    <h2 className="pb-4 text-2xl font-bold text-center text-gray-800 border-b">Login</h2>
    <form className="space-y-4" onSubmit={handleSubmit}>
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
        Login
      </button>
    </form>
  </div>
</div>

  );
}

export default LoginPage;