import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import Login from './components/login';
import Dashboard from './Dashboard';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for login/logout events
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      {user ? <Dashboard /> : <Login />}
    </div>
  );
}

export default App;