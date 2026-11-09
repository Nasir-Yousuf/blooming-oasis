"use client";

import React, { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Sparkles, Sprout, Info } from "lucide-react";

interface GrowthStage {
  stage: number;
  title: string;
  age: string;
  description: string;
  previewImage: string;
  videoTimestamp: string;
  careTip: string;
}

const GROWTH_STAGES: GrowthStage[] = [
  {
    stage: 1,
    title: "Juvenile Seedling",
    age: "0 - 4 Months",
    description:
      "Emerges with charming solid heart-shaped foliage without holes. Focuses botanical energy on establishing resilient subterranean root systems.",
    previewImage:
      "https://images.unsplash.com/photo-1597055181300-e3633a917c9c?auto=format&fit=crop&w=1200&q=80",
    videoTimestamp: "0:00",
    careTip: "Keep soil lightly moist; avoid direct noon sun on fragile juvenile leaves.",
  },
  {
    stage: 2,
    title: "First Fenestrations",
    age: "5 - 12 Months",
    description:
      "As light intake increases, leaves develop signature internal perforations to allow lower leaves access to diffuse sunlight.",
    previewImage:
      "https://images.unsplash.com/photo-1617173944883-6ffbd35d584d?auto=format&fit=crop&w=1200&q=80",
    videoTimestamp: "1:15",
    careTip: "Introduce a coco-coir pole now so aerial roots have vertical anchoring.",
  },
  {
    stage: 3,
    title: "Architectural Grandeur",
    age: "18+ Months",
    description:
      "Towering mature specimen producing majestic 24-inch leaves with secondary pinhole fenestrations and sturdy climbing stems.",
    previewImage:
      "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=1200&q=80",
    videoTimestamp: "2:40",
    careTip: "Wipe leaves monthly with damp microfiber to maximize photosynthetic glow.",
  },
];

export function MonsteraGrowthVideo() {
  const [activeStage, setActiveStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Clearly labeled media source (Requirement Section 5.C)
  const videoSourceUrl = "https://assets.mixkit.co/videos/preview/mixkit-sunlight-on-the-leaves-of-a-potted-plant-41484-large.mp4";

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.warn("Video autoplay prevented by browser policy:", e);
      });
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <section className="py-20 sm:py-28 bg-cream/40 border-t border-sage/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest text-offwhite text-xs font-semibold uppercase tracking-wider mb-3">
            <Sprout className="w-3.5 h-3.5 text-sage" />
            Botanical Video & Life Cycle
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-forest tracking-tight leading-tight">
            The Monstera Growth Journey.
          </h2>
          <p className="text-sm text-charcoal/70 mt-3 leading-relaxed">
            Witness how a young seedling transforms into an architectural botanical icon through proper lighting and seasonal care.
          </p>
        </div>

        {/* Video Player Card */}
        <div className="max-w-5xl mx-auto bg-forest rounded-3xl overflow-hidden shadow-elevated border border-sage/30 text-offwhite">
          {/* Main Video Viewport */}
          <div className="relative aspect-[16/9] w-full bg-forest-dark overflow-hidden group">
            <video
              ref={videoRef}
              src={videoSourceUrl}
              poster={GROWTH_STAGES[activeStage].previewImage}
              playsInline
              loop
              muted={isMuted}
              className="w-full h-full object-cover"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/80 via-transparent to-forest-dark/30 pointer-events-none" />

            {/* Play/Pause Large Center Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={togglePlay}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-offwhite/90 text-forest hover:bg-offwhite hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-xl backdrop-blur-md"
                aria-label={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? (
                  <Pause className="w-7 h-7 sm:w-8 sm:h-8" />
                ) : (
                  <Play className="w-7 h-7 sm:w-8 sm:h-8 translate-x-0.5" />
                )}
              </button>
            </div>

            {/* Controls Bar */}
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 flex items-center justify-between text-xs text-cream/90 backdrop-blur-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="p-2 rounded-lg bg-forest/80 hover:bg-forest text-offwhite transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={toggleMute}
                  className="p-2 rounded-lg bg-forest/80 hover:bg-forest text-offwhite transition-colors"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <span className="font-mono text-[11px] hidden sm:inline">
                  Stage: {GROWTH_STAGES[activeStage].title}
                </span>
              </div>

              {/* Replaceable media indicator label (Requirement Section 5.C) */}
              <div className="flex items-center gap-1.5 text-[11px] text-sage bg-forest/80 px-3 py-1 rounded-full border border-sage/30">
                <Info className="w-3.5 h-3.5" />
                <span>Media Source: Botanical Showcase Stream</span>
              </div>
            </div>
          </div>

          {/* Interactive Stage Selector Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-forest-light/40 bg-forest-dark/80">
            {GROWTH_STAGES.map((stg, index) => (
              <button
                key={stg.stage}
                onClick={() => {
                  setActiveStage(index);
                  if (videoRef.current) {
                    videoRef.current.currentTime = 0;
                  }
                }}
                className={`p-6 text-left transition-all ${
                  activeStage === index
                    ? "bg-forest-light/40 border-b-2 md:border-b-0 md:border-t-2 border-sage"
                    : "hover:bg-forest-light/10 text-cream/70"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sage">
                    Stage 0{stg.stage} • {stg.age}
                  </span>
                  <span className="text-[11px] font-mono text-sage/80">
                    {stg.videoTimestamp}
                  </span>
                </div>
                <h4 className="font-serif text-lg font-bold text-offwhite">
                  {stg.title}
                </h4>
                <p className="text-xs text-cream/75 mt-1 leading-relaxed">
                  {stg.description}
                </p>
                <div className="mt-3 pt-2 border-t border-forest-light/40 flex items-start gap-1.5 text-[11px] text-sage">
                  <Sparkles className="w-3 h-3 text-sage flex-shrink-0 mt-0.5" />
                  <span>{stg.careTip}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

