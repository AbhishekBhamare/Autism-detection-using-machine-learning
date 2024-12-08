import React, { useState } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';
import Sidebar from './Sidebar';
import { useEffect } from 'react';
import axios from 'axios';

// Register the necessary components from Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

const Dashboard = () => {

  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/user', { withCredentials: true })
      .then(response => {
        setUser(response.data);
      })
      .catch(error => {
        console.error('User not authenticated:', error);
      });
  }, []);
  

  // Dummy data for the charts
  const [data] = useState({
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Autism Cases (%)',
        data: [10, 20, 30, 40, 50, 60],
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true, // Fill area under the line
      },
    ],
  });

  // Pie chart data (dummy data for autism detection by city)
  const pieData = {
    labels: ['City A', 'City B', 'City C', 'City D'],
    datasets: [
      {
        label: 'Autism Detection by City',
        data: [30, 20, 25, 25],
        backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#FF33A1'],
      },
    ],
  };

  // Bar chart data (dummy data for autism percentage change)
  const barData = {
    labels: ['City A', 'City B', 'City C', 'City D'],
    datasets: [
      {
        label: 'Percentage Change (Last Year)',
        data: [10, 15, 40, 20],
        backgroundColor: '#FFBF00',
      },
    ],
  };

  // Chart options (responsive and maintaining aspect ratio)
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      tooltip: {
        mode: 'index',
        intersect: false,
      },
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 h-screen p-8 ml-64 space-y-8 overflow-y-auto">
        <h1 className="text-3xl font-semibold text-center">Autism Detection Dashboard</h1>

        {/* Grid for Line and Pie Charts */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Line Chart */}
          <div className="w-full p-4 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-xl font-medium text-center">Autism Cases Over Time</h2>
            <Line data={data} options={options} />
          </div>

          {/* Pie Chart */}
          <div className="w-full p-4 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-xl font-medium text-center">Autism Detection by City</h2>
            <Pie data={pieData} options={options} />
          </div>
        </div>

        {/* Bar Chart below Line and Pie Charts */}
        <div className="w-full p-4 bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-xl font-medium text-center">Percentage Change from Last Year</h2>
          <Bar data={barData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
