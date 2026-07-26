"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Mic, MicOff, Shield, Network, Download, CheckCircle2 } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { NetworkGraph } from "./NetworkGraph";
import { sendChatMessage } from "@/lib/api";
import {
  ChatMessage,
  ChatResponse,
  INITIAL_MESSAGES,
  getInitialMessages,
  SUGGESTED_QUERIES,
} from "@/lib/mock-data";
import { useLanguage } from "@/lib/language-context";

function createMessageId(suffix = "") {
  return `msg-${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`}${suffix}`;
}

function createLocalSessionId() {
  return `sess_${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}_local`}`;
}

export function ChatWindow() {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>(() => getInitialMessages(language));
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [activeGraph, setActiveGraph] = useState<ChatResponse["graph"] | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [exportToast, setExportToast] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const fallbackTimerRef = useRef<any>(null);

  // Sync initial welcome message when language toggles if no conversation history exists
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && (prev[0].id === "welcome" || prev[0].id === "welcome-kn")) {
        return getInitialMessages(language);
      }
      return prev;
    });
  }, [language]);

  const stopRecognition = useCallback(() => {
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      stopRecognition();
    };
  }, [stopRecognition]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    const userMessage: ChatMessage = {
      id: createMessageId(),
      role: "user",
      content: messageText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await sendChatMessage(messageText, sessionId, language);

      if (response.session_id) {
        setSessionId(response.session_id);
      } else if (!sessionId) {
        setSessionId(createLocalSessionId());
      }

      const aiMessage: ChatMessage = {
        id: createMessageId("-ai"),
        role: "assistant",
        content: response.answer,
        timestamp: new Date().toISOString(),
        response,
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (response.graph) {
        setActiveGraph(response.graph);
      }
    } catch (err) {
      console.error("[SAHAYA] Unexpected error:", err);
      const errorMessage: ChatMessage = {
        id: createMessageId("-err"),
        role: "assistant",
        content: "An unexpected error occurred. Please try again.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      stopRecognition();
    } else {
      setIsRecording(true);
      const fallbackQuery =
        language === "kn"
          ? "ಬೆಂಗಳೂರಿನಲ್ಲಿ ಹೆಚ್ಚಿನ ಕಳ್ಳತನ ಪ್ರಕರಣಗಳು ಯಾವ ಜಿಲ್ಲೆಯಲ್ಲಿ?"
          : "Which district in Karnataka has the highest theft cases?";

      if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = language === "kn" ? "kn-IN" : "en-IN";
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInput(transcript);
          }
          setIsRecording(false);
        };
        recognition.onerror = () => {
          setInput(fallbackQuery);
          setIsRecording(false);
        };
        recognition.onend = () => setIsRecording(false);
        
        try {
          recognition.start();
          recognitionRef.current = recognition;
        } catch {
          setInput(fallbackQuery);
          setIsRecording(false);
        }
      } else {
        if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = setTimeout(() => {
          setInput(fallbackQuery);
          setIsRecording(false);
          fallbackTimerRef.current = null;
        }, 1200);
      }
    }
  };

  // Pre-load voices on mount so 1st click selects female voice without fallback delay
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      const handleVoicesChanged = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
      return () => {
        if (window.speechSynthesis) {
          window.speechSynthesis.onvoiceschanged = null;
        }
      };
    }
  }, []);

  const speakResponse = (messageId: string, text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();

    const cleanText = text
      .replace(/\*\*/g, "")
      .replace(/•/g, "")
      .replace(/🔗|⚠️|🙏|📊|🔍|🕸️|👤|📝|🎤/g, "")
      .replace(/\n+/g, ". ")
      .substring(0, 500);

    const doSpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      const maleNames = ["ravi", "david", "mark", "george", "guy", "james", "richard", "alex", "stefan", "pavel", "sean", "michael", "daniel", "brian", "chris", "male"];

      const isKannada = language === "kn" || /[\u0C80-\u0CFF]/.test(text);
      let selectedVoice: SpeechSynthesisVoice | null = null;
      let textToSpeak = cleanText;

      if (isKannada) {
        // Search for native Kannada voice (Google Kannada, kn-IN, Zia Regional TTS)
        selectedVoice = voices.find(v => 
          v.lang.toLowerCase().includes("kn") || 
          v.name.toLowerCase().includes("kannada") || 
          v.name.toLowerCase().includes("ಕನ್ನಡ")
        ) || null;

        // If system lacks native Kannada voice font, speak English summary to prevent gibberish
        if (!selectedVoice) {
          textToSpeak = text
            .replace(/ಬೆಂಗಳೂರು ನಗರ/g, "Bengaluru Urban")
            .replace(/ಕಳ್ಳತನ/g, "theft")
            .replace(/ಪ್ರಕರಣಗಳು/g, "cases")
            .replace(/ಆರೋಪಿ/g, "suspect")
            .replace(/ಅಪರಾಧ/g, "crime")
            .replace(/ಎಫ್‌ಐಆರ್/g, "FIR")
            .replace(/[\u0C80-\u0CFF]+/g, "")
            .replace(/\s+/g, " ")
            .trim();
          
          if (!textToSpeak || textToSpeak.length < 5) {
            textToSpeak = "Karnataka Police Intelligence Report summary generated for active case file.";
          }
        }
      }

      if (!selectedVoice) {
        const femalePriority = [
          "zira", "heera", "neerja", "aria", "jenny", "samantha",
          "google us english female", "google uk english female", "google us english",
          "karen", "victoria", "hazel", "susan", "catherine", "eva", "lisa",
          "female", "woman"
        ];
        
        for (const name of femalePriority) {
          const found = voices.find(v => v.name.toLowerCase().includes(name));
          if (found) {
            selectedVoice = found;
            break;
          }
        }

        if (!selectedVoice && voices.length > 0) {
          selectedVoice = voices.find(v => 
            !maleNames.some(m => v.name.toLowerCase().includes(m))
          ) || voices[0] || null;
        }
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak);

      if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang;
      } else {
        utterance.lang = isKannada ? "kn-IN" : "en-US";
      }

      utterance.rate = isKannada ? 0.9 : 1.1; // Unhurried 0.9x rate for Kannada, 1.1x for English
      utterance.pitch = isKannada ? 1.05 : 1.35; // Natural pitch

      utterance.onend = () => setSpeakingMessageId(null);
      utterance.onerror = () => setSpeakingMessageId(null);

      setSpeakingMessageId(messageId);
      window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        doSpeak();
      };
      window.speechSynthesis.getVoices();
      setTimeout(doSpeak, 150);
    } else {
      doSpeak();
    }
  };

  const handleExportChat = () => {
    const chatLog = messages
      .map((m) => `[${new Date(m.timestamp).toLocaleTimeString()}] ${m.role.toUpperCase()}:\n${m.content}\n`)
      .join("\n-----------------------------------\n");
    const blob = new Blob([chatLog], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sahaya-chat-session-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setExportToast(true);
    setTimeout(() => setExportToast(false), 2500);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-bg-primary)]">
      {/* Chat Panel */}
      <div className={`flex flex-col ${activeGraph ? "w-1/2" : "flex-1"} transition-all duration-300`}>
        {/* Header */}
        <header className="bg-[#111722] border-b border-slate-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[var(--color-accent-copper)]" />
                {t.chatHeader}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                {t.chatSubtitle}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportChat}
                className="bg-[#192231] border border-slate-800 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
                title={t.exportSession}
              >
                <Download className="w-3.5 h-3.5 text-[var(--color-accent-copper)]" />
                {t.exportSession}
              </button>
              {sessionId && (
                <span className="text-[10px] font-mono text-emerald-400 bg-slate-900 px-2 py-1 rounded border border-emerald-500/30">
                  {t.activeSession}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((msg, idx) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              style={{ animationDelay: `${idx * 0.05}s` }}
              onSpeak={msg.role === "assistant" ? () => speakResponse(msg.id, msg.content) : undefined}
              isSpeaking={speakingMessageId === msg.id}
            />
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-start gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-lg bg-[#192231] border border-slate-800 flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 text-[var(--color-accent-copper)]" />
              </div>
              <div className="chat-bubble-ai px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Queries */}
        {messages.length <= 2 && (
          <div className="px-6 pb-3">
            <p className="text-xs font-semibold text-slate-400 mb-2">
              {t.suggestedQueriesTitle}
            </p>
            <div className="flex flex-wrap gap-2">
              {(t.suggestedQueries || SUGGESTED_QUERIES).map((q) => (
                <button
                  key={q.label}
                  onClick={() => handleSend(q.label)}
                  className="bg-[#111722] border border-slate-800 text-xs text-slate-300 px-3 py-1.5 rounded-lg hover:border-[var(--color-border-accent)] hover:text-white transition-all cursor-pointer"
                >
                  <span className="mr-1.5">{q.icon}</span>
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="bg-[#111722] border-t border-slate-800 p-4">
          <div className="flex items-center gap-3">
            {/* Mic Button */}
            <button
              id="btn-mic"
              onClick={toggleRecording}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                isRecording
                  ? "bg-rose-950/40 border-rose-600 text-rose-500"
                  : "border-slate-800 text-slate-400 hover:text-[var(--color-accent-copper)] hover:border-slate-700 bg-[#192231]"
              }`}
              title="Speak in Kannada/English"
            >
              {isRecording ? <MicOff className="w-5 h-5 animate-pulse" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Text Input */}
            <input
              ref={inputRef}
              id="chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isRecording
                  ? t.listeningKannada
                  : t.inputPlaceholder
              }
              className="bg-[#0A0D12] border border-slate-800 rounded-lg flex-1 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[var(--color-border-accent)]"
              disabled={isLoading}
            />

            {/* Send Button */}
            <button
              id="btn-send"
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="btn-primary px-4 py-2.5 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {isRecording && (
            <p className="text-[10px] text-rose-400 mt-2 flex items-center gap-1.5 ml-14 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              {t.listeningSubtext}
            </p>
          )}
        </div>
      </div>

      {/* Graph Panel */}
      {activeGraph && (
        <div className="w-1/2 border-l border-slate-800 flex flex-col animate-slide-right bg-[#0A0D12]">
          <div className="bg-[#111722] border-b border-slate-800 px-6 py-4 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Network className="w-4 h-4 text-[var(--color-accent-copper)]" />
              {t.networkTitle}
            </h3>
            <button
              onClick={() => setActiveGraph(null)}
              className="text-xs text-slate-400 hover:text-white cursor-pointer px-2 py-1 rounded hover:bg-slate-800"
            >
              Close ✕
            </button>
          </div>
          <div className="flex-1">
            <NetworkGraph data={activeGraph} />
          </div>
        </div>
      )}

      {/* Export Toast */}
      {exportToast && (
        <div className="fixed bottom-6 right-6 bg-[#111722] text-slate-100 border border-emerald-500/40 px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2.5 text-xs font-medium animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {t.exportChatToast}
        </div>
      )}
    </div>
  );
}
