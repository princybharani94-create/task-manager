import React, { useState } from 'react';
import Sidebar from './components/Sidebar'; 
import Tasks from './components/Tasks';
import Profile from './components/Profile';
import Completed from './components/Completed';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('tasks');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const renderContent = () => {
    switch (activeTab) {
      case 'tasks': return <Tasks setActiveTab={setActiveTab} />;
      case 'completed': return <Completed />;
      case 'profile': return <Profile />;
      case 'reminders': return <Tasks setActiveTab={setActiveTab} onlyShowReminders={true} />;
      default: return <Tasks setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', background: '#f4f7f6' }}>
      
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar}
      />

      {!isSidebarOpen && (
        <button 
          onClick={toggleSidebar}
          style={{
            position: 'fixed',
            top: '20px',
            left: '20px',
            background: '#1a252f',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            padding: '10px 15px',
            fontSize: '24px',
            cursor: 'pointer',
            zIndex: 99
          }}
        >
          ☰
        </button>
      )}

      <div style={{ 
        flex: 1, 
        marginLeft: isSidebarOpen ? '280px' : '0px', 
        transition: 'margin-left 0.3s ease-in-out',
        padding: '40px',
        width: '100%'
      }}>
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;