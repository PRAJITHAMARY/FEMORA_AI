 <div align="center">

# 🌸 FEMORA AI

### AI-Powered PCOS Wellness & Personal Health Companion

<img src="https://readme-typing-svg.demolab.com?font=Cormorant+Garamond&size=28&duration=3000&pause=900&color=E58BB5&center=true&vCenter=true&width=750&lines=Your+Health%2C+Your+Patterns%2C+Your+Wellness;Understand+Your+Body+with+AI;A+Smarter+Companion+for+PCOS+Wellness" alt="Animated Femora AI heading" />

*Empowering women to understand their health through Artificial Intelligence, personalized tracking, and meaningful wellness insights.*

<p align="center">
  <a href="https://femora-ai-frontend.onrender.com/" target="_blank">
    <img src="https://img.shields.io/badge/🌸%20LIVE%20PROJECT-Explore%20Femora%20AI-E9A1C0?style=for-the-badge&labelColor=382638&color=E9A1C0" alt="Live Femora AI Project" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/AI-Powered-CB91BD?style=flat-square" />
  <img src="https://img.shields.io/badge/Healthcare-Wellness-E8A2B8?style=flat-square" />
  <img src="https://img.shields.io/badge/RAG-Technology-B8A5D6?style=flat-square" />
  <img src="https://img.shields.io/badge/Status-Live-9DBD9B?style=flat-square" />
</p>

</div>

---

## 1. Project Concept & Creative Vision

**Femora AI** is an intelligent digital wellness companion designed to help women track, understand, and manage PCOS-related health patterns through personalized health tracking, AI-powered conversations, and evidence-based knowledge retrieval.

Polycystic Ovary Syndrome (PCOS) can influence several aspects of everyday life, including menstrual cycles, energy levels, sleep, stress, symptoms, and lifestyle habits.

However, managing these different health aspects often means relying on multiple applications, scattered records, and generic information.

**Femora AI** brings these experiences together in one centralized platform where personal health data meets Artificial Intelligence.

The vision is to create a supportive digital environment where users can:

- **Track** → Record menstrual cycles, symptoms, and daily wellness activities.
- **Understand** → Explore personal health patterns through organized tracking records.
- **Ask** → Interact with an AI-powered wellness chatbot.
- **Discover** → Retrieve relevant PCOS information using RAG technology.
- **Reflect** → Identify relationships between lifestyle habits and reported symptoms.
- **Organize** → Generate structured health summaries for healthcare discussions.

The central idea is simple: **Understand your body. Recognize your patterns. Take charge of your wellness.**

---

## 2. Features Actually Implemented

### 🌸 1. Personalized Health Profile

A centralized profile management system that allows users to maintain their personal wellness information.

- Age, height, and weight.
- Typical menstrual cycle length.
- Period duration.
- Last menstrual period date.
- Personalized tracking preferences.

### 🩸 2. Menstrual Cycle Tracking

A dedicated menstrual health tracking system to record and manage cycle information.

- Record period start and end dates.
- Monitor individual cycle lengths.
- Maintain historical cycle records.
- Add personal notes and observations.
- Review previous menstrual records.

### 📝 3. Intelligent Symptom Tracking

A structured symptom management system that helps users maintain consistent health records.

- Track acne, fatigue, bloating, and hair-related concerns.
- Record symptom severity.
- Maintain symptom dates.
- Add personal observations.
- Review historical symptom records.

### 💤 4. Lifestyle & Wellness Monitoring

Monitor everyday lifestyle activities to better understand personal wellness patterns.

- Sleep duration tracking.
- Exercise duration tracking.
- Daily water intake.
- Stress-level monitoring.
- Daily lifestyle notes.

### 🤖 5. AI-Powered Wellness Companion

An interactive AI chatbot designed to provide educational and wellness-related assistance.

Users can explore topics such as:

- PCOS fundamentals.
- Common symptoms.
- Nutrition and healthy eating.
- Sleep and exercise.
- Menstrual health.
- Stress management.
- General wellness information.

### 📚 6. Retrieval-Augmented Generation (RAG)

Femora AI integrates a RAG-based knowledge retrieval system to provide contextually relevant information from a curated health knowledge base.

**Current RAG implementation:**

- TF-IDF Vectorization.
- Cosine Similarity.
- Relevant document retrieval.
- Context-based response generation.

Instead of relying entirely on general AI knowledge, the system retrieves relevant information from its knowledge base before generating responses.

### 🔐 7. AI Safety & Responsible Health Guidance

A dedicated safety layer designed to handle sensitive medical-related queries responsibly.

The system identifies:

- Medical diagnosis requests.
- Medication-related questions.
- Emergency-related symptoms.

It provides appropriate safety guidance and encourages users to consult qualified healthcare professionals when necessary.

### 💬 8. Conversation History Management

A conversation management system that allows users to maintain continuity across AI interactions.

- Create new conversations.
- Continue previous conversations.
- View chat history.
- Rename conversations.
- Delete conversations.
- Use recent conversation context for follow-up questions.

### 📊 9. Personalized Wellness Insights

Transform recorded health and lifestyle information into understandable wellness observations.

Examples include:

- Identifying sleep-duration patterns alongside symptom records.
- Reviewing frequently reported symptoms.
- Observing lifestyle changes over time.
- Understanding personal tracking trends.

These observations represent tracking patterns and are not medical diagnoses.

### 📋 10. Comprehensive Health Summary

Generate an organized personal wellness summary containing:

- Personal health profile.
- Recent menstrual cycles.
- Recent symptom records.
- Lifestyle tracking information.
- Observed wellness patterns.
- Average sleep duration.
- Average exercise duration.
- Frequently recorded symptoms.

This helps users organize their health information for discussions with healthcare professionals.

---

## 3. System Architecture

Femora AI follows a modular architecture that connects the frontend, backend, database, and AI-powered knowledge retrieval system.

```text
                     ┌──────────────────────┐
                     │         USER         │
                     └──────────┬───────────┘
                                │
                                ▼
                     ┌──────────────────────┐
                     │    React Frontend    │
                     │    TypeScript UI     │
                     └──────────┬───────────┘
                                │
                           REST API
                                │
                                ▼
                     ┌──────────────────────┐
                     │   FastAPI Backend    │
                     │   API & Processing   │
                     └──────────┬───────────┘
                                │
                   ┌────────────┴────────────┐
                   ▼                         ▼
          ┌──────────────────┐     ┌──────────────────┐
          │ SQLite Database  │     │    RAG Engine    │
          │                  │     │                  │
          │ User Profiles    │     │ Knowledge Base   │
          │ Menstrual Cycles │     │ TF-IDF           │
          │ Symptoms         │     │ Cosine Similarity│
          │ Lifestyle Logs   │     │ Document Search  │
          │ Conversations    │     │ Safety Layer     │
          └──────────────────┘     └────────┬─────────┘
                                            │
                                            ▼
                                  ┌────────────────────┐
                                  │ AI Wellness        │
                                  │ Response Generation│
                                  └────────────────────┘
```

---

## 4. Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React, TypeScript |
| Backend | Python, FastAPI |
| Database | SQLite |
| AI Integration | Large Language Model |
| RAG Architecture | TF-IDF, Cosine Similarity |
| Knowledge Retrieval | Curated Health Knowledge Base |
| API Communication | REST API |
| Deployment | Render |

---

## 5. Application Workflow

1. **Create Your Profile:** Enter personal health and cycle information.
2. **Track Your Health:** Record menstrual cycles, symptoms, and lifestyle activities.
3. **Interact with AI:** Ask questions through the Femora AI wellness chatbot.
4. **Retrieve Knowledge:** The RAG engine identifies relevant information from the curated knowledge base.
5. **Generate Insights:** Review observations based on recorded wellness information.
6. **View Health Summary:** Access organized personal health records and wellness insights.

---

## 6. Live Application

Experience Femora AI through the deployed web application.

<p align="center">
  <a href="https://femora-ai-frontend.onrender.com/" target="_blank">
    <img src="https://img.shields.io/badge/OPEN%20FEMORA%20AI-Visit%20Live%20Application-CB91BD?style=for-the-badge&labelColor=382638" alt="Open Femora AI" />
  </a>
</p>

**Live Project:** https://femora-ai-frontend.onrender.com/

---

## 7. Future Enhancements

The following features represent potential future development directions.

1. **Advanced Predictive Analytics:** Explore personal cycle and symptom trends using historical tracking data.
2. **Enhanced Wellness Visualizations:** Introduce interactive dashboards and detailed health analytics.
3. **Expanded Knowledge Base:** Integrate additional trusted medical and wellness resources.
4. **Personalized Recommendations:** Develop more context-aware wellness suggestions based on user-recorded information.
5. **Advanced Pattern Detection:** Explore machine learning approaches for identifying relationships between lifestyle and symptom records.
6. **Improved Accessibility:** Enhance mobile usability and provide more inclusive interaction options.

---

## 8. Project Philosophy

Femora AI is built around the belief that understanding personal health should be more accessible, organized, and empowering.

By combining AI-powered conversations, structured health tracking, knowledge retrieval, and wellness insights, the platform aims to make everyday health management a more informed experience.

**Because every woman's health journey deserves understanding, awareness, and care.**

<p align="center">

### 🌸 FEMORA AI

*Understand Your Body. Empower Your Journey.*

</p>

---

> **Medical Disclaimer:** Femora AI is an educational and wellness companion. It does not diagnose, treat, or prevent medical conditions and does not replace professional medical advice. Users should consult qualified healthcare professionals for medical concerns.
