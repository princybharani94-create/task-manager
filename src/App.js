import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import Login from './components/login';
import Dashboard from './Dashboard';

function App() {
  const [user, setUser] = useState(null);
  // 1. Move the sidebar state here so both Sidebar and Content can see it
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // 2. This style pushes your "My Tasks" and "Profile" to the right
  const mainContentStyle = {
    marginLeft: isSidebarOpen ? '280px' : '0', // Matches sidebar width
    transition: 'margin-left 0.3s ease-in-out',
    minHeight: '100vh',
    width: 'auto',
    backgroundColor: '#f8f9fa' // Optional: light background for contrast
  };

  return (
    <div className="App">
      {user ? (
        <div style={{ display: 'flex' }}>
          {/* Pass the state and the toggle function to Dashboard */}
          <Dashboard 
            isSidebarOpen={isSidebarOpen} 
            toggleSidebar={toggleSidebar} 
            mainContentStyle={mainContentStyle}
          />
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;