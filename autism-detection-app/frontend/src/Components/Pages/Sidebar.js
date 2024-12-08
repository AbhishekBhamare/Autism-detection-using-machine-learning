import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="fixed top-0 left-0 w-64 h-screen p-4 text-white bg-gray-800">
      <h2 className="mb-6 text-2xl font-semibold text-center">Navigation</h2>
      <ul className='mt-20 text-xl'>
        <li className="mb-4">
          <Link to="/dashboard" className="hover:text-gray-400">DASHBOARD</Link>
        </li>
        <li className="mb-4">
          <Link to="/adults" className="hover:text-gray-400">QUESTIONNAIRE</Link>
        </li>
        <li className="mb-4">
          <Link to="/child" className="hover:text-gray-400">IMAGE</Link>
        </li>
        <li className="mb-4">
          <Link to="/profile" className="hover:text-gray-400">PROFILE</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
