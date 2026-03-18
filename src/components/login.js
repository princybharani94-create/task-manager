import React, { useState } from 'react';
import { auth } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  setPersistence, 
  browserSessionPersistence 
} from 'firebase/auth';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); 
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Email Validation (.com, .in, .net only)
    const emailRegex = /\.(com|in|net)$/;
    if (!emailRegex.test(email)) {
      alert("Email must end with .com, .in, or .net");
      return;
    }

    // 2. Password Validation (Exactly 8 characters)
    if (password.length !== 8) {
      alert("Password must be exactly 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      await setPersistence(auth, browserSessionPersistence);

      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={{ marginBottom: '20px', color: '#333' }}>
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>
        
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          style={inputStyle} 
          required 
        />

        <div style={{ position: 'relative' }}>
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="Password (8 characters)" 
            value={password} 
            // Optional: prevent typing more than 8 characters in the UI
            onChange={(e) => setPassword(e.target.value.slice(0, 8))} 
            style={inputStyle} 
            required 
          />
          
          <div style={checkboxContainer}>
            <input 
              type="checkbox" 
              id="showPass" 
              checked={showPassword} 
              onChange={() => setShowPassword(!showPassword)} 
            />
            <label htmlFor="showPass" style={{ marginLeft: '5px', fontSize: '13px', color: '#666' }}>
              Show Password
            </label>
          </div>
        </div>

        <button type="submit" style={btnStyle} disabled={loading}>
          {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
        </button>

        <p 
          onClick={() => {
            setIsSignUp(!isSignUp);
            setEmail('');
            setPassword('');
          }} 
          style={{ cursor: 'pointer', color: '#3498db', marginTop: '15px', fontSize: '14px' }}
        >
          {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
        </p>
      </form>
    </div>
  );
};

// --- Styles ---
const containerStyle = { 
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center', 
  height: '100vh', 
  background: '#f4f7f6',
  fontFamily: 'Arial, sans-serif'
};

const formStyle = { 
  background: 'white', 
  padding: '40px 30px', 
  borderRadius: '16px', 
  boxShadow: '0 10px 25px rgba(0,0,0,0.05)', 
  textAlign: 'center', 
  width: '350px' 
};

const inputStyle = { 
  display: 'block', 
  width: '100%', 
  marginBottom: '15px', 
  padding: '14px', 
  borderRadius: '8px', 
  border: '1px solid #e0e0e0', 
  boxSizing: 'border-box',
  fontSize: '14px',
  backgroundColor: '#f9f9f9'
};

const checkboxContainer = { 
  display: 'flex', 
  alignItems: 'center', 
  marginBottom: '20px', 
  paddingLeft: '5px' 
};

const btnStyle = { 
  width: '100%', 
  padding: '14px', 
  background: '#3498db', 
  color: 'white', 
  border: 'none', 
  borderRadius: '8px', 
  cursor: 'pointer', 
  fontWeight: 'bold',
  fontSize: '16px',
  transition: 'background 0.3s'
};

export default Login;