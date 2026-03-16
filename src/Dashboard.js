import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Tasks from './components/Tasks';
import Profile from './components/Profile';
import Completed from './components/Completed';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('tasks');

  // Helper function to render the correct component based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'tasks':
        return <Tasks />;
      case 'completed':
        return <Completed />;
      case 'profile':
        return <Profile />;
      default:
        return <Tasks />;
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Pass activeTab to Sidebar if you want to highlight the current selection */}
      <Sidebar setActiveTab={setActiveTab} activeTab={activeTab} />
      
      {/* Main Content Area */}
      <main style={contentStyle}>
        <div style={containerStyle}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

// --- STYLES ---

const contentStyle = { 
  flex: 1, 
  marginLeft: '200px', // Matches your Sidebar width
  minHeight: '100vh',
  background: '#f4f7f6', // Light background for better contrast
  display: 'flex',
  flexDirection: 'column'
};

const containerStyle = {
  padding: '40px',
  maxWidth: '1200px', // Prevents content from stretching too wide on large screens
  width: '100%',
  boxSizing: 'border-box'
};

export default Dashboard;