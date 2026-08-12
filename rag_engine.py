import json
import os
import re
from typing import List, Dict, Any, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

KNOWLEDGE_BASE_PATH = os.path.join(os.path.dirname(__file__), "knowledge_base.json")

class FemoraRAGEngine:
    def __init__(self):
        self.documents: List[Dict[str, Any]] = []
        self.vectorizer: TfidfVectorizer = TfidfVectorizer(stop_words='english')
        self.doc_vectors = None
        self._load_knowledge_base()

    def _load_knowledge_base(self):
        if os.path.exists(KNOWLEDGE_BASE_PATH):
            with open(KNOWLEDGE_BASE_PATH, "r", encoding="utf-8") as f:
                self.documents = json.load(f)
            
            # Prepare text representations for indexing
            corpus = [
                f"{doc['title']} {doc['category']} {doc['topic']} {doc['summary']} {doc['content']}"
                for doc in self.documents
            ]
            if corpus:
                self.doc_vectors = self.vectorizer.fit_transform(corpus)

    def retrieve(self, query: str, top_k: int = 3) -> List[Dict[str, Any]]:
        """Retrieve top_k relevant documents for query using TF-IDF Cosine Similarity."""
        if not self.documents or self.doc_vectors is None:
            return []
        
        try:
            query_vector = self.vectorizer.transform([query])
            similarities = cosine_similarity(query_vector, self.doc_vectors).flatten()
            
            top_indices = similarities.argsort()[::-1][:top_k]
            
            results = []
            for idx in top_indices:
                score = float(similarities[idx])
                doc = self.documents[idx].copy()
                doc["relevance_score"] = round(score, 3)
                results.append(doc)
            return results
        except Exception:
            return self.documents[:top_k]

    def safety_check(self, query: str) -> Dict[str, Any]:
        """Perform medical safety check on user input."""
        query_lower = query.lower()
        
        diagnostic_keywords = ["do i have pcos", "diagnose me", "am i sick", "can you diagnose"]
        medication_keywords = ["medication", "pill", "prescription", "metformin", "spironolactone", "birth control dosage", "drug recommendation"]
        emergency_keywords = ["severe pain", "excessive bleeding", "fainted", "emergency", "chest pain", "suicidal"]
        
        is_diagnostic = any(kw in query_lower for kw in diagnostic_keywords)
        is_medication = any(kw in query_lower for kw in medication_keywords)
        is_emergency = any(kw in query_lower for kw in emergency_keywords)
        
        warning_message = ""
        if is_emergency:
            warning_message = "⚠️ If you are experiencing severe or sudden medical symptoms, please seek immediate emergency medical care or contact a qualified healthcare professional."
        elif is_diagnostic:
            warning_message = "🌸 Femora is an educational companion and cannot diagnose PCOS or any medical condition. Diagnostic evaluation requires clinical tests and assessment by a qualified doctor."
        elif is_medication:
            warning_message = "🌿 Prescription medications and dosage decisions must be evaluated with a licensed healthcare provider."
            
        return {
            "flagged": is_diagnostic or is_medication or is_emergency,
            "is_emergency": is_emergency,
            "warning": warning_message
        }

    def generate_conversation_title(self, first_user_message: str) -> str:
        """Generate a clean, concise title (<50 chars) from the user's first message."""
        msg = first_user_message.strip()
        msg_lower = msg.lower()

        if "what is pcos" in msg_lower or "explain pcos" in msg_lower:
            return "Understanding PCOS"
        if "symptom" in msg_lower:
            return "PCOS Symptoms Discussion"
        if "sleep" in msg_lower:
            return "Sleep & Restorative Habits"
        if "food" in msg_lower or "diet" in msg_lower or "nutrition" in msg_lower or "eat" in msg_lower:
            return "PCOS Nutrition & Lifestyle"
        if "exercise" in msg_lower or "movement" in msg_lower or "workout" in msg_lower:
            return "Movement & Physical Activity"
        if "cycle" in msg_lower or "period" in msg_lower or "irregular" in msg_lower:
            return "Cycle Tracking & Rhythms"
        if "stress" in msg_lower or "anxiety" in msg_lower or "cortisol" in msg_lower:
            return "Stress Management"
        if "acne" in msg_lower or "skin" in msg_lower:
            return "Skin & Acne Management"
        if "hair" in msg_lower or "hirsutism" in msg_lower:
            return "Hair & Androgen Discussion"

        # Fallback: sanitize user string to ~40 chars
        clean = re.sub(r'[^\w\s]', '', msg)
        words = clean.split()
        if len(words) <= 5:
            title = " ".join(words).title()
        else:
            title = " ".join(words[:5]).title()
            
        return title[:45] if title else "New Femora Conversation"

    def generate_response(self, query: str, history: List[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Generate a dynamic, context-aware AI response using RAG, conversation memory, and safety filters."""
        safety = self.safety_check(query)
        query_lower = query.lower()

        # 1. Resolve Query Context from History (Conversation Memory)
        resolved_query = query
        last_context_topic = ""

        if history:
            # Look backwards in recent history (up to last 6 messages)
            recent_msgs = history[-6:]
            for msg in reversed(recent_msgs):
                content = (msg.get("content") or "").lower()
                if "sleep" in content:
                    last_context_topic = "sleep"
                    break
                elif "exercise" in content or "movement" in content or "workout" in content:
                    last_context_topic = "exercise"
                    break
                elif "symptom" in content or "acne" in content or "fatigue" in content:
                    last_context_topic = "symptoms"
                    break
                elif "food" in content or "nutrition" in content or "diet" in content:
                    last_context_topic = "nutrition"
                    break
                elif "pcos" in content:
                    last_context_topic = "pcos"
                    break

        # Check if query uses pronouns like "it", "its", "them", "how to improve it", "what are its symptoms"
        uses_pronoun = any(p in query_lower.split() for p in ["it", "its", "them", "this", "these"])
        if uses_pronoun and last_context_topic:
            resolved_query = f"{query} regarding {last_context_topic}"

        # 2. Retrieve Relevant RAG Context
        relevant_docs = self.retrieve(resolved_query, top_k=3)
        sources = [
            {
                "title": doc["title"],
                "source": doc["source"],
                "category": doc["category"],
                "url": doc.get("url", "")
            }
            for doc in relevant_docs
        ]

        context_summary = " ".join([doc["summary"] for doc in relevant_docs]) if relevant_docs else ""

        # 3. Dynamic Answer Synthesis
        if safety["is_emergency"]:
            answer = "If you are experiencing severe or acute symptoms, your safety comes first. Please reach out to emergency healthcare services or visit an urgent care center immediately."
            what_to_know = "Femora is designed for daily wellness tracking and non-acute lifestyle awareness. Urgent medical symptoms require direct clinical evaluation."
            wellness_tips = "Rest in a comfortable environment while seeking medical advice."
        
        elif "sleep" in query_lower or (last_context_topic == "sleep" and ("improve" in query_lower or "how" in query_lower or "better" in query_lower or "its" in query_lower)):
            if "improve" in query_lower or "how" in query_lower or "better" in query_lower:
                answer = "Improving sleep quality involves aligning evening habits to lower nighttime cortisol and support steady melatonin release."
                what_to_know = "Creating a consistent sleep window, reducing blue light 45 minutes before bed, and maintaining a cool, dark room help stabilize deep sleep stages."
                wellness_tips = "Try a calming herbal tea (chamomile or lemon balm), warm bath, or gentle 5-minute breathing exercise before turning off the lights."
            else:
                answer = "Restorative sleep (7–9 hours) is a foundational pillar for regulating hypothalamic-pituitary-adrenal (HPA) axis balance and metabolic sensitivity."
                what_to_know = "Quality sleep enhances cellular insulin sensitivity, balances ghrelin and leptin (hunger hormones), and lowers morning cortisol spikes."
                wellness_tips = "Aim for regular wake-up times and get 10 minutes of direct morning sunlight to anchor your circadian rhythm."

        elif "food" in query_lower or "diet" in query_lower or "nutrition" in query_lower or "eat" in query_lower:
            answer = "Educational nutrition discussions around PCOS emphasize glycemic balance, fiber-dense complex carbs, quality proteins, and healthy anti-inflammatory fats."
            what_to_know = "Pairing carbohydrates with protein or healthy fats (e.g. berries with Greek yogurt, oats with chia seeds) slows glucose absorption and helps prevent rapid insulin spikes."
            wellness_tips = "Focus on addition rather than extreme restriction—add leafy greens, colorful berries, seeds, and omega-3 rich foods to your daily meals."

        elif "exercise" in query_lower or "movement" in query_lower or "workout" in query_lower:
            if "improve" in query_lower or "how" in query_lower or "best" in query_lower or "type" in query_lower:
                answer = "The most effective movement routine for PCOS is one that builds metabolic stamina without excessively elevating stress hormones."
                what_to_know = "Low-impact resistance training, Pilates, walking, and steady-state zone-2 movement build lean muscle mass (which absorbs glucose) without driving chronic cortisol elevation."
                wellness_tips = "Incorporate 20-30 minutes of comfortable movement 3-4 days a week, focusing on how energized you feel afterward."
            else:
                answer = "Gentle, consistent physical movement supports glucose uptake in muscle cells independently of insulin."
                what_to_know = "Regular activity lowers systemic inflammation, enhances mood via endorphins, and promotes restorative night sleep."
                wellness_tips = "Post-meal 10-minute walks are a simple habit to support digestion and steady postprandial glucose."

        elif "symptom" in query_lower or "acne" in query_lower or "fatigue" in query_lower or "hair" in query_lower or "bloating" in query_lower:
            if "track" in query_lower or "how" in query_lower:
                answer = "Tracking physical symptoms daily allows you to notice patterns in how your body responds to sleep, stress, and lifestyle shifts."
                what_to_know = "Rating severity (Low, Moderate, High) alongside lifestyle logs creates objective context to share during doctor visits."
                wellness_tips = "Log symptoms at the same time each day (e.g. during evening wind-down) for consistent historical records."
            else:
                answer = "Commonly observed PCOS symptoms include irregular cycle timing, androgenic skin changes (acne, hirsutism), fatigue, and digestive bloating."
                what_to_know = "Fluctuations in circulating hormones (like LH/FSH ratios, insulin, or free testosterone) can influence follicle reactivity and energy levels."
                wellness_tips = "Keep track of when symptoms peak during your cycle and support your body with anti-inflammatory habits."

        elif "pcos" in query_lower or "what is" in query_lower or "overview" in query_lower:
            answer = "Polycystic Ovary Syndrome (PCOS) is a common endocrine and metabolic condition characterized by hormonal variations and metabolic uniqueness."
            what_to_know = "It frequently involves insulin sensitivity patterns, irregular ovulatory rhythms, and varying androgen levels. It responds well to personalized lifestyle support."
            wellness_tips = "Focus on small, sustainable daily habits—nourishing meals, gentle movement, adequate sleep, and calm stress management."

        elif "cycle" in query_lower or "period" in query_lower or "irregular" in query_lower:
            answer = "Cycle length variations are a common hallmark of PCOS due to delayed or irregular ovulation."
            what_to_know = "Tracking period start dates, cycle length, and flow characteristics helps you understand your personal cycle baseline over 3–6 months."
            wellness_tips = "Record period dates regularly in the Cycle Tracker to visualize your personal rhythm over time."

        else:
            # Synthesize from RAG retrieved documents or clear educational advice
            if context_summary:
                answer = f"Based on evidence-based health guidance: {context_summary[:280]}..."
                what_to_know = "Understanding your unique wellness signals allows you to make informed, gentle lifestyle choices."
                wellness_tips = "Explore the Knowledge Hub for comprehensive scientific articles on this topic."
            else:
                answer = f"Thank you for your question about '{query}'. Nurturing your wellbeing begins with listening to your body's daily signals."
                what_to_know = "Tracking your daily habits, sleep, and symptoms provides valuable personal context for understanding your health."
                wellness_tips = "Maintain gentle daily movement, prioritize hydration, and take quiet moments for relaxation."

        # Apply safety warning if applicable
        if safety["warning"]:
            answer = f"{safety['warning']}\n\n{answer}"

        return {
            "query": query,
            "simple_answer": answer,
            "what_to_know": what_to_know,
            "wellness_considerations": wellness_tips,
            "sources": sources,
            "safety_disclaimer": "Femora provides educational and wellness support and does not replace professional medical advice.",
            "relevant_docs": relevant_docs
        }

rag_engine = FemoraRAGEngine()
