"use client";

import React, { useState, useEffect } from "react";
import {
  Bot,
  Sparkles,
  Save,
  Check,
  ShieldCheck,
  Layers,
  Database,
  Cpu,
  Plus,
  X,
  Send,
  RefreshCw,
  Activity,
  MessageSquare,
} from "lucide-react";

export default function AdminAiAssistantPage() {
  const [, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [settings, setSettings] = useState<any>({
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
    supportedTopics: [
      "Indoor Plant Selection",
      "Watering & Sunlight Needs",
      "Pest & Disease Diagnosis",
      "Pet & Child Safety",
      "Order Status & Tracking",
      "Greenhouse Store Policies",
    ],
    customKnowledge:
      "Blooming Oasis offers complimentary greenhouse consultation. Free shipping is provided on all orders over $75. Orders typically ship within 24-48 business hours with specialized plant protection packaging.",
    stats: {
      totalMessages: 0,
      totalConversations: 0,
      totalToolCalls: 0,
      lastActive: new Date(),
    },
  });

  const [envStatus, setEnvStatus] = useState<any>({
    model: "gemini-3.5-flash-lite",
    apiKeyConfigured: true,
    maskedKey: "••••••••",
  });

  const [newQuestion, setNewQuestion] = useState("");
  const [newTopic, setNewTopic] = useState("");

  // Sandbox testing state
  const [testPrompt, setTestPrompt] = useState("");
  const [testLoading, setTestLoading] = useState(false);
  const [testResponse, setTestResponse] = useState<any>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/ai-assistant");
      const data = await res.json();
      if (data.success) {
        if (data.settings) setSettings(data.settings);
        if (data.envStatus) setEnvStatus(data.envStatus);
      }
    } catch (e) {
      console.warn("Failed to fetch AI settings:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/ai-assistant", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setToastMessage("AI Plant Specialist settings saved successfully!");
        setTimeout(() => setToastMessage(""), 3500);
      } else {
        alert(data.message || "Failed to save settings");
      }
    } catch (e) {
      console.error("Save AI settings error:", e);
      alert("Network error while saving settings.");
    } finally {
      setSaving(false);
    }
  };

  const addQuestion = () => {
    if (!newQuestion.trim()) return;
    setSettings({
      ...settings,
      suggestedQuestions: [...settings.suggestedQuestions, newQuestion.trim()],
    });
    setNewQuestion("");
  };

  const removeQuestion = (idx: number) => {
    setSettings({
      ...settings,
      suggestedQuestions: settings.suggestedQuestions.filter(
        (_: any, i: number) => i !== idx
      ),
    });
  };

  const addTopic = () => {
    if (!newTopic.trim()) return;
    setSettings({
      ...settings,
      supportedTopics: [...settings.supportedTopics, newTopic.trim()],
    });
    setNewTopic("");
  };

  const removeTopic = (idx: number) => {
    setSettings({
      ...settings,
      supportedTopics: settings.supportedTopics.filter(
        (_: any, i: number) => i !== idx
      ),
    });
  };

  const runTestPrompt = async () => {
    if (!testPrompt.trim()) return;
    setTestLoading(true);
    setTestResponse(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: testPrompt,
          sessionId: "admin-sandbox-test",
          history: [],
        }),
      });
      const data = await res.json();
      setTestResponse(data);
    } catch (err: any) {
      setTestResponse({ success: false, error: err.message });
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-forest text-offwhite px-4 py-3 rounded-2xl shadow-elevated border border-sage/40 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-4">
          <Check className="w-4 h-4 text-sage" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-forest-light text-sage border border-sage/30">
              <Bot className="w-5 h-5" />
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest tracking-tight">
              AI Plant Specialist Management
            </h1>
          </div>
          <p className="text-xs text-charcoal/60 mt-1">
            Configure Blooming AI identity, live MongoDB tool connectivity, welcome prompts, and custom nursery guidance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchSettings}
            className="p-2 rounded-xl bg-white border border-sage/30 hover:bg-cream text-charcoal text-xs transition-colors"
            title="Refresh AI configuration"
          >
            <RefreshCw className="w-4 h-4 text-forest" />
          </button>
        </div>
      </div>

      {/* Status & Telemetry Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-offwhite rounded-2xl p-4 border border-sage/30 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-semibold text-charcoal/60 tracking-wider">
              Gemini Model
            </div>
            <div className="text-xs font-bold text-forest font-mono">
              {envStatus.model}
            </div>
            <div className="text-[10px] text-emerald-600 font-medium">
              Google Gen AI SDK
            </div>
          </div>
        </div>

        <div className="bg-offwhite rounded-2xl p-4 border border-sage/30 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-botanical/10 border border-botanical/20 flex items-center justify-center text-botanical">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-semibold text-charcoal/60 tracking-wider">
              Tool Function Calls
            </div>
            <div className="text-sm font-bold text-forest">
              {settings.stats?.totalToolCalls || 0}
            </div>
            <div className="text-[10px] text-charcoal/50">
              MongoDB Live Queries
            </div>
          </div>
        </div>

        <div className="bg-offwhite rounded-2xl p-4 border border-sage/30 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-forest-light text-sage flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-semibold text-charcoal/60 tracking-wider">
              Total Messages
            </div>
            <div className="text-sm font-bold text-forest">
              {settings.stats?.totalMessages || 0}
            </div>
            <div className="text-[10px] text-charcoal/50">
              Customer interactions
            </div>
          </div>
        </div>

        <div className="bg-offwhite rounded-2xl p-4 border border-sage/30 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-semibold text-charcoal/60 tracking-wider">
              API Key Security
            </div>
            <div className="text-xs font-bold text-forest">
              {envStatus.apiKeyConfigured ? "Secured in Server" : "Missing"}
            </div>
            <div className="text-[10px] font-mono text-charcoal/50">
              {envStatus.maskedKey}
            </div>
          </div>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Assistant Availability & Identity Card */}
        <div className="bg-offwhite rounded-3xl p-6 sm:p-8 border border-sage/30 shadow-soft space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-sage/20">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-botanical" />
              <div>
                <h2 className="font-serif text-lg font-bold text-forest">
                  Assistant Status & Identity
                </h2>
                <p className="text-[11px] text-charcoal/60">
                  Control customer-facing visibility and conversational persona.
                </p>
              </div>
            </div>

            {/* Enable/Disable Toggle */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enabled}
                onChange={(e) =>
                  setSettings({ ...settings, enabled: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-cream border border-sage/40 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-botanical"></div>
              <span className="ml-3 text-xs font-semibold text-charcoal">
                {settings.enabled ? (
                  <span className="text-botanical">Active (Online)</span>
                ) : (
                  <span className="text-charcoal/50">Disabled (Offline)</span>
                )}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
                Assistant Display Name
              </label>
              <input
                type="text"
                value={settings.displayName}
                onChange={(e) =>
                  setSettings({ ...settings, displayName: e.target.value })
                }
                placeholder="e.g. Blooming AI"
                className="w-full bg-cream/60 border border-sage/40 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:border-botanical"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
                Role & Persona Scope
              </label>
              <input
                type="text"
                disabled
                value="Personal Plant Specialist at Blooming Oasis"
                className="w-full bg-cream/40 border border-sage/30 rounded-xl px-3.5 py-2 text-xs text-charcoal/70 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
              Customer Welcome Message
            </label>
            <textarea
              rows={3}
              value={settings.welcomeMessage}
              onChange={(e) =>
                setSettings({ ...settings, welcomeMessage: e.target.value })
              }
              className="w-full bg-cream/60 border border-sage/40 rounded-xl p-3 text-xs text-charcoal focus:outline-none focus:border-botanical leading-relaxed"
            />
            <p className="text-[10px] text-charcoal/50 mt-1">
              Displayed as the first proactive message when a visitor opens the live chat.
            </p>
          </div>
        </div>

        {/* Suggested Questions & Assistance Topics */}
        <div className="bg-offwhite rounded-3xl p-6 sm:p-8 border border-sage/30 shadow-soft space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-sage/20">
            <Layers className="w-5 h-5 text-botanical" />
            <div>
              <h2 className="font-serif text-lg font-bold text-forest">
                Suggested Prompt Chips & Knowledge Topics
              </h2>
              <p className="text-[11px] text-charcoal/60">
                Customize the starter chips that appear above the chat input box.
              </p>
            </div>
          </div>

          {/* Quick Questions Chips */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-2">
              Suggested Question Chips (Shown in Chat UI)
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {settings.suggestedQuestions?.map((q: string, idx: number) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cream border border-sage/40 text-xs text-forest font-medium shadow-xs"
                >
                  <span>{q}</span>
                  <button
                    type="button"
                    onClick={() => removeQuestion(idx)}
                    className="hover:text-terracotta text-charcoal/50 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addQuestion();
                  }
                }}
                placeholder="Type a new suggested question and press Add..."
                className="flex-1 bg-cream/60 border border-sage/40 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:border-botanical"
              />
              <button
                type="button"
                onClick={addQuestion}
                className="px-4 py-2 bg-forest text-offwhite rounded-xl text-xs font-semibold hover:bg-forest-light flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>

          {/* Supported Topics */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-2">
              Supported Assistance Topics
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {settings.supportedTopics?.map((topic: string, idx: number) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-forest-light/20 border border-forest-light/30 text-xs text-forest font-medium"
                >
                  <Check className="w-3 h-3 text-botanical" />
                  <span>{topic}</span>
                  <button
                    type="button"
                    onClick={() => removeTopic(idx)}
                    className="hover:text-terracotta text-charcoal/50 ml-1 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTopic();
                  }
                }}
                placeholder="Add another topic (e.g. Rare Variegated Species)..."
                className="flex-1 bg-cream/60 border border-sage/40 rounded-xl px-3.5 py-2 text-xs text-charcoal focus:outline-none focus:border-botanical"
              />
              <button
                type="button"
                onClick={addTopic}
                className="px-4 py-2 bg-forest text-offwhite rounded-xl text-xs font-semibold hover:bg-forest-light flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Topic
              </button>
            </div>
          </div>

          {/* Store-specific knowledge and policies */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal/80 mb-1">
              Store-Specific Knowledge & Nursery Policies
            </label>
            <textarea
              rows={4}
              value={settings.customKnowledge}
              onChange={(e) =>
                setSettings({ ...settings, customKnowledge: e.target.value })
              }
              placeholder="e.g. Free greenhouse pickup is available in San Francisco. We provide a 30-day healthy plant replacement guarantee..."
              className="w-full bg-cream/60 border border-sage/40 rounded-xl p-3 text-xs text-charcoal focus:outline-none focus:border-botanical leading-relaxed"
            />
            <p className="text-[10px] text-charcoal/50 mt-1">
              Injected into Gemini&apos;s authoritative system prompt to answer questions about local greenhouse hours, special policies, and promotions accurately.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-forest hover:bg-forest-light text-offwhite text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-sm disabled:opacity-50 transition-all"
          >
            <Save className="w-4 h-4 text-sage" />
            {saving ? "Saving AI Settings..." : "Save AI Configuration"}
          </button>
        </div>
      </form>

      {/* Interactive Admin Diagnostic Sandbox */}
      <div className="bg-offwhite rounded-3xl p-6 sm:p-8 border border-sage/30 shadow-soft space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-sage/20">
          <Activity className="w-5 h-5 text-botanical" />
          <div>
            <h2 className="font-serif text-lg font-bold text-forest">
              Live Specialist Test Sandbox
            </h2>
            <p className="text-[11px] text-charcoal/60">
              Test Gemini&apos;s real-time queries against your live MongoDB database catalog directly.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={testPrompt}
            onChange={(e) => setTestPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                runTestPrompt();
              }
            }}
            placeholder="Try: 'I need a pet-safe plant for low light' or 'What is the price of Monstera Deliciosa?'"
            className="flex-1 bg-cream/60 border border-sage/40 rounded-xl px-3.5 py-2.5 text-xs text-charcoal focus:outline-none focus:border-botanical"
          />
          <button
            type="button"
            onClick={runTestPrompt}
            disabled={testLoading || !testPrompt.trim()}
            className="px-5 py-2.5 bg-botanical hover:bg-forest text-offwhite rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50 transition-colors"
          >
            {testLoading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>{testLoading ? "Consulting..." : "Test Query"}</span>
          </button>
        </div>

        {testResponse && (
          <div className="mt-4 p-4 rounded-2xl bg-cream/70 border border-sage/30 space-y-3">
            <div className="flex items-center justify-between text-[11px] font-semibold text-forest">
              <span>Diagnostic Result:</span>
              <span
                className={`px-2 py-0.5 rounded ${
                  testResponse.success
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {testResponse.success ? "200 OK" : "Error"}
              </span>
            </div>

            {testResponse.message && (
              <div className="text-xs text-charcoal whitespace-pre-wrap leading-relaxed bg-offwhite p-3.5 rounded-xl border border-sage/20">
                {testResponse.message.content}
              </div>
            )}

            {testResponse.message?.productRecommendations?.length > 0 && (
              <div>
                <div className="text-[11px] font-bold text-forest mb-2">
                  Matching MongoDB Catalog Products (
                  {testResponse.message.productRecommendations.length}):
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {testResponse.message.productRecommendations.map(
                    (p: any, i: number) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-2 bg-offwhite rounded-xl border border-sage/30 text-xs"
                      >
                        {p.image && (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-10 h-10 object-cover rounded-lg"
                          />
                        )}
                        <div className="min-w-0">
                          <div className="font-bold text-forest truncate">
                            {p.name}
                          </div>
                          <div className="text-[11px] text-charcoal/70">
                            ${p.price}{" "}
                            {p.petFriendly ? "• Pet Safe" : "• Toxic to Pets"} •{" "}
                            {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {testResponse.error && (
              <div className="text-xs text-red-700 bg-red-50 p-3 rounded-xl border border-red-200">
                {testResponse.error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
