import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, deleteField } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Profile = () => {
  const [userData, setUserData] = useState({ name: "", mobile: "", email: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserData((prev) => ({ ...prev, email: user.email || "" }));
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData({
            name: data.name || "",
            mobile: data.mobile || "",
            email: user.email || ""
          });
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Updated handler to only allow 10 digits
  const handleMobileChange = (e) => {
    const value = e.target.value;
    // Remove any non-numeric characters and limit to 10
    const numericValue = value.replace(/\D/g, '').slice(0, 10);
    setUserData({ ...userData, mobile: numericValue });
  };

  const handleSaveProfile = async () => {
    if (!auth.currentUser) return alert("Please log in!");
    
    // Basic validation check before saving
    if (userData.mobile && userData.mobile.length !== 10) {
      return alert("Mobile number must be exactly 10 digits.");
    }

    setLoading(true);
    try {
      await setDoc(doc(db, "users", auth.currentUser.uid), {
        name: userData.name,
        mobile: userData.mobile,
        email: userData.email
      }, { merge: true });
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClearProfile = async () => {
    if (!window.confirm("Clear your saved info?")) return;
    setLoading(true);
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, { name: deleteField(), mobile: deleteField() });
      setUserData({ name: "", mobile: "", email: auth.currentUser.email });
      alert("Profile info cleared!");
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'Arial' }}>
      <h1>Profile Settings</h1>
      <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'left', background: '#f9f9f9', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold' }}>Full Name</label>
          <input 
            type="text" 
            value={userData.name} 
            onChange={(e) => setUserData({...userData, name: e.target.value})} 
            style={inputStyle} 
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold' }}>Mobile Number</label>
          <input 
            type="tel" 
            placeholder="10-digit number"
            value={userData.mobile} 
            onChange={handleMobileChange} 
            maxLength="10"
            style={inputStyle} 
          />
        </div>
        <div style={{ marginBottom: '25px' }}>
          <label style={{ fontWeight: 'bold' }}>Email Address</label>
          <input 
            type="email" 
            value={userData.email} 
            disabled 
            style={{ ...inputStyle, background: '#eee', cursor: 'not-allowed' }} 
          />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleSaveProfile} style={saveBtnStyle} disabled={loading}>
            {loading ? "Saving..." : "Update Profile"}
          </button>
          <button onClick={handleClearProfile} style={clearBtnStyle} disabled={loading}>
            Clear Info
          </button>
        </div>
      </div>
    </div>
  );
};

const inputStyle = { width: '100%', padding: '12px', marginTop: '8px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '16px' };
const saveBtnStyle = { flex: 2, background: '#2ecc71', color: '#fff', border: 'none', padding: '14px', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' };
const clearBtnStyle = { flex: 1, background: '#e74c3c', color: '#fff', border: 'none', padding: '14px', borderRadius: '5px', cursor: 'pointer', fontSize: '14px' };

export default Profile;