import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  deleteDoc, 
  updateDoc 
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Tasks = ({ setActiveTab, onlyShowReminders }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [activeTasks, setActiveTasks] = useState([]);
  const [user, setUser] = useState(null);

  // 1. Listen for Auth and Fetch Data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
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

  // 2. Core Functions (Defined inside the component to avoid 'not-undef' errors)
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return alert("Please enter a title");
    await addDoc(collection(db, "tasks"), {
      title: taskTitle,
      description: taskDesc,
      status: "pending",
      userId: user.uid,
      reminder: reminderTime,
      reminderSent: false,
      createdAt: new Date()
    });
    setTaskTitle(""); setTaskDesc(""); setReminderTime("");
  };

  const markAsComplete = async (taskId) => {
    await updateDoc(doc(db, "tasks", taskId), { status: "completed" });
  };

  const deleteTask = async (taskId) => {
    if (window.confirm("Delete this task?")) {
      await deleteDoc(doc(db, "tasks", taskId));
    }
  };

  const markReminderAsSent = async (taskId) => {
    await updateDoc(doc(db, "tasks", taskId), { reminderSent: true });
  };

  // 3. Notification Logic with Auto-Check
  useEffect(() => {
    const checkReminders = setInterval(() => {
      const now = new Date();
      // Format current time to match the 'datetime-local' input format
      const currentTimeString = now.getFullYear() + '-' + 
                               String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                               String(now.getDate()).padStart(2, '0') + 'T' + 
                               String(now.getHours()).padStart(2, '0') + ':' + 
                               String(now.getMinutes()).padStart(2, '0');

      activeTasks.forEach(task => {
        if (task.reminder === currentTimeString && !task.reminderSent) {
          if (Notification.permission === "granted") {
            new Notification("Task Reminder!", { body: task.title });
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
            audio.play().catch(() => {});
            
            // This triggers the "Reminder Given" button to auto-check
            markReminderAsSent(task.id);
          }
        }
      });
    }, 60000); // Checks every minute
    return () => clearInterval(checkReminders);
  }, [activeTasks]);

  const displayedTasks = onlyShowReminders 
    ? activeTasks.filter(task => task.reminder && task.reminder !== "")
    : activeTasks;

  return (
    <div style={{ padding: '40px', maxWidth: '750px', margin: '0 auto' }}>
      <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>
        {onlyShowReminders ? "Reminder Block" : "My Tasks"}
      </h2>
      
      {!onlyShowReminders && (
        <form onSubmit={handleAddTask} style={formStyle}>
          <input type="text" placeholder="Task Title..." value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} style={inputStyle} />
          <textarea placeholder="Description (Optional)..." value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)} style={{ ...inputStyle, height: '60px', resize: 'none' }} />
          <label style={{fontSize: '12px', color: '#666', marginBottom: '-5px'}}>Set Reminder:</label>
          <input type="datetime-local" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)} style={inputStyle} />
          <button type="submit" style={addBtnStyle}>Add Task</button>
        </form>
      )}

      <div style={{ marginTop: '30px' }}>
        {displayedTasks.length === 0 ? <p>No tasks here.</p> : displayedTasks.map(task => (
          <div key={task.id} style={taskCardStyle}>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0' }}>{task.title}</h4>
              <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>{task.description}</p>
              {task.reminder && <span style={{ fontSize: '12px', color: '#e67e22', fontWeight: 'bold' }}>⏰ {new Date(task.reminder).toLocaleString()}</span>}
            </div>
            
            <div style={{ display: 'flex', gap: '8px', marginLeft: '10px' }}>
              <button onClick={() => markAsComplete(task.id)} style={completeBtnStyle}>Complete</button>
              
              <button 
                onClick={() => !onlyShowReminders && setActiveTab("reminders")} 
                style={{
                  ...reminderBtnStyle,
                  // Auto-switches background color when reminder is given
                  backgroundColor: task.reminderSent ? '#27ae60' : (onlyShowReminders ? '#d35400' : '#f39c12'),
                  cursor: onlyShowReminders ? 'default' : 'pointer'
                }}
              >
                {/* Auto-switches text when reminder is given */}
                {task.reminderSent ? "✓ Reminder Given" : (onlyShowReminders ? "Reminder Given" : "View in Reminders")}
              </button>
              
              <button onClick={() => deleteTask(task.id)} style={deleteBtnStyle}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Styles (Fixed definitions to stop terminal errors) ---
const formStyle = { display: 'flex', flexDirection: 'column', gap: '10px', background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' };
const inputStyle = { padding: '10px', borderRadius: '4px', border: '1px solid #ddd' };
const addBtnStyle = { background: '#2c3e50', color: '#fff', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };
const taskCardStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: '#fff', marginBottom: '15px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #eee' };
const completeBtnStyle = { background: '#27ae60', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', fontSize: '13px' };
const reminderBtnStyle = { color: 'white', border: 'none', padding: '8px 12px', borderRadius: '5px', fontSize: '13px', transition: '0.3s' };
const deleteBtnStyle = { background: '#e74c3c', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer', fontSize: '13px' };

export default Tasks;