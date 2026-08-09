import sqlite3
import os
import datetime
import json
from typing import List, Dict, Any, Optional

DB_PATH = os.path.join(os.path.dirname(__file__), "femora.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Users Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Profiles Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS profiles (
            user_id TEXT PRIMARY KEY,
            age INTEGER,
            height REAL,
            weight REAL,
            cycle_length_typical INTEGER DEFAULT 28,
            period_duration_typical INTEGER DEFAULT 5,
            last_period_date TEXT,
            tracking_preferences TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')

    # Cycles Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS cycles (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            start_date TEXT NOT NULL,
            end_date TEXT,
            cycle_length INTEGER,
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')

    # Symptoms Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS symptoms (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            symptom TEXT NOT NULL,
            severity TEXT NOT NULL,
            date TEXT NOT NULL,
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')

    # Lifestyle Logs Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS lifestyle_logs (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            date TEXT NOT NULL,
            sleep_hours REAL NOT NULL,
            exercise_minutes INTEGER NOT NULL,
            water_intake INTEGER NOT NULL,
            stress_level TEXT NOT NULL,
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')

    # Insights Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS insights (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            insight_text TEXT NOT NULL,
            disclaimer TEXT NOT NULL,
            date TEXT NOT NULL,
            data_points TEXT
        )
    ''')

    # Conversations Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS conversations (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            title TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')

    # Chat Messages Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS chat_messages (
            id TEXT PRIMARY KEY,
            conversation_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            structured_response TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (conversation_id) REFERENCES conversations (id),
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')

    conn.commit()
    conn.close()
    
    # Seed default user and demo data if empty
    seed_demo_data()

def seed_demo_data():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] == 0:
        demo_user_id = "demo-user-123"
        cursor.execute(
            "INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)",
            (demo_user_id, "Elena Rostova", "elena@femora.well", "pbkdf2_demo_hash_123")
        )

        cursor.execute(
            "INSERT INTO profiles (user_id, age, height, weight, cycle_length_typical, period_duration_typical, last_period_date, tracking_preferences) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            (demo_user_id, 27, 165.0, 62.5, 32, 5, "2026-08-01", json.dumps(["Cycle", "Symptoms", "Sleep", "Stress", "Water"]))
        )

        # Seed realistic cycle history
        cycles = [
            ("c1", demo_user_id, "2026-08-01", "2026-08-05", 32, "Moderate flow, day 2 mild cramps"),
            ("c2", demo_user_id, "2026-06-30", "2026-07-04", 31, "Normal flow, light fatigue"),
            ("c3", demo_user_id, "2026-05-28", "2026-06-01", 33, "Started after high stress week"),
            ("c4", demo_user_id, "2026-04-25", "2026-04-29", 30, "Log recorded on time")
        ]
        cursor.executemany("INSERT INTO cycles (id, user_id, start_date, end_date, cycle_length, notes) VALUES (?, ?, ?, ?, ?, ?)", cycles)

        # Seed symptoms over past weeks
        symptoms = [
            ("s1", demo_user_id, "Acne", "Moderate", "2026-08-08", "Lower jawline breakout"),
            ("s2", demo_user_id, "Fatigue", "High", "2026-08-07", "Felt sluggish in the afternoon"),
            ("s3", demo_user_id, "Bloating", "Low", "2026-08-06", "After evening meal"),
            ("s4", demo_user_id, "Mood changes", "Moderate", "2026-08-05", "Irritability noted"),
            ("s5", demo_user_id, "Headache", "Low", "2026-08-04", "Resolved with hydration"),
            ("s6", demo_user_id, "Acne", "High", "2026-08-03", "Jawline flare up"),
            ("s7", demo_user_id, "Sleep difficulty", "High", "2026-08-02", "Took over an hour to sleep"),
            ("s8", demo_user_id, "Fatigue", "Moderate", "2026-08-01", "Day 1 of cycle")
        ]
        cursor.executemany("INSERT INTO symptoms (id, user_id, symptom, severity, date, notes) VALUES (?, ?, ?, ?, ?, ?)", symptoms)

        # Seed daily lifestyle logs for past 10 days
        lifestyle = [
            ("l1", demo_user_id, "2026-08-09", 7.5, 30, 8, "Low", "Morning walk & gentle yoga"),
            ("l2", demo_user_id, "2026-08-08", 6.0, 15, 6, "High", "Busy work deadline day"),
            ("l3", demo_user_id, "2026-08-07", 5.5, 0, 5, "High", "Late night screening"),
            ("l4", demo_user_id, "2026-08-06", 8.0, 45, 9, "Low", "Pilates session & early sleep"),
            ("l5", demo_user_id, "2026-08-05", 7.0, 20, 7, "Moderate", "Balanced day"),
            ("l6", demo_user_id, "2026-08-04", 6.5, 25, 6, "Moderate", "Light evening walk"),
            ("l7", demo_user_id, "2026-08-03", 5.5, 0, 4, "High", "Poor sleep, skipped water target"),
            ("l8", demo_user_id, "2026-08-02", 6.0, 10, 5, "High", "Restless night"),
            ("l9", demo_user_id, "2026-08-01", 7.5, 30, 8, "Low", "Cycle day 1 rest"),
            ("l10", demo_user_id, "2026-07-31", 8.0, 40, 8, "Low", "Weekend recharge")
        ]
        cursor.executemany("INSERT INTO lifestyle_logs (id, user_id, date, sleep_hours, exercise_minutes, water_intake, stress_level, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", lifestyle)

        # Seed pattern insights
        insights = [
            (
                "in1", demo_user_id, "Sleep Duration vs. Symptom Frequency", "Sleep & Symptoms",
                "During days when you logged fewer than 6.5 hours of sleep (Aug 2, Aug 3, Aug 7), you were 2.5x more likely to record higher symptom severity (Fatigue & Acne).",
                "These insights describe patterns in your tracking data and are not medical diagnoses.",
                "2026-08-08", "10 Daily Logs Analyzed"
            ),
            (
                "in2", demo_user_id, "Hydration & Energy Levels", "Lifestyle & Energy",
                "Days with 8+ glasses of water correlated with lower reported fatigue and more consistent evening relaxation.",
                "These insights describe patterns in your tracking data and are not medical diagnoses.",
                "2026-08-07", "7 Days Tracking"
            ),
            (
                "in3", demo_user_id, "Cycle Length Consistency", "Cycle Rhythms",
                "Your tracked cycle length has averaged 31.5 days over your last 4 logged cycles, staying within a consistent window.",
                "These insights describe patterns in your tracking data and are not medical diagnoses.",
                "2026-08-01", "4 Logged Cycles"
            )
        ]
        cursor.executemany("INSERT INTO insights (id, user_id, title, category, insight_text, disclaimer, date, data_points) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", insights)

        conn.commit()

    # Check if conversations need seeding for demo user
    cursor.execute("SELECT COUNT(*) FROM conversations")
    if cursor.fetchone()[0] == 0:
        demo_user_id = "demo-user-123"
        now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        yesterday_str = (datetime.datetime.now() - datetime.timedelta(days=1)).strftime("%Y-%m-%d %H:%M:%S")
        
        convs = [
            ("conv-101", demo_user_id, "Understanding PCOS Symptoms", now_str, now_str),
            ("conv-102", demo_user_id, "Sleep and Wellbeing", yesterday_str, yesterday_str)
        ]
        cursor.executemany("INSERT INTO conversations (id, user_id, title, created_at, updated_at) VALUES (?, ?, ?, ?, ?)", convs)

        resp_pcos = json.dumps({
            "simple_answer": "Polycystic Ovary Syndrome (PCOS) is a common hormonal and metabolic condition that manifests differently in every body.",
            "what_to_know": "Key aspects often involve insulin sensitivity, ovulatory rhythms, and androgen production. It is manageable through personalized lifestyle support and medical care.",
            "wellness_considerations": "Focus on small, sustainable daily habits—balanced nutrition, low-stress movement, and restorative sleep.",
            "sources": [{"title": "PCOS Basics Overview", "source": "WHO & Endocrine Society", "category": "PCOS Basics"}],
            "safety_disclaimer": "Femora provides educational and wellness support and does not replace professional medical advice."
        })

        resp_symptoms = json.dumps({
            "simple_answer": "Commonly recorded PCOS symptoms include irregular cycle timing, acne, fatigue, hair changes, and bloating.",
            "what_to_know": "Hormonal variations like higher circulating androgens or insulin resistance can influence physical symptoms over time.",
            "wellness_considerations": "Tracking symptoms alongside sleep and stress can highlight personal patterns for doctor discussions.",
            "sources": [{"title": "Common Symptoms & Hormonal Factors", "source": "Endocrine Society Guidelines", "category": "Symptoms"}],
            "safety_disclaimer": "Femora provides educational and wellness support and does not replace professional medical advice."
        })

        resp_sleep = json.dumps({
            "simple_answer": "Consistent sleep is one of the most effective foundations for supporting hormonal balance and regulating cortisol.",
            "what_to_know": "Getting 7 to 9 hours of restorative sleep helps stabilize appetite hormones and improves cellular insulin sensitivity.",
            "wellness_considerations": "Maintain a wind-down routine 30 minutes before bed and limit blue-light exposure.",
            "sources": [{"title": "Restorative Sleep & Endocrine Balance", "source": "Sleep Medicine Reviews", "category": "Sleep & Stress"}],
            "safety_disclaimer": "Femora provides educational and wellness support and does not replace professional medical advice."
        })

        messages = [
            ("m-1", "conv-101", demo_user_id, "user", "What is PCOS?", None, now_str),
            ("m-2", "conv-101", demo_user_id, "assistant", "Polycystic Ovary Syndrome (PCOS) is a common hormonal and metabolic condition that manifests differently in every body.", resp_pcos, now_str),
            ("m-3", "conv-101", demo_user_id, "user", "What symptoms can occur?", None, now_str),
            ("m-4", "conv-101", demo_user_id, "assistant", "Commonly recorded PCOS symptoms include irregular cycle timing, acne, fatigue, hair changes, and bloating.", resp_symptoms, now_str),
            ("m-5", "conv-102", demo_user_id, "user", "Tell me about sleep.", None, yesterday_str),
            ("m-6", "conv-102", demo_user_id, "assistant", "Consistent sleep is one of the most effective foundations for supporting hormonal balance and regulating cortisol.", resp_sleep, yesterday_str)
        ]
        cursor.executemany("INSERT INTO chat_messages (id, conversation_id, user_id, role, content, structured_response, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)", messages)

        conn.commit()

    conn.close()
