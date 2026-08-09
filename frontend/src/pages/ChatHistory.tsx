import React, { useState, useEffect } from 'react';
import type { Conversation } from '../types';
import { api } from '../services/api';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import {
  Search,
  MessageSquare,
  MoreVertical,
  Trash2,
  Edit2,
  Plus,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface ChatHistoryProps {
  userId?: string;
  onSelectConversation: (conversationId: string) => void;
  onNewChat: () => void;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({
  userId = 'demo-user-123',
  onSelectConversation,
  onNewChat,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Dropdown menu state
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Rename modal state
  const [renameConv, setRenameConv] = useState<Conversation | null>(null);
  const [renameTitle, setRenameTitle] = useState('');

  // Delete modal state
  const [deleteConv, setDeleteConv] = useState<Conversation | null>(null);

  useEffect(() => {
    fetchHistory();
  }, [userId]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await api.getConversations(userId);
      setConversations(data);
    } catch (e) {
      console.error('Failed to load history', e);
    } finally {
      setLoading(false);
    }
  };

  const handleRenameSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameConv || !renameTitle.trim()) return;

    try {
      await api.renameConversation(renameConv.id, renameTitle.trim(), userId);
      setConversations((prev) =>
        prev.map((c) => (c.id === renameConv.id ? { ...c, title: renameTitle.trim() } : c))
      );
    } catch (e) {
      console.error('Failed to rename conversation', e);
    } finally {
      setRenameConv(null);
      setRenameTitle('');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConv) return;
    try {
      await api.deleteConversation(deleteConv.id, userId);
      setConversations((prev) => prev.filter((c) => c.id !== deleteConv.id));
    } catch (e) {
      console.error('Failed to delete conversation', e);
    } finally {
      setDeleteConv(null);
    }
  };

  // Filter conversations by title or last message content
  const filtered = conversations.filter((c) => {
    const q = searchQuery.toLowerCase();
    const titleMatch = c.title.toLowerCase().includes(q);
    const msgMatch = c.last_message ? c.last_message.toLowerCase().includes(q) : false;
    return titleMatch || msgMatch;
  });

  // Date Grouping logic: Today, Yesterday, Previous 7 Days, Older
  const groupConversations = (items: Conversation[]) => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterdayStart = todayStart - 86400000;
    const sevenDaysStart = todayStart - 6 * 86400000;

    const groups: { [key: string]: Conversation[] } = {
      Today: [],
      Yesterday: [],
      'Previous 7 Days': [],
      Older: [],
    };

    items.forEach((conv) => {
      const t = new Date(conv.updated_at || conv.created_at).getTime();
      if (t >= todayStart) {
        groups['Today'].push(conv);
      } else if (t >= yesterdayStart) {
        groups['Yesterday'].push(conv);
      } else if (t >= sevenDaysStart) {
        groups['Previous 7 Days'].push(conv);
      } else {
        groups['Older'].push(conv);
      }
    });

    return groups;
  };

  const formatTimestamp = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) return `Today, ${time}`;

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return `Yesterday, ${time}`;

    return `${d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}, ${time}`;
  };

  const grouped = groupConversations(filtered);

  return (
    <div className="space-y-8 animate-in fade-in max-w-5xl mx-auto pb-16">
      {/* Header with Title, Subtitle, and + New Chat Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EDE3E0] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">💬</span>
            <h1 className="font-serif-heading text-3xl font-bold text-[#403A3D]">Chat History</h1>
          </div>
          <p className="text-xs text-[#766D70] font-medium">Your conversations with Femora AI.</p>
        </div>

        <button
          onClick={onNewChat}
          className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#E8B4B8] to-[#C9B8D9] text-white text-xs font-semibold shadow-xs hover:opacity-95 transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ New Chat</span>
        </button>
      </div>

      <DisclaimerBanner text="Chat History stores your private 1-to-1 conversations with Femora AI. Conversations are isolated strictly to your account." />

      {/* SEARCH CONVERSATIONS BAR */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#766D70] absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 Search conversations (titles or message text)..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#EDE3E0] bg-[#FFF9F5] text-xs text-[#403A3D] focus:outline-none focus:border-[#E8B4B8] transition-all"
        />
      </div>

      {/* CONVERSATION LIST BY DATE GROUPS */}
      {loading ? (
        <div className="py-12 text-center text-xs text-[#766D70] space-y-2">
          <div className="inline-block animate-spin text-lg">🌸</div>
          <p>Loading your chat history...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="femora-card p-12 text-center space-y-4 bg-white/80">
          <div className="w-12 h-12 rounded-full bg-[#E8B4B8]/20 flex items-center justify-center mx-auto text-xl text-[#E8B4B8]">
            💬
          </div>
          <div className="space-y-1">
            <h3 className="font-serif-heading text-lg font-bold text-[#403A3D]">
              {searchQuery ? 'No matching conversations found' : 'No chat history yet'}
            </h3>
            <p className="text-xs text-[#766D70] max-w-sm mx-auto">
              {searchQuery
                ? `No conversation titles or messages match "${searchQuery}".`
                : 'Start a new conversation with Femora AI to ask questions about PCOS, sleep, or symptoms.'}
            </p>
          </div>
          {!searchQuery && (
            <button
              onClick={onNewChat}
              className="px-6 py-2.5 rounded-full bg-[#E8B4B8] text-white text-xs font-semibold hover:opacity-95 transition-all shadow-xs"
            >
              Start Your First Chat 🌸
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {(['Today', 'Yesterday', 'Previous 7 Days', 'Older'] as const).map((groupKey) => {
            const items = grouped[groupKey];
            if (!items || items.length === 0) return null;

            return (
              <div key={groupKey} className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#403A3D] uppercase tracking-wider border-b border-[#EDE3E0]/60 pb-1.5">
                  <span>{groupKey}</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#E8B4B8]/20 text-[#403A3D] text-[10px]">
                    {items.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {items.map((conv) => (
                    <div
                      key={conv.id}
                      className="group relative femora-card p-4 bg-white hover:bg-[#FFF9F5] border border-[#EDE3E0] hover:border-[#E8B4B8] transition-all flex items-start justify-between gap-4 cursor-pointer"
                      onClick={() => onSelectConversation(conv.id)}
                    >
                      <div className="flex items-start gap-3.5 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FFF9F5] to-[#F5F0FB] border border-[#EDE3E0] flex items-center justify-center text-base shrink-0">
                          🌸
                        </div>

                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-serif-heading text-sm font-bold text-[#403A3D] truncate group-hover:text-[#E8B4B8] transition-colors">
                              {conv.title}
                            </h3>
                          </div>

                          <p className="text-xs text-[#766D70] truncate line-clamp-1">
                            {conv.last_message || 'No messages in this chat yet.'}
                          </p>

                          <div className="flex items-center gap-4 text-[11px] text-[#766D70]/80 pt-1">
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3 text-[#C9B8D9]" />
                              {conv.message_count || 0} messages
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[#B8C9B3]" />
                              {formatTimestamp(conv.updated_at || conv.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* ⋯ Menu */}
                      <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setActiveMenuId(activeMenuId === conv.id ? null : conv.id)}
                          className="p-2 rounded-xl text-[#766D70] hover:bg-[#EDE3E0]/50 transition-all"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {activeMenuId === conv.id && (
                          <div className="absolute right-0 top-10 z-30 w-36 bg-white border border-[#EDE3E0] rounded-2xl shadow-lg p-1.5 space-y-1 animate-in fade-in zoom-in-95">
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                setRenameConv(conv);
                                setRenameTitle(conv.title);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#403A3D] hover:bg-[#FFF9F5] transition-all"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-[#C9B8D9]" />
                              <span>Rename</span>
                            </button>
                            <button
                              onClick={() => {
                                setActiveMenuId(null);
                                setDeleteConv(conv);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* RENAME MODAL */}
      {renameConv && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleRenameSave}
            className="w-full max-w-md bg-white rounded-3xl p-6 space-y-4 border border-[#EDE3E0] shadow-xl animate-in zoom-in-95"
          >
            <div className="flex items-center gap-2 border-b border-[#EDE3E0] pb-3">
              <Edit2 className="w-5 h-5 text-[#E8B4B8]" />
              <h3 className="font-serif-heading text-lg font-bold text-[#403A3D]">Rename Conversation</h3>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-semibold text-[#403A3D]">Conversation Title</label>
              <input
                type="text"
                required
                value={renameTitle}
                onChange={(e) => setRenameTitle(e.target.value)}
                placeholder="Enter new conversation title..."
                className="w-full p-3 rounded-2xl border border-[#EDE3E0] bg-[#FFF9F5] text-[#403A3D] text-xs focus:outline-none focus:border-[#E8B4B8]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRenameConv(null)}
                className="px-5 py-2 rounded-full border border-[#EDE3E0] text-xs font-semibold text-[#766D70] hover:bg-[#FFF9F5]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-[#E8B4B8] text-white text-xs font-semibold shadow-xs hover:opacity-95"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConv && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 space-y-4 border border-[#EDE3E0] shadow-xl animate-in zoom-in-95">
            <div className="flex items-center gap-2.5 text-rose-600 border-b border-[#EDE3E0] pb-3">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-serif-heading text-lg font-bold">Delete this conversation?</h3>
            </div>

            <p className="text-xs text-[#766D70] leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-[#403A3D]">"{deleteConv.title}"</span>? All messages in this conversation history will be permanently deleted.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConv(null)}
                className="px-5 py-2 rounded-full border border-[#EDE3E0] text-xs font-semibold text-[#766D70] hover:bg-[#FFF9F5]"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2 rounded-full bg-rose-600 text-white text-xs font-semibold shadow-xs hover:bg-rose-700"
              >
                Delete Conversation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
