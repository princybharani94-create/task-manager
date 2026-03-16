import firebase_admin
from firebase_admin import credentials, firestore
from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

cred = credentials.Certificate("serviceAccountKey.json")
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

db = firestore.client()

class Task(BaseModel):
    title: str
    desc: str
    status: Optional[str] = "pending"
    reminder: Optional[str] = None

@app.get("/tasks")
def get_tasks():
    try:
        tasks_list = []
        docs = db.collection("tasks").stream()
        for doc in docs:
            task = doc.to_dict()
            task["id"] = doc.id
            tasks_list.append(task)
        return tasks_list
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/tasks")
def add_task(task: Task):
    try:
        doc_ref = db.collection("tasks").document()
        doc_ref.set(task.model_dump())
        return {"message": "Task saved", "id": doc_ref.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.patch("/tasks/{task_id}")
def update_task(task_id: str, reminder: Optional[str] = Query(None), status: Optional[str] = Query(None)):
    try:
        doc_ref = db.collection("tasks").document(task_id)
        update_data = {}
        if status: update_data["status"] = status
        if reminder: update_data["reminder"] = reminder
        if update_data:
            doc_ref.update(update_data)
        return {"message": "Updated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/tasks/{task_id}")
def delete_task(task_id: str):
    try:
        db.collection("tasks").document(task_id).delete()
        return {"message": "Deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)