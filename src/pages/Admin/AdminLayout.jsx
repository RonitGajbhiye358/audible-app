// src/layouts/AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AdminNav from '../../component/header/AdminNav';
import { selectCurrentUserRole } from '../../app/authSlice';

const AdminLayout = () => {
  const userRole = useSelector(selectCurrentUserRole);
  
  // If you want to add an additional protection layer
  if (userRole !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-700">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Admin Navigation Header */}
      <AdminNav />
      
      <div className="flex flex-1">
        {/* Optional Sidebar - remove if not needed */}
        {/* <AdminSidebar /> */}
        
        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-auto mt-16">
          <Outlet /> {/* This renders the nested admin routes */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;