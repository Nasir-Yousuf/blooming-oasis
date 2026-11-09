"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  X,
  Send,
  Bot,
  Leaf,
  Sparkles,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import { IProductCardSummary } from "@/models/AiConversation";

interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
  productRecommendations?: IProductCardSummary[];
}

export function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [config, setConfig] = useState({
    enabled: true,
    displayName: "Blooming AI",
    welcomeMessage:
      "Hello! I'm Blooming AI, your personal plant specialist. Whether you're looking for your first houseplant, trying to save a struggling Monstera, or finding the perfect plant for your home, I'm here to help. What can I help you grow today?",
    suggestedQuestions: [
      "Find a plant for my room",
      "Which plants are safe for pets?",
      "Help me care for my Monstera",
      "Recommend beginner-friendly plants",
      "Track my order",
    ],
  });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize session and fetch AI configuration
  useEffect(() => {
    // Generate or retrieve persistent browser session ID
    let currentSession = "";
    try {
      currentSession = localStorage.getItem("blooming_ai_session_id") || "";
      if (!currentSession) {
        currentSession = `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        localStorage.setItem("blooming_ai_session_id", currentSession);
      }
    } catch {
      currentSession = `session-${Date.now()}`;
    }
    setSessionId(currentSession);

    // Fetch live config from server
    fetch("/api/chat/config")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setConfig({
            enabled: data.enabled ?? true,
            displayName: data.displayName || "Blooming AI",
            welcomeMessage: data.welcomeMessage,
            suggestedQuestions: data.suggestedQuestions || [],
          });

          // Set initial welcome message
          setMessages([
            {
              id: "welcome-init",
              role: "model",
              content: data.welcomeMessage,
              timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          ]);
        }
      })
      .catch((e) => console.warn("Failed to load AI config:", e));
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [messages, isOpen, isTyping]);

  // If disabled by administrator, do not render the customer-facing chat launcher
  if (!config.enabled) {
    return null;
  }

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || input).trim();
    if (!textToSend || isTyping) return;

    const userMessageId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMessageId,
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // Prepare history snapshot for conversation memory context (excluding initial welcome)
    const currentHistory = messages
      .filter((m) => m.id !== "welcome-init")
      .map((m) => ({
        role: m.role,
        content: m.content,
      }));

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          sessionId,
          history: currentHistory.slice(-12), // Keep last 12 context messages
        }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.message) {
        const botMsg: ChatMessage = {
          id: data.message.id || `model-${Date.now()}`,
          role: "model",
          content: data.message.content,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          productRecommendations: data.message.productRecommendations || [],
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        const errorContent =
          data.error ||
          "I'm having a brief connection issue right now. Please try again in a moment or explore our plant catalog!";
        const errorMsg: ChatMessage = {
          id: `error-${Date.now()}`,
          role: "model",
          content: errorContent,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch (err) {
      console.error("Chat send error:", err);
      const networkErrorMsg: ChatMessage = {
        id: `net-err-${Date.now()}`,
        role: "model",
        content:
          "I'm having trouble connecting to my botanical care service right now. Please check your connection and try again.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, networkErrorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearConversation = async () => {
    if (window.confirm("Start a new conversation and clear current history?")) {
      try {
        if (sessionId) {
          await fetch(`/api/chat/history?sessionId=${encodeURIComponent(sessionId)}`, {
            method: "DELETE",
          });
        }
      } catch (e) {
        console.warn("Clear history error:", e);
      }

      const freshSession = `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setSessionId(freshSession);
      try {
        localStorage.setItem("blooming_ai_session_id", freshSession);
      } catch {}

      setMessages([
        {
          id: "welcome-reset",
          role: "model",
          content: config.welcomeMessage,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }
  };

  // Safe markdown text formatter for links, bold, bullet points
  const renderFormattedContent = (content: string) => {
    const lines = content.split("\n");

    return lines.map((line, lineIdx) => {
      // Process bold **text** and links [text](url)
      const renderLineParts = (str: string) => {
        const regex = /(\[.*?\]\(.*?\)|\*\*.*?\*\*)/g;
        const parts = [];
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(str)) !== null) {
          if (match.index > lastIndex) {
            parts.push(str.substring(lastIndex, match.index));
          }
          const token = match[0];
          if (token.startsWith("[") && token.includes("](")) {
            const label = token.substring(1, token.indexOf("]("));
            const url = token.substring(token.indexOf("](") + 2, token.length - 1);
            parts.push(
              <Link
                key={`link-${match.index}`}
                href={url}
                className="text-botanical hover:underline font-semibold inline-flex items-center gap-0.5"
              >
                <span>{label}</span>
                <ExternalLink className="w-2.5 h-2.5 inline-block" />
              </Link>
            );
          } else if (token.startsWith("**") && token.endsWith("**")) {
            parts.push(
              <strong key={`b-${match.index}`} className="font-semibold text-forest">
                {token.slice(2, -2)}
              </strong>
            );
          }
          lastIndex = regex.lastIndex;
        }

        if (lastIndex < str.length) {
          parts.push(str.substring(lastIndex));
        }

        return parts.length > 0 ? parts : str;
      };

      if (line.trim().startsWith("- ") || line.trim().startsWith("• ")) {
        const itemText = line.trim().replace(/^[-•]\s*/, "");
        return (
          <li key={lineIdx} className="ml-3.5 list-disc my-0.5">
            {renderLineParts(itemText)}
          </li>
        );
      }

      if (line.trim().match(/^\d+\.\s/)) {
        const itemText = line.trim().replace(/^\d+\.\s*/, "");
        return (
          <li key={lineIdx} className="ml-3.5 list-decimal my-0.5">
            {renderLineParts(itemText)}
          </li>
        );
      }

      return (
        <p key={lineIdx} className={lineIdx > 0 ? "mt-1.5" : ""}>
          {renderLineParts(line)}
        </p>
      );
    });
  };

  return (
    <>
      {/* Floating Chat Launcher Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-full bg-forest text-offwhite shadow-elevated hover:bg-forest-light hover:scale-105 active:scale-95 transition-all duration-300 border border-sage/40"
            aria-label="Open plant specialist chat"
          >
            {/* Pulsing Online Green Indicator */}
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>

            <div className="flex items-center gap-1.5 text-sage group-hover:text-offwhite transition-colors">
              <Bot className="w-5 h-5" />
            </div>

            <div className="flex flex-col text-left">
              <span className="text-xs font-serif font-bold tracking-wide text-offwhite">
                {config.displayName}
              </span>
              <span className="text-[10px] font-sans uppercase tracking-wider text-sage hidden sm:inline">
                Plant Specialist 24/7
              </span>
            </div>
          </button>
        )}
      </div>

      {/* Chat Window Dialog */}
      {isOpen && (
        <div className="fixed bottom-4 sm:bottom-6 right-3 sm:right-6 w-[94vw] sm:w-[410px] h-[580px] max-h-[88vh] bg-offwhite rounded-3xl shadow-2xl border border-sage/40 flex flex-col z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="px-5 py-3.5 bg-forest text-offwhite flex items-center justify-between border-b border-forest-light/40">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-forest-light border border-sage/40 flex items-center justify-center text-sage">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-forest rounded-full"></span>
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold text-offwhite flex items-center gap-1.5">
                  {config.displayName}
                  <span className="text-[9px] font-sans font-medium px-1.5 py-0.5 rounded-full bg-sage/20 text-sage border border-sage/30">
                    AI Specialist
                  </span>
                </h3>
                <p className="text-[11px] text-sage/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  Live MongoDB Catalog Sync
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearConversation}
                className="p-1.5 rounded-lg text-sage hover:text-offwhite hover:bg-forest-light/60 transition-colors"
                title="Start new conversation"
                aria-label="Start new conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-sage hover:text-offwhite hover:bg-forest-light/60 transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-cream/30 text-xs">
            <div className="text-center my-1">
              <span className="inline-flex items-center gap-1.5 text-[10px] text-charcoal/70 bg-white/80 px-3 py-1 rounded-full border border-sage/30 shadow-2xs">
                <Leaf className="w-3 h-3 text-botanical" /> Blooming Oasis Botanical Concierge
              </span>
            </div>

            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 leading-relaxed shadow-2xs ${
                    m.role === "user"
                      ? "bg-forest text-offwhite rounded-br-xs"
                      : "bg-white text-charcoal border border-sage/30 rounded-bl-xs"
                  }`}
                >
                  {renderFormattedContent(m.content)}

                  {/* Render Product Recommendation Cards if present */}
                  {m.productRecommendations &&
                    m.productRecommendations.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-sage/20 space-y-2.5">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-forest flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-botanical" />
                          <span>Matching Catalog Plants:</span>
                        </div>

                        <div className="space-y-2">
                          {m.productRecommendations.map((prod) => (
                            <div
                              key={prod.slug}
                              className="p-2.5 bg-cream/50 rounded-xl border border-sage/40 flex items-center justify-between gap-2.5 hover:border-botanical transition-colors"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                {prod.image ? (
                                  <img
                                    src={prod.image}
                                    alt={prod.name}
                                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-sage/30"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-lg bg-sage/30 flex items-center justify-center text-forest flex-shrink-0">
                                    <Leaf className="w-5 h-5" />
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <h4 className="font-serif font-bold text-xs text-forest truncate">
                                    {prod.name}
                                  </h4>
                                  <div className="flex items-center gap-1.5 text-[10px] text-charcoal/70">
                                    <span className="font-bold text-botanical">
                                      ${prod.price}
                                    </span>
                                    {prod.discountPrice ? (
                                      <span className="line-through text-charcoal/40 text-[9px]">
                                        ${prod.discountPrice}
                                      </span>
                                    ) : null}
                                    <span>•</span>
                                    <span>{prod.category}</span>
                                  </div>
                                  <div className="flex items-center gap-1 mt-0.5">
                                    {prod.petFriendly && (
                                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-medium">
                                        Pet Safe
                                      </span>
                                    )}
                                    <span
                                      className={`text-[9px] px-1.5 py-0.2 rounded ${
                                        prod.stock > 0
                                          ? "bg-sage/20 text-forest"
                                          : "bg-red-100 text-red-700"
                                      }`}
                                    >
                                      {prod.stock > 0
                                        ? `${prod.stock} in stock`
                                        : "Out of Stock"}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <Link
                                href={`/products/${prod.slug}`}
                                onClick={() => setIsOpen(false)}
                                className="px-2.5 py-1.5 rounded-lg bg-forest hover:bg-forest-light text-offwhite text-[10px] font-semibold flex items-center gap-1 flex-shrink-0 transition-colors shadow-2xs"
                              >
                                <span>View</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>

                <span className="text-[10px] text-charcoal/50 mt-1 px-1">
                  {m.timestamp}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-charcoal/60 bg-white border border-sage/30 px-3.5 py-2.5 rounded-2xl w-fit shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-botanical animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-botanical animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-botanical animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] ml-1">
                  Consulting greenhouse database...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggested Question Chips */}
          {config.suggestedQuestions?.length > 0 && (
            <div className="px-3 py-2 bg-cream/40 border-t border-sage/20 overflow-x-auto scrollbar-none flex gap-1.5">
              {config.suggestedQuestions.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(question)}
                  disabled={isTyping}
                  className="whitespace-nowrap text-[11px] text-forest bg-white hover:bg-sage/20 border border-sage/30 rounded-full px-2.5 py-1 transition-colors flex items-center gap-1 shadow-2xs disabled:opacity-40"
                >
                  <Sparkles className="w-2.5 h-2.5 text-botanical" />
                  <span>{question}</span>
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-sage/30 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about watering, light, pet safety, or orders..."
              maxLength={1000}
              disabled={isTyping}
              className="flex-1 bg-cream/50 border border-sage/40 rounded-xl px-3.5 py-2.5 text-xs text-charcoal placeholder-charcoal/50 focus:outline-none focus:border-botanical disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-2.5 rounded-xl bg-forest text-offwhite hover:bg-forest-light disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs"
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
