import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, query, where, onSnapshot, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Tasks = () => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [activeTasks, setActiveTasks] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch only 'pending' tasks for the logged-in user
        const q = query(
          collection(db, "tasks"), 
          where("userId", "==", currentUser.uid),
          where("status", "==", "pending")
        );
        const unsubTasks = onSnapshot(q, (snapshot) => {
          setActiveTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return unsubTasks;
      }
    });
    return unsubscribe;
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return alert("Please enter a task title");
    
    try {
      await addDoc(collection(db, "tasks"), {
        title: taskTitle,
        description: taskDesc,
        status: "pending",
        userId: user.uid,
        createdAt: new Date()
      });
      setTaskTitle("");
      setTaskDesc("");
    } catch (err) {
      alert("Error adding task: " + err.message);
    }
  };

  const markAsComplete = async (taskId) => {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, { status: "completed" });
  };

  const deleteTask = async (taskId) => {
    if (window.confirm("Delete this task?")) {
      await deleteDoc(doc(db, "tasks", taskId));
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>My Tasks</h2>
      
      {/* Task Input Section */}
      <form onSubmit={handleAddTask} style={formStyle}>
        <input 
          type="text" 
          placeholder="Task Title..." 
          value={taskTitle} 
          onChange={(e) => setTaskTitle(e.target.value)} 
          style={inputStyle} 
        />
        <textarea 
          placeholder="Description (Optional)..." 
          value={taskDesc} 
          onChange={(e) => setTaskDesc(e.target.value)} 
          style={{ ...inputStyle, height: '80px', resize: 'none' }} 
        />
        <button type="submit" style={addBtnStyle}>Add Task</button>
      </form>

      {/* Task List Section */}
      <div style={{ marginTop: '30px' }}>
        {activeTasks.length === 0 ? <p>No active tasks. Add one above!</p> : (
          activeTasks.map(task => (
            <div key={task.id} style={taskCardStyle}>
              <div>
                <h4 style={{ margin: '0 0 5px 0' }}>{task.title}</h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>{task.description}</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => markAsComplete(task.id)} style={completeBtnStyle}>Complete</button>
                <button onClick={() => deleteTask(task.id)} style={deleteBtnStyle}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Styles
const formStyle = { display: 'flex', flexDirection: 'column', gap: '10px', background: '#f4f4f4', padding: '20px', borderRadius: '8px' };
const inputStyle = { padding: '10px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '16px' };
const addBtnStyle = { background: '#2c3e50', color: 'white', border: 'none', padding: '12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };
const taskCardStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: '1px solid #eee', background: 'white', marginBottom: '10px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' };
const completeBtnStyle = { background: '#27ae60', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' };
const deleteBtnStyle = { background: '#e74c3c', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' };

export default Tasks;