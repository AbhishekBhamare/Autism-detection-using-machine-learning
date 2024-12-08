import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-600">
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
      <h1 className="pb-4 text-2xl font-bold text-center text-gray-800 border-b">
        Autism Detection Application
      </h1>
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => navigate('/login')}
          className="w-full px-4 py-2 font-semibold border rounded-lg text-slate-600 border-slate-600 hover:bg-slate-600 hover:text-white focus:outline-none focus:ring focus:ring-slate-500"
        >
          Login
        </button>
        <button
          onClick={() => navigate('/signup')}
          className="w-full px-4 py-2 font-semibold border rounded-lg text-slate-600 border-slate-600 hover:bg-slate-600 hover:text-white focus:outline-none focus:ring focus:ring-slate-500"
        >
          Signup
        </button>
      </div>
    </div>
  </div>


  )
}
