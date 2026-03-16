import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const CompletedTasks = () => {
  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Only fetch tasks belonging to this user that are marked 'completed'
        const q = query(
          collection(db, "tasks"), 
          where("userId", "==", user.uid), 
          where("status", "==", "completed")
        );

        const unsubscribeTasks = onSnapshot(q, (snapshot) => {
          setCompletedTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => unsubscribeTasks();
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // PERMANENTLY DELETE TASK
  const handleDelete = async (taskId) => {
    if (window.confirm("Delete this completed task permanently?")) {
      await deleteDoc(doc(db, "tasks", taskId));
    }
  };

  // UNDO: Move task back to 'pending'
  const handleUndo = async (taskId) => {
    const taskRef = doc(db, "tasks", taskId);
    try {
      await updateDoc(taskRef, { status: "pending" });
    } catch (err) {
      console.error("Undo failed:", err);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial' }}>
      <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Finished Tasks</h2>
      
      <div style={{ marginTop: '20px' }}>
        {completedTasks.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center' }}>No finished tasks yet.</p>
        ) : (
          completedTasks.map(task => (
            <div key={task.id} style={taskBlockStyle}>
              <div style={{ flex: 1 }}>
                <span style={{ textDecoration: 'line-through', color: '#7f8c8d' }}>
                  {task.title}
                </span>
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => handleUndo(task.id)} style={undoBtnStyle}>
                  Undo
                </button>
                <button onClick={() => handleDelete(task.id)} style={deleteBtnStyle}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Styles
const taskBlockStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: '#fff',
  padding: '15px 20px',
  marginBottom: '10px',
  borderRadius: '10px',
  boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
  border: '1px solid #f1f1f1'
};

const undoBtnStyle = {
  background: '#3498db',
  color: 'white',
  border: 'none',
  padding: '8px 15px',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

const deleteBtnStyle = {
  background: '#e74c3c',
  color: 'white',
  border: 'none',
  padding: '8px 15px',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

export default CompletedTasks;