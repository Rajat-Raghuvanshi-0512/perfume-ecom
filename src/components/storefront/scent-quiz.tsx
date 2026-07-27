"use client";

import { useState } from "react";
import { MOCK_PERFUMES } from "@/lib/mock-perfumes";
import { Perfume } from "@/types/perfume";
import { Icon } from "@/components/ui/icon";

interface ScentQuizProps {
  onSelectPerfume: (perfume: Perfume) => void;
}

export function ScentQuiz({ onSelectPerfume }: ScentQuizProps) {
  const [step, setStep] = useState<number>(1);
  const [vibe, setVibe] = useState<string>("");
  const [notePreference, setNotePreference] = useState<string>("");
  const [intensity, setIntensity] = useState<string>("");
  const [matchedPerfume, setMatchedPerfume] = useState<Perfume | null>(null);

  const handleFinish = () => {
    let match = MOCK_PERFUMES[0];
    if (notePreference === "Sandalwood") match = MOCK_PERFUMES[2];
    if (notePreference === "Neroli") match = MOCK_PERFUMES[3];
    if (notePreference === "Rose") match = MOCK_PERFUMES[1];
    if (notePreference === "Vanilla") match = MOCK_PERFUMES[4];

    setMatchedPerfume(match);
    setStep(4);
  };

  const resetQuiz = () => {
    setStep(1);
    setVibe("");
    setNotePreference("");
    setIntensity("");
    setMatchedPerfume(null);
  };

  return (
    <section id="scent-quiz" className="py-20 bg-[#0E0E11] text-[#F5F5F0] border-b border-white/10 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#E6C687] text-xs font-semibold uppercase tracking-[0.25em]">
            <Icon name="Compass01Icon" className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Interactive Olfactory Finder</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif tracking-[0.15em] uppercase font-light">
            Discover Your Signature <span className="italic text-[#E6C687]">Elixir</span>
          </h2>
          <p className="text-xs text-[#A0A098] max-w-lg mx-auto tracking-wide">
            Answer 3 quick aesthetic questions to uncover the exact fragrance aligned with your aura.
          </p>
        </div>

        {/* Quiz Container Box */}
        <div className="bg-[#141418] border border-[#D4AF37]/30 p-8 sm:p-12 shadow-2xl relative">
          
          {/* Step Indicator */}
          {step < 4 && (
            <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8 text-xs uppercase tracking-widest text-[#888]">
              <span>Question 0{step} of 03</span>
              <div className="flex gap-2">
                {[1, 2, 3].map((num) => (
                  <div
                    key={num}
                    className={`w-8 h-1 transition-colors ${
                      step >= num ? "bg-[#D4AF37]" : "bg-white/10"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* STEP 1: VIBE */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-lg font-serif text-[#F5F5F0] tracking-wider uppercase">
                1. Which environment captures your ideal mood?
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: "Midnight Soirée & Opulence", desc: "Dimly lit velvet lounges, champagne, mystery", value: "Midnight" },
                  { title: "Mediterranean Villa Sun", desc: "Coastal breezes, linen shirts, sun-drenched citrus", value: "Villa" },
                  { title: "Private Library & Leather", desc: "Ancient books, fireside cognac, cashmere wool", value: "Library" },
                  { title: "Enchanted Botanical Garden", desc: "Dewy morning roses, jasmine vines, fresh air", value: "Garden" },
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setVibe(item.value)}
                    className={`p-5 border text-left transition-all ${
                      vibe === item.value
                        ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]"
                        : "border-white/10 bg-[#1A1A1F] text-[#C5C5C0] hover:border-white/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-serif font-medium text-sm text-[#F5F5F0]">{item.title}</span>
                      {vibe === item.value && <Icon name="CheckmarkBadge01Icon" className="w-4 h-4 text-[#D4AF37]" />}
                    </div>
                    <p className="text-xs text-[#888] font-light">{item.desc}</p>
                  </button>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  disabled={!vibe}
                  onClick={() => setStep(2)}
                  className="px-8 py-3 bg-[#D4AF37] text-[#0A0A0B] font-bold text-xs uppercase tracking-widest disabled:opacity-40 hover:bg-[#E6C687] transition-colors flex items-center gap-2"
                >
                  <span>Next Question</span>
                  <Icon name="ArrowRight01Icon" className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SCENT NOTES */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-lg font-serif text-[#F5F5F0] tracking-wider uppercase">
                2. Which olfactory note family resonates most with you?
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: "Sacred Oud & Smoked Resin", note: "Oud" },
                  { title: "Creamy Mysore Sandalwood & Cedar", note: "Sandalwood" },
                  { title: "Sun-drenched Neroli & Bergamot", note: "Neroli" },
                  { title: "Midnight Damask Rose & Iris", note: "Rose" },
                  { title: "Smoked Vanilla Bean & Tonka", note: "Vanilla" },
                ].map((item) => (
                  <button
                    key={item.note}
                    onClick={() => setNotePreference(item.note)}
                    className={`p-5 border text-left transition-all ${
                      notePreference === item.note
                        ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]"
                        : "border-white/10 bg-[#1A1A1F] text-[#C5C5C0] hover:border-white/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-medium text-sm text-[#F5F5F0]">{item.title}</span>
                      {notePreference === item.note && <Icon name="CheckmarkBadge01Icon" className="w-4 h-4 text-[#D4AF37]" />}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border border-white/20 text-[#C5C5C0] text-xs uppercase tracking-widest"
                >
                  Back
                </button>
                <button
                  disabled={!notePreference}
                  onClick={() => setStep(3)}
                  className="px-8 py-3 bg-[#D4AF37] text-[#0A0A0B] font-bold text-xs uppercase tracking-widest disabled:opacity-40 hover:bg-[#E6C687] transition-colors flex items-center gap-2"
                >
                  <span>Next Question</span>
                  <Icon name="ArrowRight01Icon" className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: INTENSITY */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h3 className="text-lg font-serif text-[#F5F5F0] tracking-wider uppercase">
                3. What level of sillage and longevity do you command?
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: "Extrait High Concentration (30%)", desc: "18+ Hours eternal longevity, room-filling magnetic aura", value: "Extrait" },
                  { title: "Eau de Parfum Refined (20%)", desc: "8-12 Hours elegant aura, perfect daily luxury", value: "EDP" },
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setIntensity(item.value)}
                    className={`p-5 border text-left transition-all ${
                      intensity === item.value
                        ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]"
                        : "border-white/10 bg-[#1A1A1F] text-[#C5C5C0] hover:border-white/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-serif font-medium text-sm text-[#F5F5F0]">{item.title}</span>
                      {intensity === item.value && <Icon name="CheckmarkBadge01Icon" className="w-4 h-4 text-[#D4AF37]" />}
                    </div>
                    <p className="text-xs text-[#888] font-light">{item.desc}</p>
                  </button>
                ))}
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 border border-white/20 text-[#C5C5C0] text-xs uppercase tracking-widest"
                >
                  Back
                </button>
                <button
                  disabled={!intensity}
                  onClick={handleFinish}
                  className="px-8 py-3 bg-gradient-to-r from-[#D4AF37] to-[#E6C687] text-[#0A0A0B] font-bold text-xs uppercase tracking-widest disabled:opacity-40 hover:brightness-110 transition-all flex items-center gap-2"
                >
                  <Icon name="SparklesIcon" className="w-4 h-4 text-[#0A0A0B]" />
                  <span>Reveal My Match</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: REVEAL MATCH */}
          {step === 4 && matchedPerfume && (
            <div className="text-center space-y-6 animate-in zoom-in-95 duration-500 py-4">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs uppercase tracking-widest font-semibold">
                <Icon name="CrownIcon" className="w-4 h-4" />
                <span>99.4% Match Aligned to Your Aura</span>
              </div>

              <div className="max-w-md mx-auto bg-[#1A1A1F] border border-[#D4AF37]/40 p-6 space-y-4">
                <img
                  src={matchedPerfume.images[0]}
                  alt={matchedPerfume.name}
                  className="w-36 h-44 object-cover mx-auto border border-white/10 shadow-xl"
                />
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] block">{matchedPerfume.family}</span>
                  <h4 className="text-2xl font-serif text-[#F5F5F0] tracking-wider">{matchedPerfume.name}</h4>
                  <p className="text-xs text-[#888] italic">"{matchedPerfume.subtitle}"</p>
                </div>
                <p className="text-xs text-[#C5C5C0] leading-relaxed">
                  {matchedPerfume.description}
                </p>

                <button
                  onClick={() => onSelectPerfume(matchedPerfume)}
                  className="w-full py-3.5 bg-[#D4AF37] text-[#0A0A0B] font-bold text-xs uppercase tracking-[0.2em] hover:bg-[#E6C687] transition-colors"
                >
                  Inspect & Acquire (Rs. {matchedPerfume.price.toLocaleString("en-IN")})
                </button>
              </div>

              <button
                onClick={resetQuiz}
                className="text-xs text-[#888] underline uppercase tracking-widest hover:text-[#D4AF37]"
              >
                Retake Olfactory Quiz
              </button>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
