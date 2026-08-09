import { useState, useEffect } from 'react';
import type { KnowledgeDoc } from '../types';
import { api } from '../services/api';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { Search, ExternalLink, HelpCircle, X } from 'lucide-react';

export const KnowledgeHub: React.FC = () => {
  const [docs, setDocs] = useState<KnowledgeDoc[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<KnowledgeDoc | null>(null);

  const categories = ['All', 'PCOS Basics', 'Symptoms', 'Nutrition', 'Movement', 'Sleep & Stress', 'Myths & Facts'];

  useEffect(() => {
    api.getKnowledgeBase().then((res) => {
      setDocs(res);
    });
  }, []);

  const mythsAndFacts = [
    {
      myth: 'PCOS is only related to irregular periods.',
      fact: 'PCOS is an endocrine and metabolic condition influencing insulin sensitivity, energy, skin health, and long-term metabolic balance.',
    },
    {
      myth: 'You cannot get pregnant if you have PCOS.',
      fact: 'PCOS is a leading cause of ovulatory subfertility, but lifestyle strategies, insulin balance, and medical ovulation induction support successful pregnancies for most women.',
    },
    {
      myth: 'All carbohydrates must be completely cut out for PCOS.',
      fact: 'Complex carbohydrates rich in fiber (whole grains, legumes, berries) are crucial for sustained cellular energy. Balance and pairing matter far more than complete elimination.',
    },
    {
      myth: 'PCOS only affects women who are overweight.',
      fact: 'Lean PCOS affects 20-30% of diagnosed individuals. Metabolic and hormonal factors occur across all body types.',
    },
  ];

  const filteredDocs = docs.filter((doc) => {
    const matchesCat = activeCategory === 'All' || doc.category === activeCategory;
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || doc.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-10 animate-in fade-in">
      {/* Header */}
      <div className="space-y-2 text-center max-w-2xl mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#B8C9B3] to-[#C9B8D9] flex items-center justify-center text-2xl mx-auto shadow-xs">
          📚
        </div>
        <h1 className="font-serif-heading text-3xl font-bold text-[#403A3D]">Knowledge Hub</h1>
        <p className="text-xs text-[#766D70]">
          Evidence-based educational information, scientific sources, and debunked myths about PCOS wellness.
        </p>
      </div>

      <DisclaimerBanner text="Knowledge Hub articles serve educational purposes only and are cited from recognized public health literature." />

      {/* SEARCH & CATEGORY FILTER */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-md mx-auto">
          <Search className="w-4 h-4 text-[#766D70] absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search PCOS topics (e.g. insulin, fatigue, movement)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-full border border-[#EDE3E0] bg-white text-xs text-[#403A3D] focus:outline-none focus:border-[#E8B4B8] shadow-2xs"
          />
        </div>

        {/* Categories Bar */}
        <div className="flex items-center justify-center flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-[#E8B4B8] to-[#C9B8D9] text-white shadow-2xs'
                  : 'bg-white border border-[#EDE3E0] text-[#766D70] hover:text-[#403A3D]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* INTERACTIVE MYTHS VS FACTS SECTION */}
      <div className="femora-card p-6 bg-gradient-to-br from-[#FFF9F5] to-[#FDF3EF] space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#E8B4B8]" />
          <h3 className="font-serif-heading text-lg font-bold text-[#403A3D]">PCOS Myths vs. Evidence-Based Facts</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mythsAndFacts.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white border border-[#EDE3E0] space-y-2 text-xs">
              <div className="flex items-start gap-2 text-rose-700 font-semibold">
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-[10px]">MYTH</span>
                <p>“{item.myth}”</p>
              </div>
              <div className="flex items-start gap-2 text-emerald-800 font-medium pt-1 border-t border-[#EDE3E0]">
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[10px] shrink-0">FACT</span>
                <p>{item.fact}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ARTICLES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            onClick={() => setSelectedDoc(doc)}
            className="femora-card-interactive p-6 space-y-4 flex flex-col justify-between cursor-pointer"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-[#FFF9F5] border border-[#EDE3E0] text-[10px] font-semibold text-[#403A3D]">
                  {doc.category}
                </span>
                <span className="text-[10px] text-[#766D70]">Source-Backed</span>
              </div>

              <h3 className="font-serif-heading text-base font-bold text-[#403A3D] hover:text-[#E8B4B8] transition-colors">
                {doc.title}
              </h3>

              <p className="text-xs text-[#766D70] leading-relaxed line-clamp-3">
                {doc.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-[#EDE3E0] flex items-center justify-between text-xs font-semibold text-[#403A3D]">
              <span className="text-[10px] text-[#766D70] font-normal">{doc.source}</span>
              <span className="text-[#E8B4B8] hover:underline flex items-center gap-1">
                Read Article <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ARTICLE READER MODAL */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-[#EDE3E0] max-w-2xl w-full rounded-3xl p-8 space-y-6 max-h-[85vh] overflow-y-auto relative shadow-2xl">
            <button
              onClick={() => setSelectedDoc(null)}
              className="absolute top-6 right-6 p-2 rounded-full text-[#766D70] hover:text-[#403A3D] hover:bg-[#FFF9F5]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-[#E8B4B8]/20 text-[#403A3D] text-xs font-semibold">
                {selectedDoc.category}
              </span>
              <h2 className="font-serif-heading text-2xl font-bold text-[#403A3D] pt-1">{selectedDoc.title}</h2>
              <p className="text-xs text-[#766D70]">Source: {selectedDoc.source}</p>
            </div>

            <div className="text-xs sm:text-sm text-[#403A3D] leading-relaxed space-y-4 pt-2 border-t border-[#EDE3E0]">
              {selectedDoc.content.split('\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            {selectedDoc.url && (
              <div className="pt-4 border-t border-[#EDE3E0] flex items-center justify-between text-xs text-[#766D70]">
                <span>Validated Reference</span>
                <a
                  href={selectedDoc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#E8B4B8] font-semibold hover:underline flex items-center gap-1"
                >
                  View Original Publication <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
