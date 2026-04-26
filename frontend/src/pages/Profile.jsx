import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Save, Camera } from 'lucide-react';
import { auth } from '../firebase';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
    photoURL: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    // Initialize from Firebase auth or localStorage
    const user = auth.currentUser;
    const storedAge = localStorage.getItem('user_age') || '';
    const storedGender = localStorage.getItem('user_gender') || '';
    
    if (user) {
      setProfile(prev => ({
        ...prev,
        name: user.displayName || 'Traveler',
        email: user.email || '',
        photoURL: user.photoURL || 'https://i.pravatar.cc/150?img=11',
        age: storedAge,
        gender: storedGender
      }));
    } else {
      // Fallback for testing without login
      setProfile({
        name: 'Alex Wanderlust',
        email: 'alex@example.com',
        age: storedAge || '28',
        gender: storedGender || 'Not specified',
        photoURL: 'https://i.pravatar.cc/150?img=11'
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Save age and gender to local storage
    localStorage.setItem('user_age', profile.age);
    localStorage.setItem('user_gender', profile.gender);
    // Note: To update Firebase Auth display name/email, we'd use updateProfile/updateEmail. 
    // We'll keep it simple and just show a success message for now.
    
    setIsEditing(false);
    setSavedMessage('Profile updated successfully!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-4 sm:p-8"
    >
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 flex items-center gap-3 mb-2">
          <User className="text-brand-orange" size={36} />
          My Profile
        </h2>
        <p className="text-gray-500 font-medium text-lg ml-0 md:ml-12">Manage your personal information and preferences.</p>
      </div>

      <div className="glass-panel p-8 md:p-12 border border-white/80 shadow-xl flex flex-col md:flex-row gap-12">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center gap-4 md:w-1/3">
          <div className="relative group cursor-pointer">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg relative z-10 bg-white">
              <img 
                src={profile.photoURL} 
                alt={profile.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
              <Camera className="text-white" size={32} />
            </div>
            {/* Decorative background circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 bg-brand-green/20 rounded-full z-0 blur-md"></div>
          </div>
          
          <div className="text-center mt-2">
            <h3 className="text-2xl font-bold text-gray-800">{profile.name}</h3>
            <p className="text-brand-green font-semibold">Eco-Traveler</p>
          </div>
          
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="mt-4 px-6 py-2 rounded-full border-2 border-brand-orange text-brand-orange font-bold hover:bg-brand-orange hover:text-white transition-all w-full max-w-[200px]"
          >
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>

        {/* Profile Details Form */}
        <div className="md:w-2/3 flex flex-col justify-center">
          {savedMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded-xl mb-6 font-bold text-sm"
            >
              {savedMessage}
            </motion.div>
          )}

          <form onSubmit={handleSave} className="flex flex-col gap-6">
            <div className="field">
              <label className="text-gray-500 font-bold text-sm mb-2 block flex items-center gap-2">
                <User size={16} /> Full Name
              </label>
              {isEditing ? (
                <input 
                  type="text" 
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="form-input w-full bg-white/80 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 transition-all font-medium text-gray-800 shadow-sm"
                  required
                />
              ) : (
                <div className="text-xl font-bold text-gray-800 bg-gray-50/50 px-4 py-3 rounded-xl border border-transparent">
                  {profile.name}
                </div>
              )}
            </div>

            <div className="field">
              <label className="text-gray-500 font-bold text-sm mb-2 block flex items-center gap-2">
                <Mail size={16} /> Email Address
              </label>
              {isEditing ? (
                <input 
                  type="email" 
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="form-input w-full bg-white/80 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 transition-all font-medium text-gray-800 shadow-sm"
                  required
                />
              ) : (
                <div className="text-xl font-bold text-gray-800 bg-gray-50/50 px-4 py-3 rounded-xl border border-transparent">
                  {profile.email}
                </div>
              )}
            </div>

            <div className="field">
              <label className="text-gray-500 font-bold text-sm mb-2 block flex items-center gap-2">
                <Calendar size={16} /> Age
              </label>
              {isEditing ? (
                <input 
                  type="number" 
                  name="age"
                  value={profile.age}
                  onChange={handleChange}
                  placeholder="Enter your age"
                  className="form-input w-full bg-white/80 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 transition-all font-medium text-gray-800 shadow-sm"
                  min="13" max="120"
                />
              ) : (
                <div className="text-xl font-bold text-gray-800 bg-gray-50/50 px-4 py-3 rounded-xl border border-transparent">
                  {profile.age || 'Not specified'}
                </div>
              )}
            </div>

            <div className="field">
              <label className="text-gray-500 font-bold text-sm mb-2 block flex items-center gap-2">
                <User size={16} /> Gender
              </label>
              {isEditing ? (
                <select 
                  name="gender"
                  value={profile.gender}
                  onChange={handleChange}
                  className="form-input w-full bg-white/80 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 transition-all font-medium text-gray-800 shadow-sm"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <div className="text-xl font-bold text-gray-800 bg-gray-50/50 px-4 py-3 rounded-xl border border-transparent">
                  {profile.gender || 'Not specified'}
                </div>
              )}
            </div>

            {isEditing && (
              <button 
                type="submit"
                className="mt-6 bg-brand-green hover:bg-green-700 text-white font-bold text-lg px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 self-start"
              >
                <Save size={20} /> Save Changes
              </button>
            )}
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
