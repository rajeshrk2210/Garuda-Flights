// src/pages/AdminPage.tsx
import React from 'react';

const AdminPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Add Flight</h2>
          <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
            Add New Flight
          </button>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Update Flight</h2>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Update Flight Details
          </button>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Cancel Flight</h2>
          <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
            Cancel Flight
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
