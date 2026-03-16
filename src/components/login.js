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
  const [showPassword, setShowPassword] = useState(false); // State for toggling visibility

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // FIX: Set persistence to Session so it doesn't auto-log in next time
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
        <h2>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
        
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
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={inputStyle} 
            required 
          />
          {/* Show Password Toggle */}
          <div style={checkboxContainer}>
            <input 
              type="checkbox" 
              id="showPass" 
              checked={showPassword} 
              onChange={() => setShowPassword(!showPassword)} 
            />
            <label htmlFor="showPass" style={{ marginLeft: '5px', fontSize: '13px' }}>
              Show Password
            </label>
          </div>
        </div>

        <button type="submit" style={btnStyle} disabled={loading}>
          {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
        </button>

        <p onClick={() => setIsSignUp(!isSignUp)} style={{ cursor: 'pointer', color: '#3498db', marginTop: '15px' }}>
          {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
        </p>
      </form>
    </div>
  );
};

// Styles
const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f4f7f6' };
const formStyle = { background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', textAlign: 'center', width: '320px' };
const inputStyle = { display: 'block', width: '100%', marginBottom: '10px', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' };
const checkboxContainer = { display: 'flex', alignItems: 'center', marginBottom: '15px', textAlign: 'left' };
const btnStyle = { width: '100%', padding: '12px', background: '#3498db', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };

export default Login;