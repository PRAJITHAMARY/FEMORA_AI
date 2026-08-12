# 🌸 Femora AI

## AI-Powered PCOS Wellness & Personal Health Companion

Femora AI is an intelligent wellness platform designed to help women track, understand, and manage PCOS-related health patterns through personalized health tracking, AI-powered conversations, evidence-based knowledge retrieval, and data-driven wellness insights.

The platform combines **Artificial Intelligence, Retrieval-Augmented Generation (RAG), personal health tracking, and wellness pattern analysis** into a single user-friendly application.

> **Medical Disclaimer:** Femora AI is an educational and wellness companion. It does not diagnose medical conditions or replace professional medical advice.

---

## 🎯 Problem Statement

Polycystic Ovary Syndrome (PCOS) can affect menstrual cycles, symptoms, energy levels, sleep, stress, lifestyle, and overall well-being.

Many users face challenges such as:

- Difficulty maintaining consistent health records
- Scattered PCOS-related information
- Difficulty identifying personal wellness patterns
- Generic health advice that does not consider individual tracking data
- Lack of a single platform for tracking symptoms and lifestyle
- Difficulty organizing health information for discussions with healthcare professionals

Femora AI addresses these challenges by bringing **health tracking, AI assistance, knowledge retrieval, and personalized wellness insights together in one platform.**

---

## 💡 Solution

Femora AI provides a centralized digital wellness companion where users can:

- Track menstrual cycles
- Record symptoms and severity
- Monitor sleep, exercise, hydration, and stress
- Ask PCOS-related questions through an AI chatbot
- Retrieve information from a curated health knowledge base
- View personal wellness patterns
- Maintain AI conversation history
- Generate a personal health summary

The goal is to help users better understand their personal wellness patterns and make informed lifestyle decisions.

---

# ✨ Key Features

## 🌸 1. Personalized Health Profile

Users can maintain personal information such as:

- Age
- Height
- Weight
- Typical cycle length
- Period duration
- Last period date
- Tracking preferences

---

## 🩸 2. Menstrual Cycle Tracking

Users can record and manage:

- Period start date
- Period end date
- Cycle length
- Notes and observations

Historical cycle records help users understand their individual cycle patterns.

---

## 📝 3. Symptom Tracking

Users can record symptoms such as:

- Acne
- Fatigue
- Bloating
- Hair-related concerns
- Other personal symptoms

Each symptom can include:

- Severity
- Date
- Notes

---

## 💤 4. Lifestyle & Wellness Tracking

Femora AI allows users to track:

- Sleep duration
- Exercise duration
- Water intake
- Stress level
- Daily notes

This information can be used to identify relationships between lifestyle habits and reported symptoms.

---

## 🤖 5. AI Wellness Companion

Users can interact with Femora AI through an AI-powered chatbot.

The chatbot provides educational information about:

- PCOS basics
- Symptoms
- Nutrition
- Sleep
- Exercise
- Menstrual cycles
- Stress management
- General wellness

---

## 📚 6. RAG-Based Knowledge Retrieval

Femora AI uses a Retrieval-Augmented Generation approach to retrieve relevant information from a curated knowledge base.

The current RAG engine uses:

- TF-IDF Vectorization
- Cosine Similarity
- Relevant document retrieval
- Context-based response generation

This allows the system to retrieve relevant information before generating a response.

---

## 🔐 7. AI Safety Layer

Femora AI includes safety checks for sensitive medical queries.

The system identifies:

- Diagnostic requests
- Medication-related questions
- Emergency-related symptoms

The system provides appropriate safety guidance and reminds users that Femora AI is not a medical diagnostic system.

---

## 💬 8. Conversation History

Users can:

- Create conversations
- Continue previous conversations
- View chat history
- Rename conversations
- Delete conversations

The system also uses recent conversation context to improve follow-up questions.

---

## 📊 9. Wellness Insights

Femora AI can identify patterns from tracked lifestyle and symptom data.

For example:

> Days with lower sleep duration may coincide with increased symptom reporting.

These observations are presented as **tracking patterns and not medical diagnoses.**

---

## 📋 10. Health Summary

Users can generate a structured wellness summary containing:

- Personal profile
- Recent cycles
- Recent symptoms
- Lifestyle records
- Observed insights
- Average sleep
- Average exercise
- Frequently recorded symptoms

This summary can help users organize information for discussions with healthcare professionals.

---

# 🧠 System Architecture

```text
                    ┌─────────────────────┐
                    │        USER         │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │    TypeScript UI    │
                    └──────────┬──────────┘
                               │
                         REST API Calls
                               │
                               ▼
                    ┌─────────────────────┐
                    │   FastAPI Backend   │
                    │   API & Processing  │
                    └───────┬───────┬─────┘
                            │       │
                 ┌──────────┘       └──────────┐
                 ▼                             ▼
       ┌──────────────────┐          ┌──────────────────┐
       │ SQLite Database  │          │    RAG Engine    │
       │                  │          │                  │
       │ Users            │          │ Knowledge Base   │
       │ Profiles         │          │ TF-IDF           │
       │ Cycles           │          │ Cosine Similarity│
       │ Symptoms         │          │ Retrieval        │
       │ Lifestyle Logs   │          │ Safety Layer     │
       │ Conversations    │          └────────┬─────────┘
       └──────────────────┘                   │
                                              ▼
                                   ┌────────────────────┐
                                   │ AI Wellness        │
                                   │ Response           │
                                   └────────────────────┘
