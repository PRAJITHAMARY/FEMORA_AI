import React, { useState, useEffect, useRef } from 'react';
import type { ChatMessage } from '../types';
import { api } from '../services/api';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { Send, BookOpen, ShieldAlert, Plus, RefreshCw } from 'lucide-react';

interface FemoraAIChatProps {
  conversationId?: string | null;
  onConversationStarted?: (id: string) => void;
  userId?: string;
}

export const FemoraAIChat: React.FC<FemoraAIChatProps> = ({
  conversationId = null,
  onConversationStarted,
  userId = 'demo-user-123',
}) => {
  const [currentConvId, setCurrentConvId] = useState<string | null>(conversationId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    'What is PCOS?',
    'What symptoms can occur?',
    'How can I track my symptoms?',
    'Why is sleep important?',
    'What lifestyle habits can support wellbeing?',
  ];

  // Sync internal conversation state with prop
  useEffect(() => {
    setCurrentConvId(conversationId);
    if (conversationId) {
      loadConversation(conversationId);
    } else {
      showWelcomeState();
    }
  }, [conversationId, userId]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const showWelcomeState = () => {
    setMessages([
      {
        id: 'welcome-msg',
        role: 'assistant',
        structuredResponse: {
          simple_answer:
            'Hello! I am Femora AI, your calm wellness companion 🌸. How can I help you understand your cycle, symptoms, or PCOS educational information today?',
          what_to_know:
            'I can answer general educational questions about PCOS physiology, lifestyle habits, and symptom tracking.',
          wellness_considerations:
            'Remember that I am an educational support tool and do not provide medical diagnoses or prescriptions.',
          sources: [
            { title: 'Understanding PCOS Basics', source: 'WHO & Endocrine Society', category: 'PCOS Basics' },
          ],
          safety_disclaimer:
            'Femora provides educational and wellness support and does not replace professional medical advice.',
        },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const loadConversation = async (convId: string) => {
    setLoadingHistory(true);
    try {
      const data = await api.getConversation(convId, userId);
      if (data.messages && data.messages.length > 0) {
        setMessages(data.messages);
      } else {
        showWelcomeState();
      }
    } catch (e) {
      console.error('Failed to load conversation history', e);
      showWelcomeState();
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleNewChat = () => {
    setCurrentConvId(null);
    setInput('');
    showWelcomeState();
  };

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isThinking) return;

    // 1. Instantly add user message to UI
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsThinking(true);

    try {
      // Create conversation ID if none exists yet
      let activeId = currentConvId;
      if (!activeId) {
        activeId = `conv-${Date.now()}`;
        setCurrentConvId(activeId);
        if (onConversationStarted) onConversationStarted(activeId);
      }

      // 2. Send message to backend
      const res = await api.sendChatMessage(query.trim(), activeId, userId);

      if (res && res.assistant_message) {
        const aiMsg: ChatMessage = {
          id: res.assistant_message.id || `ai-${Date.now()}`,
          role: 'assistant',
          content: res.assistant_message.content,
          structuredResponse: res.assistant_message.structuredResponse || {
            simple_answer: res.assistant_message.content,
            safety_disclaimer:
              'Femora provides educational and wellness support and does not replace professional medical advice.',
          },
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        // Fallback response if standalone mode
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          structuredResponse: {
            simple_answer:
              res?.simple_answer ||
              'Nurturing your wellbeing begins with listening to your body and prioritizing gentle daily habits.',
            what_to_know: res?.what_to_know || 'Tracking your symptoms helps build helpful journal context.',
            wellness_considerations:
              res?.wellness_considerations || 'Stay hydrated and priority sleep tonight.',
            sources: res?.sources || [],
            safety_disclaimer:
              'Femora provides educational and wellness support and does not replace professional medical advice.',
          },
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'Unable to reach Femora AI. Please check your network connection and try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in pb-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EDE3E0] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#E8B4B8] to-[#C9B8D9] flex items-center justify-center text-2xl shadow-xs shrink-0">
            🌸
          </div>
          <div>
            <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#403A3D]">
              Femora AI
            </h1>
            <p className="text-xs text-[#766D70] font-medium">Your personal wellness companion.</p>
          </div>
        </div>

        {/* + NEW CHAT BUTTON */}
        <button
          onClick={handleNewChat}
          className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#E8B4B8] to-[#C9B8D9] text-white text-xs font-semibold shadow-xs hover:opacity-95 transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ New Chat</span>
        </button>
      </div>

      <DisclaimerBanner text="Femora AI provides educational guidance sourced from evidence-based health articles. It does not provide medical diagnoses or prescriptions." />

      {/* SUGGESTED PROMPT CHIPS (Displayed at beginning of conversation) */}
      {messages.length <= 2 && (
        <div className="space-y-2">
          <span className="text-xs font-semibold text-[#403A3D] block">How can I help you today?</span>
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
            {suggestedPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="px-3.5 py-2 rounded-full bg-white border border-[#EDE3E0] hover:border-[#E8B4B8] hover:bg-[#FFF9F5] text-xs text-[#403A3D] whitespace-nowrap transition-all shadow-2xs shrink-0 cursor-pointer"
              >
                “{prompt}”
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CHAT MESSAGES WINDOW */}
      <div className="femora-card p-6 min-h-[440px] bg-[#FFF9F5] space-y-6 overflow-y-auto max-h-[550px] border border-[#EDE3E0]">
        {loadingHistory ? (
          <div className="py-16 text-center text-xs text-[#766D70] space-y-2">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#E8B4B8]" />
            <p>Loading conversation history...</p>
          </div>
        ) : (
          messages.map((msg) => {
            if (msg.role === 'user') {
              return (
                <div key={msg.id} className="flex justify-end">
                  <div className="bg-gradient-to-r from-[#E8B4B8] to-[#F3C6B5] text-white p-4 rounded-3xl rounded-tr-xs max-w-lg text-xs space-y-1 shadow-xs">
                    <p className="leading-relaxed font-medium">{msg.content}</p>
                    <span className="text-[9px] opacity-80 block text-right">{msg.timestamp}</span>
                  </div>
                </div>
              );
            }

            const res = msg.structuredResponse;
            return (
              <div key={msg.id} className="flex justify-start">
                <div className="bg-white border border-[#EDE3E0] p-6 rounded-3xl rounded-tl-xs max-w-2xl text-xs space-y-4 shadow-sm w-full sm:w-auto">
                  <div className="flex items-center justify-between border-b border-[#EDE3E0] pb-2">
                    <div className="flex items-center gap-2 text-[#403A3D] font-semibold">
                      <div className="w-6 h-6 rounded-lg bg-[#E8B4B8]/20 flex items-center justify-center text-xs">
                        🌸
                      </div>
                      <span>Femora AI</span>
                    </div>
                    <span className="text-[10px] text-[#766D70]">{msg.timestamp}</span>
                  </div>

                  {/* Structured Response Content */}
                  {res ? (
                    <div className="space-y-4">
                      {/* Simple Answer */}
                      <div className="space-y-1">
                        <h4 className="font-semibold text-[#403A3D] flex items-center gap-1.5">
                          <span>🌸</span> Simple Answer
                        </h4>
                        <p className="text-[#403A3D] leading-relaxed bg-[#FFF9F5] p-3 rounded-2xl border border-[#EDE3E0]">
                          {res.simple_answer}
                        </p>
                      </div>

                      {/* What to Know */}
                      {res.what_to_know && (
                        <div className="space-y-1">
                          <h4 className="font-semibold text-[#403A3D] flex items-center gap-1.5">
                            <span>💡</span> What to Know
                          </h4>
                          <p className="text-[#766D70] leading-relaxed">{res.what_to_know}</p>
                        </div>
                      )}

                      {/* Wellness Considerations */}
                      {res.wellness_considerations && (
                        <div className="space-y-1">
                          <h4 className="font-semibold text-[#403A3D] flex items-center gap-1.5">
                            <span>🌿</span> Wellness Considerations
                          </h4>
                          <p className="text-[#766D70] leading-relaxed">{res.wellness_considerations}</p>
                        </div>
                      )}

                      {/* Sources */}
                      {res.sources && res.sources.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-[#EDE3E0]">
                          <h4 className="font-semibold text-[#403A3D] flex items-center gap-1.5 text-[11px]">
                            <BookOpen className="w-3.5 h-3.5 text-[#C9B8D9]" /> 📚 Sources
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {res.sources.map((src, i) => (
                              <span
                                key={i}
                                className="px-2.5 py-1 rounded-full bg-[#FFF9F5] border border-[#EDE3E0] text-[10px] text-[#766D70]"
                              >
                                • {src.title} ({src.source})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-[#766D70] leading-relaxed">{msg.content}</p>
                  )}

                  {/* Safety Disclaimer Footer */}
                  <div className="pt-2 border-t border-[#EDE3E0]/70 flex items-center gap-1.5 text-[10px] text-[#766D70]/80 italic">
                    <ShieldAlert className="w-3 h-3 text-[#E8B4B8]" />
                    <span>Femora provides educational and wellness support and does not replace professional medical advice.</span>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Typing Indicator */}
        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-white border border-[#EDE3E0] p-4 rounded-3xl text-xs text-[#766D70] flex items-center gap-2 shadow-xs animate-pulse">
              <span className="text-base">🌸</span>
              <span className="font-medium text-[#403A3D]">Femora AI is thinking...</span>
              <span className="flex gap-1 text-[#E8B4B8]">● ● ●</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT BAR */}
      <div className="relative">
        <textarea
          rows={1}
          placeholder="Ask Femora AI anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="w-full pl-5 pr-14 py-3.5 rounded-full border border-[#EDE3E0] bg-white text-xs text-[#403A3D] focus:outline-none focus:border-[#E8B4B8] shadow-sm resize-none"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isThinking}
          className={`absolute right-2 top-1.5 p-2.5 rounded-full text-white shadow-2xs transition-all ${
            !input.trim() || isThinking
              ? 'bg-gray-200 cursor-not-allowed opacity-60'
              : 'bg-gradient-to-r from-[#E8B4B8] to-[#C9B8D9] hover:opacity-95 cursor-pointer'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
