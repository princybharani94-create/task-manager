import React from 'react';
import { auth } from '../firebase'; // Import auth
import { signOut } from "firebase/auth";

const Sidebar = ({ setActiveTab }) => {

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully");
      // App.js usually handles the redirect back to Login automatically 
      // if you're using an onAuthStateChanged listener.
    } catch (error) {
      console.error("Error signing out: ", error.message);
    }
  };

  return (
    <div className="sidebar" style={sidebarStyle}>
      <div>
        <h2 style={{ marginBottom: '30px' }}>Task Manager</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <button onClick={() => setActiveTab("tasks")} style={btnStyle}>📋 Tasks</button>
          <button onClick={() => setActiveTab("completed")} style={btnStyle}>✅ Completed</button>
          <button onClick={() => setActiveTab("profile")} style={btnStyle}>👤 Profile</button>
        </nav>
      </div>

      <button onClick={handleLogout} style={logoutBtnStyle}>
        🚪 Log Out
      </button>
    </div>
  );
};

// Simple inline styles to help with placement
const sidebarStyle = {
  width: '240px',
  background: '#1a252f',
  color: 'white',
  height: '100vh',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between' // Pushes logout to the bottom
};

const btnStyle = {
  background: 'none',
  border: 'none',
  color: 'white',
  textAlign: 'left',
  fontSize: '16px',
  cursor: 'pointer',
  padding: '10px'
};

const logoutBtnStyle = {
  ...btnStyle,
  color: '#e74c3c', // Red color for logout
  fontWeight: 'bold',
  borderTop: '1px solid #34495e',
  paddingTop: '20px'
};

export default Sidebar;