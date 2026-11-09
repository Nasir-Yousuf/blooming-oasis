"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, Leaf, Sparkles } from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  suggestions?: string[];
}

const KNOWLEDGE_BASE: Record<string, string> = {
  watering:
    "Most houseplants prefer drying out slightly between waterings! Stick your index finger 2 inches into the soil: if it feels dry, give it a thorough soak until water drains from the bottom. If it still feels cool and damp, wait 2–3 more days.",
  yellow:
    "Yellow leaves are usually a sign of moisture imbalance. If the yellow leaves are soft and floppy, it's often overwatering. If the yellow leaves are crispy at the tips, it may be low humidity, dry soil, or fluorinated tap water.",
  light:
    "Direct light creates a sharp, dark shadow; bright indirect light creates a soft-edged shadow. For low-light rooms, choose our Snake Plant, Raven ZZ Plant, or Golden Pothos!",
  pets:
    "For curious cats and dogs, look for non-toxic varieties! Our top pet-safe recommendations are Calathea Orbifolia, Boston Fern, Majesty Palm, and Peperomia Watermelon.",
  monstera:
    "Monstera Deliciosa thrives in bright indirect light! Water every 1–2 weeks once the top 2 inches dry out. Provide a moss pole or trellis to support large fenestrated leaves.",
  repot:
    "Repot your houseplants during active spring growth into a vessel 2 inches wider with proper drainage holes. Fresh aerated soil replenishes depleted micronutrients.",
};

export function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text: "Hello! Welcome to Blooming Oasis. I am your automated botanical guide. How can I assist your plant journey today?",
      timestamp: "Just now",
      suggestions: [
        "How often should I water?",
        "Why are my leaves turning yellow?",
        "Which plants are pet safe?",
        "How do I care for my Monstera?",
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const lower = query.toLowerCase();
      let botResponse =
        "Thank you for asking! For specific diagnostic questions or custom room consultations, you can also leave a message via our Contact page or speak with our master nursery team.";

      if (lower.includes("water") || lower.includes("drink")) {
        botResponse = KNOWLEDGE_BASE.watering;
      } else if (lower.includes("yellow") || lower.includes("brown") || lower.includes("leaf")) {
        botResponse = KNOWLEDGE_BASE.yellow;
      } else if (lower.includes("light") || lower.includes("sun") || lower.includes("dark")) {
        botResponse = KNOWLEDGE_BASE.light;
      } else if (lower.includes("pet") || lower.includes("cat") || lower.includes("dog") || lower.includes("toxic")) {
        botResponse = KNOWLEDGE_BASE.pets;
      } else if (lower.includes("monstera") || lower.includes("swiss")) {
        botResponse = KNOWLEDGE_BASE.monstera;
      } else if (lower.includes("repot") || lower.includes("soil") || lower.includes("pot")) {
        botResponse = KNOWLEDGE_BASE.repot;
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestions: ["Which plants are pet safe?", "Tell me about Monstera", "Lighting tips"],
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 750);
  };

  return (
    <>
      {/* Floating Chat Launcher Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-forest text-offwhite shadow-elevated hover:bg-forest-light hover:scale-105 active:scale-95 transition-all duration-300 border border-sage/30"
            aria-label="Open plant specialist chat"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sage opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-sage"></span>
            </span>
            <MessageSquare className="w-5 h-5 text-sage" />
            <span className="text-xs font-semibold tracking-wider uppercase hidden sm:inline">
              Ask Plant Specialist
            </span>
          </button>
        )}
      </div>

      {/* Chat Window Dialog */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 w-[92vw] sm:w-[380px] h-[520px] max-h-[85vh] bg-offwhite rounded-2xl shadow-2xl border border-sage/40 flex flex-col z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="px-5 py-4 bg-forest text-offwhite flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-forest-light border border-sage/40 flex items-center justify-center text-sage">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold text-offwhite flex items-center gap-1.5">
                  Plant Specialist AI
                  <span className="text-[10px] font-sans font-normal px-1.5 py-0.2 rounded bg-sage/20 text-sage border border-sage/30">
                    Automated
                  </span>
                </h3>
                <p className="text-[11px] text-sage/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-sage inline-block animate-pulse" />
                  Instant botanical assistance
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-sage hover:text-offwhite hover:bg-forest-light transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-cream/30 text-xs">
            <div className="text-center my-1">
              <span className="inline-flex items-center gap-1 text-[10px] text-charcoal/60 bg-cream px-2.5 py-1 rounded-full border border-sage/20">
                <Leaf className="w-3 h-3 text-botanical" /> Powered by Blooming Oasis Botanists
              </span>
            </div>

            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                    m.sender === "user"
                      ? "bg-forest text-offwhite rounded-br-xs"
                      : "bg-offwhite text-charcoal border border-sage/30 rounded-bl-xs shadow-sm"
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-charcoal/50 mt-1 px-1">
                  {m.timestamp}
                </span>

                {/* Quick question suggestion chips */}
                {m.suggestions && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {m.suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(suggestion)}
                        className="text-[11px] text-forest bg-cream hover:bg-sage/20 border border-sage/40 rounded-full px-2.5 py-1 transition-colors text-left flex items-center gap-1"
                      >
                        <Sparkles className="w-2.5 h-2.5 text-botanical" /> {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 text-charcoal/50 bg-offwhite border border-sage/30 px-3 py-2 rounded-2xl w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-botanical animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-botanical animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-botanical animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] ml-1">Consulting plant database...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-offwhite border-t border-sage/30 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about watering, light, pests..."
              className="flex-1 bg-cream/70 border border-sage/30 rounded-xl px-3 py-2 text-xs text-charcoal placeholder-charcoal/50 focus:outline-none focus:border-botanical"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2 rounded-xl bg-forest text-offwhite hover:bg-forest-light disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

