import React from 'react';
import { auth } from '../firebase'; // Make sure this path is correct for your project

const Sidebar = ({ activeTab, setActiveTab, isOpen, toggleSidebar }) => {
  const sidebarWidth = '280px';

  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log("User logged out");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  const sidebarStyle = {
    width: sidebarWidth,
    height: '100vh',
    background: '#1a252f', 
    color: 'white',
    position: 'fixed',
    top: 0,
    left: isOpen ? '0' : `-${sidebarWidth}`, 
    transition: 'left 0.3s ease-in-out',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
  };

  const navItemStyle = (tab) => ({
    padding: '12px 15px',
    cursor: 'pointer',
    borderRadius: '8px',
    marginBottom: '8px',
    background: activeTab === tab ? '#34495e' : 'transparent',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    fontSize: '18px',
    transition: 'background 0.2s',
  });

  return (
    <div style={sidebarStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '40px' }}>
        <button 
          onClick={toggleSidebar} 
          style={{ background: 'transparent', color: 'white', border: 'none', fontSize: '28px', cursor: 'pointer', padding: 0 }}
        >
          ☰
        </button>
        <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold' }}>Manager</h3>
      </div>
      
      <div onClick={() => setActiveTab('tasks')} style={navItemStyle('tasks')}>📋 Tasks</div>
      <div onClick={() => setActiveTab('completed')} style={navItemStyle('completed')}>✅ Completed</div>
      <div onClick={() => setActiveTab('reminders')} style={navItemStyle('reminders')}>⏰ Reminders</div>
      <div onClick={() => setActiveTab('profile')} style={navItemStyle('profile')}>👤 Profile</div>

      {/* FIXED LOGOUT BUTTON */}
      <div 
        onClick={handleLogout} 
        style={{ ...navItemStyle('logout'), color: '#e74c3c', marginTop: 'auto', fontWeight: 'bold' }}
      >
        🚪 Log Out
      </div>
    </div>
  );
};

export default Sidebar;