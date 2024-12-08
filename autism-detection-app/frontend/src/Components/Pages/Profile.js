import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';

const Profile = () => {
  // Dummy user profile data (replace with actual user data from your API or state management)
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    profilePicture: null, // Profile picture can be uploaded or fetched from the database
  });

  // Dummy function to simulate fetching user data (replace with actual API call)
  useEffect(() => {
    // Simulate fetching user data from an API or database
    // setUser({ ...fetchedData });
  }, []);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setUser((prevState) => ({
        ...prevState,
        profilePicture: reader.result,
      }));
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 h-screen p-8 ml-64 space-y-8 overflow-y-auto">
        <h1 className="text-3xl font-semibold text-center">User Profile</h1>

        {/* Profile Card */}
        <div className="max-w-4xl p-6 mx-auto bg-white rounded-lg shadow-md">
          <div className="flex justify-center mb-6">
            {/* Display Profile Picture */}
            <div className="flex items-center justify-center w-32 h-32 overflow-hidden bg-gray-300 rounded-full">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" className="object-cover w-full h-full" />
              ) : (
                <span className="text-xl text-white">No Image</span>
              )}
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="text-lg text-gray-600">{user.email}</p>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-medium">Change Profile Picture</h3>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
              className="mt-4"
            />
          </div>
        </div>

        {/* Additional Profile Information */}
        <div className="max-w-4xl p-6 mx-auto bg-white rounded-lg shadow-md">
          <h3 className="mb-4 text-xl font-semibold">Additional Information</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">Phone Number:</span>
              <span className="text-gray-600">(123) 456-7890</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Address:</span>
              <span className="text-gray-600">123 Main St, City, Country</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Date of Birth:</span>
              <span className="text-gray-600">01/01/1990</span>
            </div>
            {/* Add more fields as needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
