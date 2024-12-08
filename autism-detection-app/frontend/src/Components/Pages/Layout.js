import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar on the left, fixed */}
      <div className="fixed top-0 bottom-0 left-0 w-full sm:w-1/4 lg:w-1/4 xl:w-1/4">
        <Sidebar />
      </div>

      {/* Content area: takes the rest of the screen space */}
      <div className="flex-1 p-6 overflow-y-auto sm:ml-1/4">
        {/* The Outlet will render the current page's content */}
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
