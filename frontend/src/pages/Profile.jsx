import React, { useState, useEffect, useContext, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { getProfile, updateProfile, uploadProfilePicture, getProfilePictureUrl } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaCamera, FaPencilAlt, FaSave, FaTimes, FaSpinner } from 'react-icons/fa';

function Profile() {
  const { user, setUser } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    profilePicture: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await getProfile();
      setProfile(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to fetch profile');
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateProfile(profile);
      setUser(response.data);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('profilePicture', file);
        const response = await uploadProfilePicture(formData);
        const updatedProfilePicture = response.data.profilePicture;
        setProfile({ ...profile, profilePicture: updatedProfilePicture });
        setUser({ ...user, profilePicture: updatedProfilePicture });
        toast.success('Profile picture updated successfully');
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        toast.error('Failed to upload profile picture');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">User Profile</h1>
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="relative h-48 bg-gradient-to-r from-blue-500 to-indigo-600">
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
            <motion.div
              className="relative w-32 h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center overflow-hidden cursor-pointer"
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowOptions(!showOptions)}
            >
              {isUploading ? (
                <FaSpinner className="animate-spin text-4xl text-gray-400" />
              ) : profile.profilePicture ? (
                <img 
                  src={getProfilePictureUrl(profile.profilePicture)} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/path/to/fallback/image.jpg'; // Add a fallback image
                  }}
                />
              ) : (
                <FaUser className="text-gray-400 text-4xl" />
              )}
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <FaCamera className="text-white text-2xl" />
              </div>
            </motion.div>
            <AnimatePresence>
              {showOptions && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-md shadow-lg"
                >
                  <button
                    onClick={triggerFileInput}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FaCamera className="inline-block mr-2" /> Change Picture
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FaPencilAlt className="inline-block mr-2" /> Edit Profile
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleProfilePictureChange}
          className="hidden"
          accept="image/*"
        />
        <div className="pt-20 pb-8 px-6">
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition duration-300"
                >
                  <FaTimes className="inline-block mr-2" /> Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                >
                  <FaSave className="inline-block mr-2" /> Save Changes
                </motion.button>
              </div>
            </form>
          ) : (
            <div>
              <p className="mb-4"><strong>Name:</strong> {profile.name}</p>
              <p className="mb-4"><strong>Email:</strong> {profile.email}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;