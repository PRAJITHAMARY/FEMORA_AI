import type { Profile, Cycle, Symptom, LifestyleLog, PatternInsight, KnowledgeDoc, HealthSummaryData, Conversation, ChatMessage } from '../types';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const api = {
  async healthCheck() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      return await res.json();
    } catch {
      return { status: 'offline' };
    }
  },

  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Login failed');
    }
    return await res.json();
  },

  async register(name: string, email: string, password: string) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Registration failed');
    }
    return await res.json();
  },

  async getProfile(): Promise<Profile> {
    try {
      const res = await fetch(`${API_BASE_URL}/profile`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API error, using local state fallback');
    }
    return {
      user_id: 'demo-user-123',
      name: 'Elena Rostova',
      email: 'elena@femora.well',
      age: 27,
      height: 165,
      weight: 62.5,
      cycle_length_typical: 32,
      period_duration_typical: 5,
      last_period_date: '2026-08-01',
      tracking_preferences: ['Cycle', 'Symptoms', 'Sleep', 'Stress', 'Water'],
    };
  },

  async updateProfile(profile: Partial<Profile>) {
    try {
      const res = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      return await res.json();
    } catch (e) {
      return { message: 'Updated locally' };
    }
  },

  async getCycles(): Promise<Cycle[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/cycles`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return [
      { id: 'c1', user_id: 'demo-user-123', start_date: '2026-08-01', end_date: '2026-08-05', cycle_length: 32, notes: 'Moderate flow, light cramps' },
      { id: 'c2', user_id: 'demo-user-123', start_date: '2026-06-30', end_date: '2026-07-04', cycle_length: 31, notes: 'Normal flow' },
      { id: 'c3', user_id: 'demo-user-123', start_date: '2026-05-28', end_date: '2026-06-01', cycle_length: 33, notes: 'High stress month' },
    ];
  },

  async addCycle(cycle: { start_date: string; end_date?: string; notes?: string }) {
    try {
      const res = await fetch(`${API_BASE_URL}/cycles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cycle),
      });
      return await res.json();
    } catch (e) {
      return { message: 'Cycle logged', id: Date.now().toString() };
    }
  },

  async deleteCycle(id: string) {
    try {
      await fetch(`${API_BASE_URL}/cycles/${id}`, { method: 'DELETE' });
    } catch (e) {}
  },

  async getSymptoms(): Promise<Symptom[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/symptoms`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return [
      { id: 's1', user_id: 'demo-user-123', symptom: 'Acne', severity: 'Moderate', date: '2026-08-08', notes: 'Jawline breakout' },
      { id: 's2', user_id: 'demo-user-123', symptom: 'Fatigue', severity: 'High', date: '2026-08-07', notes: 'Sluggish afternoon' },
      { id: 's3', user_id: 'demo-user-123', symptom: 'Bloating', severity: 'Low', date: '2026-08-06', notes: 'Evening meal' },
    ];
  },

  async addSymptom(symptom: { symptom: string; severity: string; date: string; notes?: string }) {
    try {
      const res = await fetch(`${API_BASE_URL}/symptoms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(symptom),
      });
      return await res.json();
    } catch (e) {
      return { message: 'Symptom added', id: Date.now().toString() };
    }
  },

  async deleteSymptom(id: string) {
    try {
      await fetch(`${API_BASE_URL}/symptoms/${id}`, { method: 'DELETE' });
    } catch (e) {}
  },

  async getLifestyle(): Promise<LifestyleLog[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/lifestyle`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return [
      { id: 'l1', user_id: 'demo-user-123', date: '2026-08-09', sleep_hours: 7.5, exercise_minutes: 30, water_intake: 8, stress_level: 'Low', notes: 'Morning walk' },
      { id: 'l2', user_id: 'demo-user-123', date: '2026-08-08', sleep_hours: 6.0, exercise_minutes: 15, water_intake: 6, stress_level: 'High', notes: 'Busy work deadline' },
      { id: 'l3', user_id: 'demo-user-123', date: '2026-08-07', sleep_hours: 5.5, exercise_minutes: 0, water_intake: 5, stress_level: 'High', notes: 'Late screen time' },
    ];
  },

  async addLifestyle(log: { date: string; sleep_hours: number; exercise_minutes: number; water_intake: number; stress_level: string; notes?: string }) {
    try {
      const res = await fetch(`${API_BASE_URL}/lifestyle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log),
      });
      return await res.json();
    } catch (e) {
      return { message: 'Log saved', id: Date.now().toString() };
    }
  },

  async updateLifestyle(id: string, log: { date: string; sleep_hours: number; exercise_minutes: number; water_intake: number; stress_level: string; notes?: string }) {
    try {
      const res = await fetch(`${API_BASE_URL}/lifestyle/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log),
      });
      return await res.json();
    } catch (e) {
      return { message: 'Log updated', id };
    }
  },

  async deleteLifestyle(id: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/lifestyle/${id}`, {
        method: 'DELETE',
      });
      return await res.json();
    } catch (e) {
      return { message: 'Log deleted' };
    }
  },

  async getInsights(): Promise<PatternInsight[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/insights`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return [
      {
        id: 'in1',
        user_id: 'demo-user-123',
        title: 'Sleep Duration vs. Symptom Frequency',
        category: 'Sleep & Symptoms',
        insight_text: 'During days when you logged fewer than 6.5 hours of sleep, you were 2.5x more likely to record higher symptom severity (Fatigue & Acne).',
        disclaimer: 'These insights describe patterns in your tracking data and are not medical diagnoses.',
        date: '2026-08-08',
        data_points: '10 Daily Logs Analyzed',
      },
      {
        id: 'in2',
        user_id: 'demo-user-123',
        title: 'Hydration & Energy Levels',
        category: 'Lifestyle & Energy',
        insight_text: 'Days with 8+ glasses of water correlated with lower reported fatigue and more consistent evening relaxation.',
        disclaimer: 'These insights describe patterns in your tracking data and are not medical diagnoses.',
        date: '2026-08-07',
        data_points: '7 Days Tracking',
      },
    ];
  },

  async sendChatMessage(message: string, conversationId?: string, userId: string = 'demo-user-123') {
    try {
      if (conversationId) {
        return await this.sendMessageToConversation(conversationId, message, userId);
      }
      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, user_id: userId }),
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return {
      query: message,
      simple_answer: 'Femora AI is operating in standalone mode. Nurturing your wellbeing begins with listening to your body.',
      what_to_know: 'Tracking your cycle and symptoms gives you personal data to bring to your doctor.',
      wellness_considerations: 'Stay hydrated and prioritize gentle movement today.',
      sources: [{ title: 'PCOS Basics', source: 'WHO & Endocrine Society', category: 'PCOS Basics' }],
      safety_disclaimer: 'Femora provides educational and wellness support and does not replace professional medical advice.',
    };
  },

  async getConversations(userId: string = 'demo-user-123'): Promise<Conversation[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/conversations?user_id=${encodeURIComponent(userId)}`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return [
      {
        id: 'conv-101',
        user_id: userId,
        title: 'Understanding PCOS Symptoms',
        message_count: 4,
        last_message: 'What symptoms can occur?',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'conv-102',
        user_id: userId,
        title: 'Sleep and Wellbeing',
        message_count: 2,
        last_message: 'Tell me about sleep.',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
      },
    ];
  },

  async getConversation(conversationId: string, userId: string = 'demo-user-123'): Promise<{ conversation: Conversation; messages: ChatMessage[] }> {
    try {
      const res = await fetch(`${API_BASE_URL}/conversations/${encodeURIComponent(conversationId)}?user_id=${encodeURIComponent(userId)}`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return {
      conversation: {
        id: conversationId,
        user_id: userId,
        title: 'Femora Conversation',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      messages: [],
    };
  },

  async createConversation(title?: string, userId: string = 'demo-user-123'): Promise<Conversation> {
    try {
      const res = await fetch(`${API_BASE_URL}/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, user_id: userId }),
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    const newId = `conv-${Date.now()}`;
    return {
      id: newId,
      user_id: userId,
      title: title || 'New Femora Conversation',
      message_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  },

  async sendMessageToConversation(conversationId: string, message: string, userId: string = 'demo-user-123') {
    try {
      const res = await fetch(`${API_BASE_URL}/conversations/${encodeURIComponent(conversationId)}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, user_id: userId }),
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return null;
  },

  async renameConversation(conversationId: string, title: string, userId: string = 'demo-user-123') {
    try {
      const res = await fetch(`${API_BASE_URL}/conversations/${encodeURIComponent(conversationId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, user_id: userId }),
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { message: 'Renamed locally' };
  },

  async deleteConversation(conversationId: string, userId: string = 'demo-user-123') {
    try {
      const res = await fetch(`${API_BASE_URL}/conversations/${encodeURIComponent(conversationId)}?user_id=${encodeURIComponent(userId)}`, {
        method: 'DELETE',
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { message: 'Deleted locally' };
  },

  async getKnowledgeBase(): Promise<KnowledgeDoc[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/knowledge`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return [];
  },

  async getHealthSummary(): Promise<HealthSummaryData> {
    try {
      const res = await fetch(`${API_BASE_URL}/summary`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return {
      user_name: 'Elena Rostova',
      generated_at: new Date().toISOString().split('T')[0],
      disclaimer: 'Personal tracking summary for healthcare discussion — NOT a medical diagnosis or medical report.',
      profile: { age: 27, height: 165, weight: 62.5, cycle_length_typical: 32 },
      recent_cycles: [],
      recent_symptoms: [],
      recent_lifestyle: [],
      observed_insights: [],
      summary_stats: { avg_sleep_hours: 7.2, avg_exercise_mins: 25, frequent_symptoms: ['Acne', 'Fatigue'], tracked_days_count: 14 },
    };
  },
};
