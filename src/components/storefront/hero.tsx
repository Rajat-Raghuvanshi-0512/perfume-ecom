"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#0A0A0B] border-b border-white/10">
      
      {/* Background Image with Deep Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40 scale-105 transition-transform duration-10000 ease-out transform"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=2000&auto=format&fit=crop')`,
        }}
      />

      {/* Radial Vignette & Gold Glow */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#0A0A0B]/70 to-[#0A0A0B]" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center py-20 space-y-8">
        
        {/* Sub-header Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#E6C687] text-xs font-medium tracking-[0.3em] uppercase animate-in fade-in slide-in-from-bottom-2 duration-700">
          <Icon name="SparklesIcon" className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Haute Parfumerie • Harvest 2026</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif tracking-[0.15em] uppercase text-[#F5F5F0] font-extralight leading-none max-w-4xl mx-auto drop-shadow-2xl">
          Sacred Oils & <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] bg-clip-text text-transparent italic font-normal">
            Nocturnal Elixirs
          </span>
        </h1>

        {/* Narrative Paragraph */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#C5C5C0] font-light leading-relaxed tracking-wider">
          Hand-distilled in copper alembics in Grasse, France. Every bottle holds rare midnight-harvested roses, wild Cambodian oud, and sun-drenched Mediterranean neroli.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <a
            href="#catalog"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#E6C687] text-[#0A0A0B] font-bold text-xs uppercase tracking-[0.25em] hover:brightness-110 transition-all shadow-xl shadow-[#D4AF37]/10 flex items-center justify-center gap-3 group"
          >
            <span>Explore Collection</span>
            <Icon name="ArrowRight01Icon" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>

          <a
            href="#scent-quiz"
            className="w-full sm:w-auto px-8 py-4 bg-[#141417]/80 backdrop-blur-md border border-[#D4AF37]/40 text-[#F5F5F0] font-medium text-xs uppercase tracking-[0.25em] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] transition-all flex items-center justify-center gap-3"
          >
            <Icon name="Compass01Icon" className="w-4 h-4 text-[#D4AF37]" />
            <span>Interactive Scent Quiz</span>
          </a>
        </div>

        {/* Feature Badges Strip */}
        <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center border-t border-white/10 mt-12">
          <div className="space-y-1">
            <p className="text-xl font-serif text-[#D4AF37] font-normal">30%</p>
            <p className="text-[10px] uppercase tracking-widest text-[#A0A098]">Extrait Concentration</p>
          </div>
          <div className="space-y-1">
            <p className="text-xl font-serif text-[#D4AF37] font-normal">18+ Hrs</p>
            <p className="text-[10px] uppercase tracking-widest text-[#A0A098]">Eternal Longevity</p>
          </div>
          <div className="space-y-1">
            <p className="text-xl font-serif text-[#D4AF37] font-normal">Grasse</p>
            <p className="text-[10px] uppercase tracking-widest text-[#A0A098]">Artisanal Origin</p>
          </div>
          <div className="space-y-1">
            <p className="text-xl font-serif text-[#D4AF37] font-normal">Cruelty Free</p>
            <p className="text-[10px] uppercase tracking-widest text-[#A0A098]">Ethical Botanicals</p>
          </div>
        </div>

      </div>
    </section>
  );
}
