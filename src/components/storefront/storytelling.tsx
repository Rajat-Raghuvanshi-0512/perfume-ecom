"use client";

import { Icon } from "@/components/ui/icon";

export function Storytelling() {
  return (
    <section id="storytelling" className="py-24 bg-[#0A0A0B] text-[#F5F5F0] border-b border-white/10 relative overflow-hidden">
      
      {/* Background Decorative Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Dual Imagery Stack */}
          <div className="relative">
            <div className="relative z-10 overflow-hidden border border-[#D4AF37]/30 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=1000&auto=format&fit=crop"
                alt="Artisanal Fragrance Distillation"
                className="w-full h-[450px] object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-transparent" />
            </div>

            {/* Floating Gold Card Accent */}
            <div className="absolute -bottom-8 -right-4 sm:right-6 z-20 bg-[#121215]/95 border border-[#D4AF37]/40 p-6 backdrop-blur-md max-w-xs shadow-2xl">
              <div className="flex items-center gap-3 mb-2">
                <Icon name="CrownIcon" className="w-5 h-5 text-[#D4AF37]" />
                <span className="text-xs uppercase tracking-widest text-[#E6C687] font-semibold">Master Perfumer</span>
              </div>
              <p className="text-xs text-[#C5C5C0] italic leading-relaxed">
                "A perfume is a phantom ghost that lingers in the room long after the lover has departed."
              </p>
            </div>
          </div>

          {/* Right Column: Narrative Content */}
          <div className="space-y-8">
            
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-semibold">
                <Icon name="SparklesIcon" className="w-4 h-4" />
                <span>Our Heritage • Grasse, 1894</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-serif tracking-[0.15em] uppercase font-light leading-tight">
                The Alchemy of <br />
                <span className="italic text-[#E6C687] font-normal">Rare Botanicals</span>
              </h2>
            </div>

            <p className="text-sm text-[#B5B5A8] leading-relaxed tracking-wide font-light">
              Founded in the high-altitude hills of Grasse, France, Maison de Aura preserves the sacred tradition of slow cold-maceration. We source raw ingredients from ethical micro-farms across the globe—wild Cambodian oud wood, hand-plucked Florentine iris roots, and nocturnal Damask roses.
            </p>

            {/* Pillars */}
            <div className="space-y-4 pt-2">
              
              <div className="flex items-start gap-4 p-4 bg-[#121215] border border-white/5 hover:border-[#D4AF37]/30 transition-colors">
                <div className="p-2.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] shrink-0">
                  <Icon name="Leaf01Icon" className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-[#F5F5F0] font-semibold mb-1">
                    Nocturnal Harvests
                  </h4>
                  <p className="text-xs text-[#999990] leading-relaxed">
                    Petals gathered at 4 AM to preserve delicate volatile essential oils before sunlight touch.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-[#121215] border border-white/5 hover:border-[#D4AF37]/30 transition-colors">
                <div className="p-2.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] shrink-0">
                  <Icon name="Award01Icon" className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-[#F5F5F0] font-semibold mb-1">
                    6-Month Aged Maceration
                  </h4>
                  <p className="text-xs text-[#999990] leading-relaxed">
                    Distillates rest in French oak and copper casks for six months to develop profound sillage.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
