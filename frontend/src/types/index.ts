export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Profile {
  user_id: string;
  name?: string;
  email?: string;
  age: number;
  height: number;
  weight: number;
  cycle_length_typical: number;
  period_duration_typical: number;
  last_period_date: string;
  tracking_preferences: string[];
}

export interface Cycle {
  id: string;
  user_id: string;
  start_date: string;
  end_date?: string;
  cycle_length?: number;
  notes?: string;
  created_at?: string;
}

export interface Symptom {
  id: string;
  user_id: string;
  symptom: string;
  severity: 'Low' | 'Moderate' | 'High';
  date: string;
  notes?: string;
}

export interface LifestyleLog {
  id: string;
  user_id: string;
  date: string;
  sleep_hours: number;
  exercise_minutes: number;
  water_intake: number; // in glasses
  stress_level: 'Low' | 'Moderate' | 'High';
  notes?: string;
}

export interface PatternInsight {
  id: string;
  user_id: string;
  title: string;
  category: string;
  insight_text: string;
  disclaimer: string;
  date: string;
  data_points?: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  message_count?: number;
  last_message?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id?: string;
  role: 'user' | 'assistant';
  content?: string;
  structuredResponse?: {
    simple_answer: string;
    what_to_know?: string;
    wellness_considerations?: string;
    sources?: Array<{ title: string; source: string; category: string; url?: string }>;
    safety_disclaimer?: string;
  };
  timestamp: string;
  isThinking?: boolean;
}

export interface KnowledgeDoc {
  id: string;
  title: string;
  category: string;
  source: string;
  topic: string;
  summary: string;
  content: string;
  url?: string;
}

export interface HealthSummaryData {
  user_name: string;
  generated_at: string;
  disclaimer: string;
  profile: Partial<Profile>;
  recent_cycles: Cycle[];
  recent_symptoms: Symptom[];
  recent_lifestyle: LifestyleLog[];
  observed_insights: PatternInsight[];
  summary_stats: {
    avg_sleep_hours: number;
    avg_exercise_mins: number;
    frequent_symptoms: string[];
    tracked_days_count: number;
  };
}
