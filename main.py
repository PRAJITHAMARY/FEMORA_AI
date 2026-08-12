from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import sqlite3
import datetime
import uuid
import json

from database import init_db, get_db_connection
from rag_engine import rag_engine

app = FastAPI(
    title="Femora API 🌸",
    description="Backend API services for Femora PCOS Wellness & AI Companion Platform",
    version="1.0.0"
)

# Enable CORS for frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_db()

# --- Pydantic Data Models ---
class UserRegister(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class ProfileUpdate(BaseModel):
    age: Optional[int] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    cycle_length_typical: Optional[int] = 28
    period_duration_typical: Optional[int] = 5
    last_period_date: Optional[str] = None
    tracking_preferences: Optional[List[str]] = None

class CycleCreate(BaseModel):
    start_date: str
    end_date: Optional[str] = None
    notes: Optional[str] = ""

class SymptomCreate(BaseModel):
    symptom: str
    severity: str  # Low, Moderate, High
    date: str
    notes: Optional[str] = ""

class LifestyleCreate(BaseModel):
    date: str
    sleep_hours: float
    exercise_minutes: int
    water_intake: int
    stress_level: str  # Low, Moderate, High
    notes: Optional[str] = ""

class ChatRequest(BaseModel):
    message: str
    user_id: Optional[str] = "demo-user-123"
    conversation_id: Optional[str] = None

class ConversationCreate(BaseModel):
    title: Optional[str] = "New Femora Conversation"
    user_id: Optional[str] = "demo-user-123"

class ConversationRename(BaseModel):
    title: str
    user_id: Optional[str] = "demo-user-123"

class MessageCreate(BaseModel):
    message: str
    user_id: Optional[str] = "demo-user-123"

# --- API Endpoints ---

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "Femora AI Platform", "time": datetime.datetime.now().isoformat()}

# Authentication Endpoints
@app.post("/api/auth/register")
def register(user: UserRegister):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE email = ?", (user.email,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="An account with this email already exists.")
    
    user_id = str(uuid.uuid4())
    cursor.execute(
        "INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)",
        (user_id, user.name, user.email, f"hash_{user.password}")
    )
    cursor.execute(
        "INSERT INTO profiles (user_id, age, height, weight, cycle_length_typical, period_duration_typical) VALUES (?, ?, ?, ?, ?, ?)",
        (user_id, 25, 165.0, 60.0, 28, 5)
    )
    conn.commit()
    conn.close()
    return {"message": "Account created successfully", "user": {"id": user_id, "name": user.name, "email": user.email}}

@app.post("/api/auth/login")
def login(user: UserLogin):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, email FROM users WHERE email = ?", (user.email,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        # Fallback to demo user for easy testing
        if user.email == "demo@femora.well" or user.email == "elena@femora.well":
            return {"user": {"id": "demo-user-123", "name": "Elena Rostova", "email": "elena@femora.well"}, "token": "demo-token-123"}
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    
    return {"user": {"id": row["id"], "name": row["name"], "email": row["email"]}, "token": f"token_{row['id']}"}

# Profile Endpoints
@app.get("/api/profile")
def get_profile(user_id: str = "demo-user-123"):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT u.name, u.email, p.* FROM users u JOIN profiles p ON u.id = p.user_id WHERE u.id = ?", (user_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    data = dict(row)
    if data.get("tracking_preferences"):
        try:
            data["tracking_preferences"] = json.loads(data["tracking_preferences"])
        except:
            data["tracking_preferences"] = ["Cycle", "Symptoms", "Sleep", "Stress", "Water"]
    return data

@app.put("/api/profile")
def update_profile(profile: ProfileUpdate, user_id: str = "demo-user-123"):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    prefs_str = json.dumps(profile.tracking_preferences) if profile.tracking_preferences else None
    cursor.execute(
        '''UPDATE profiles SET 
            age = COALESCE(?, age), 
            height = COALESCE(?, height), 
            weight = COALESCE(?, weight),
            cycle_length_typical = COALESCE(?, cycle_length_typical),
            period_duration_typical = COALESCE(?, period_duration_typical),
            last_period_date = COALESCE(?, last_period_date),
            tracking_preferences = COALESCE(?, tracking_preferences)
           WHERE user_id = ?''',
        (profile.age, profile.height, profile.weight, profile.cycle_length_typical, profile.period_duration_typical, profile.last_period_date, prefs_str, user_id)
    )
    conn.commit()
    conn.close()
    return {"message": "Profile updated successfully"}

# Cycle Endpoints
@app.get("/api/cycles")
def get_cycles(user_id: str = "demo-user-123"):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM cycles WHERE user_id = ? ORDER BY start_date DESC", (user_id,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/api/cycles")
def create_cycle(cycle: CycleCreate, user_id: str = "demo-user-123"):
    conn = get_db_connection()
    cursor = conn.cursor()
    cycle_id = str(uuid.uuid4())
    
    # Calculate cycle length if end date provided
    length = 28
    if cycle.end_date:
        try:
            d1 = datetime.datetime.strptime(cycle.start_date, "%Y-%m-%d")
            d2 = datetime.datetime.strptime(cycle.end_date, "%Y-%m-%d")
            length = (d2 - d1).days + 1
        except:
            pass

    cursor.execute(
        "INSERT INTO cycles (id, user_id, start_date, end_date, cycle_length, notes) VALUES (?, ?, ?, ?, ?, ?)",
        (cycle_id, user_id, cycle.start_date, cycle.end_date, length, cycle.notes)
    )
    # Also update profile's last_period_date
    cursor.execute("UPDATE profiles SET last_period_date = ? WHERE user_id = ?", (cycle.start_date, user_id))
    
    conn.commit()
    conn.close()
    return {"message": "Cycle logged successfully", "id": cycle_id}

@app.delete("/api/cycles/{cycle_id}")
def delete_cycle(cycle_id: str, user_id: str = "demo-user-123"):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM cycles WHERE id = ? AND user_id = ?", (cycle_id, user_id))
    conn.commit()
    conn.close()
    return {"message": "Cycle entry deleted"}

# Symptom Endpoints
@app.get("/api/symptoms")
def get_symptoms(user_id: str = "demo-user-123"):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM symptoms WHERE user_id = ? ORDER BY date DESC", (user_id,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/api/symptoms")
def create_symptom(symptom: SymptomCreate, user_id: str = "demo-user-123"):
    conn = get_db_connection()
    cursor = conn.cursor()
    s_id = str(uuid.uuid4())
    cursor.execute(
        "INSERT INTO symptoms (id, user_id, symptom, severity, date, notes) VALUES (?, ?, ?, ?, ?, ?)",
        (s_id, user_id, symptom.symptom, symptom.severity, symptom.date, symptom.notes)
    )
    conn.commit()
    conn.close()
    return {"message": "Symptom logged", "id": s_id}

@app.delete("/api/symptoms/{symptom_id}")
def delete_symptom(symptom_id: str, user_id: str = "demo-user-123"):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM symptoms WHERE id = ? AND user_id = ?", (symptom_id, user_id))
    conn.commit()
    conn.close()
    return {"message": "Symptom entry deleted"}

# Lifestyle Endpoints
@app.get("/api/lifestyle")
def get_lifestyle(user_id: str = "demo-user-123"):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM lifestyle_logs WHERE user_id = ? ORDER BY date DESC", (user_id,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/api/lifestyle")
def create_lifestyle(log: LifestyleCreate, user_id: str = "demo-user-123"):
    conn = get_db_connection()
    cursor = conn.cursor()
    l_id = str(uuid.uuid4())
    cursor.execute(
        "INSERT INTO lifestyle_logs (id, user_id, date, sleep_hours, exercise_minutes, water_intake, stress_level, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        (l_id, user_id, log.date, log.sleep_hours, log.exercise_minutes, log.water_intake, log.stress_level, log.notes)
    )
    conn.commit()
    conn.close()
    return {"message": "Daily wellness log saved", "id": l_id}

@app.put("/api/lifestyle/{log_id}")
def update_lifestyle(log_id: str, log: LifestyleCreate, user_id: str = "demo-user-123"):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE lifestyle_logs SET date = ?, sleep_hours = ?, exercise_minutes = ?, water_intake = ?, stress_level = ?, notes = ? WHERE id = ? AND user_id = ?",
        (log.date, log.sleep_hours, log.exercise_minutes, log.water_intake, log.stress_level, log.notes, log_id, user_id)
    )
    conn.commit()
    conn.close()
    return {"message": "Daily wellness log updated", "id": log_id}

@app.delete("/api/lifestyle/{log_id}")
def delete_lifestyle(log_id: str, user_id: str = "demo-user-123"):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM lifestyle_logs WHERE id = ? AND user_id = ?", (log_id, user_id))
    conn.commit()
    conn.close()
    return {"message": "Lifestyle log deleted"}

# Pattern Insights Endpoint
@app.get("/api/insights")
def get_insights(user_id: str = "demo-user-123"):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM insights WHERE user_id = ? ORDER BY date DESC", (user_id,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

# --- Conversation & History Endpoints ---

@app.post("/api/conversations")
def create_conversation(req: ConversationCreate):
    conn = get_db_connection()
    cursor = conn.cursor()
    conv_id = str(uuid.uuid4())
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    title = req.title if req.title else "New Femora Conversation"
    cursor.execute(
        "INSERT INTO conversations (id, user_id, title, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
        (conv_id, req.user_id, title, now_str, now_str)
    )
    conn.commit()
    conn.close()
    return {"id": conv_id, "user_id": req.user_id, "title": title, "created_at": now_str, "updated_at": now_str}

@app.get("/api/conversations")
def get_conversations(user_id: str = "demo-user-123"):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT c.*, 
               (SELECT COUNT(*) FROM chat_messages m WHERE m.conversation_id = c.id) as message_count,
               (SELECT content FROM chat_messages m WHERE m.conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message
        FROM conversations c 
        WHERE c.user_id = ? 
        ORDER BY c.updated_at DESC
        """,
        (user_id,)
    )
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.get("/api/conversations/{conversation_id}")
def get_conversation(conversation_id: str, user_id: str = "demo-user-123"):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM conversations WHERE id = ?", (conversation_id,))
    conv_row = cursor.fetchone()
    if not conv_row:
        conn.close()
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    conv = dict(conv_row)
    if conv["user_id"] != user_id:
        conn.close()
        raise HTTPException(status_code=403, detail="Access denied. You do not own this conversation.")
    
    cursor.execute(
        "SELECT * FROM chat_messages WHERE conversation_id = ? ORDER BY created_at ASC",
        (conversation_id,)
    )
    msg_rows = cursor.fetchall()
    conn.close()

    messages = []
    for r in msg_rows:
        m = dict(r)
        if m.get("structured_response"):
            try:
                m["structuredResponse"] = json.loads(m["structured_response"])
            except Exception:
                m["structuredResponse"] = None
        else:
            m["structuredResponse"] = None
        m["timestamp"] = m["created_at"]
        messages.append(m)

    return {"conversation": conv, "messages": messages}

@app.post("/api/conversations/{conversation_id}/messages")
def send_conversation_message(conversation_id: str, req: MessageCreate):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM conversations WHERE id = ?", (conversation_id,))
    conv_row = cursor.fetchone()
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    if not conv_row:
        # Create conversation automatically if not existing
        title = rag_engine.generate_conversation_title(req.message)
        cursor.execute(
            "INSERT INTO conversations (id, user_id, title, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
            (conversation_id, req.user_id, title, now_str, now_str)
        )
        conv = {"id": conversation_id, "user_id": req.user_id, "title": title}
    else:
        conv = dict(conv_row)
        if conv["user_id"] != req.user_id:
            conn.close()
            raise HTTPException(status_code=403, detail="Access denied. You do not own this conversation.")

    # 1. Save User Message
    user_msg_id = str(uuid.uuid4())
    cursor.execute(
        "INSERT INTO chat_messages (id, conversation_id, user_id, role, content, created_at) VALUES (?, ?, ?, ?, ?, ?)",
        (user_msg_id, conversation_id, req.user_id, "user", req.message, now_str)
    )

    # 2. Get recent history for context
    cursor.execute(
        "SELECT role, content FROM chat_messages WHERE conversation_id = ? ORDER BY created_at ASC",
        (conversation_id,)
    )
    history_rows = cursor.fetchall()
    history = [dict(r) for r in history_rows]

    # 3. Generate AI Response
    ai_response = rag_engine.generate_response(req.message, history=history)

    # 4. Save Assistant Message
    assistant_msg_id = str(uuid.uuid4())
    ai_response_json = json.dumps(ai_response)
    cursor.execute(
        "INSERT INTO chat_messages (id, conversation_id, user_id, role, content, structured_response, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
        (assistant_msg_id, conversation_id, req.user_id, "assistant", ai_response["simple_answer"], ai_response_json, now_str)
    )

    # 5. Check if title needs auto-updating
    updated_title = conv["title"]
    cursor.execute("SELECT COUNT(*) FROM chat_messages WHERE conversation_id = ?", (conversation_id,))
    msg_count = cursor.fetchone()[0]
    if msg_count <= 2 or conv["title"] == "New Femora Conversation":
        new_title = rag_engine.generate_conversation_title(req.message)
        cursor.execute("UPDATE conversations SET title = ? WHERE id = ?", (new_title, conversation_id))
        updated_title = new_title

    # Update conversation updated_at
    cursor.execute("UPDATE conversations SET updated_at = ? WHERE id = ?", (now_str, conversation_id))
    conn.commit()
    conn.close()

    user_msg_obj = {
        "id": user_msg_id,
        "conversation_id": conversation_id,
        "role": "user",
        "content": req.message,
        "timestamp": now_str
    }

    assistant_msg_obj = {
        "id": assistant_msg_id,
        "conversation_id": conversation_id,
        "role": "assistant",
        "content": ai_response["simple_answer"],
        "structuredResponse": ai_response,
        "timestamp": now_str
    }

    return {
        "user_message": user_msg_obj,
        "assistant_message": assistant_msg_obj,
        "conversation_title": updated_title
    }

@app.put("/api/conversations/{conversation_id}")
def rename_conversation(conversation_id: str, req: ConversationRename):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT user_id FROM conversations WHERE id = ?", (conversation_id,))
    conv_row = cursor.fetchone()
    if not conv_row:
        conn.close()
        raise HTTPException(status_code=404, detail="Conversation not found")
    if conv_row["user_id"] != req.user_id:
        conn.close()
        raise HTTPException(status_code=403, detail="Access denied. You do not own this conversation.")
    
    cursor.execute("UPDATE conversations SET title = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", (req.title, conversation_id))
    conn.commit()
    conn.close()
    return {"message": "Conversation renamed successfully", "title": req.title}

@app.delete("/api/conversations/{conversation_id}")
def delete_conversation(conversation_id: str, user_id: str = "demo-user-123"):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT user_id FROM conversations WHERE id = ?", (conversation_id,))
    conv_row = cursor.fetchone()
    if not conv_row:
        conn.close()
        raise HTTPException(status_code=404, detail="Conversation not found")
    if conv_row["user_id"] != user_id:
        conn.close()
        raise HTTPException(status_code=403, detail="Access denied. You do not own this conversation.")
    
    cursor.execute("DELETE FROM chat_messages WHERE conversation_id = ?", (conversation_id,))
    cursor.execute("DELETE FROM conversations WHERE id = ?", (conversation_id,))
    conn.commit()
    conn.close()
    return {"message": "Conversation deleted successfully"}

# Femora AI RAG Chat Endpoint (proxy)
@app.post("/api/chat")
def chat_with_femora(chat_req: ChatRequest):
    if chat_req.conversation_id:
        msg_req = MessageCreate(message=chat_req.message, user_id=chat_req.user_id)
        return send_conversation_message(chat_req.conversation_id, msg_req)
    res = rag_engine.generate_response(chat_req.message)
    return res

# RAG Knowledge Base Endpoints
@app.get("/api/knowledge")
def get_knowledge_base():
    return rag_engine.documents

@app.get("/api/knowledge/{doc_id}")
def get_knowledge_doc(doc_id: str):
    for doc in rag_engine.documents:
        if doc["id"] == doc_id:
            return doc
    raise HTTPException(status_code=404, detail="Document not found")

# Health Summary Generator Endpoint
@app.get("/api/summary")
def get_health_summary(user_id: str = "demo-user-123"):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT u.name, u.email, p.* FROM users u JOIN profiles p ON u.id = p.user_id WHERE u.id = ?", (user_id,))
    user_row = cursor.fetchone()
    
    cursor.execute("SELECT * FROM cycles WHERE user_id = ? ORDER BY start_date DESC LIMIT 5", (user_id,))
    cycles = [dict(r) for r in cursor.fetchall()]
    
    cursor.execute("SELECT * FROM symptoms WHERE user_id = ? ORDER BY date DESC LIMIT 10", (user_id,))
    symptoms = [dict(r) for r in cursor.fetchall()]
    
    cursor.execute("SELECT * FROM lifestyle_logs WHERE user_id = ? ORDER BY date DESC LIMIT 7", (user_id,))
    lifestyle = [dict(r) for r in cursor.fetchall()]

    cursor.execute("SELECT * FROM insights WHERE user_id = ? ORDER BY date DESC LIMIT 3", (user_id,))
    insights = [dict(r) for r in cursor.fetchall()]
    
    conn.close()
    
    # Calculate stats
    avg_sleep = round(sum(l["sleep_hours"] for l in lifestyle) / len(lifestyle), 1) if lifestyle else 0.0
    avg_exercise = round(sum(l["exercise_minutes"] for l in lifestyle) / len(lifestyle), 0) if lifestyle else 0
    top_symptoms = list(set([s["symptom"] for s in symptoms]))[:4]

    return {
        "user_name": user_row["name"] if user_row else "Elena Rostova",
        "generated_at": datetime.date.today().isoformat(),
        "disclaimer": "Personal tracking summary for healthcare discussion — NOT a medical diagnosis or medical report.",
        "profile": dict(user_row) if user_row else {},
        "recent_cycles": cycles,
        "recent_symptoms": symptoms,
        "recent_lifestyle": lifestyle,
        "observed_insights": insights,
        "summary_stats": {
            "avg_sleep_hours": avg_sleep,
            "avg_exercise_mins": avg_exercise,
            "frequent_symptoms": top_symptoms,
            "tracked_days_count": len(lifestyle)
        }
    }
