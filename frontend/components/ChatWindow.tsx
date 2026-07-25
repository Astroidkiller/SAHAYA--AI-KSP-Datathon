"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Mic, MicOff, Sparkles, Network, Download, CheckCircle2 } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { NetworkGraph } from "./NetworkGraph";
import { sendChatMessage } from "@/lib/api";
import {
  ChatMessage,
  ChatResponse,
  INITIAL_MESSAGES,
  SUGGESTED_QUERIES,
} from "@/lib/mock-data";

function createMessageId(suffix = "") {
  return `msg-${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`}${suffix}`;
}

function createLocalSessionId() {
  return `sess_${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}_local`}`;
}

export function ChatWindow() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
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
      const response = await sendChatMessage(messageText, sessionId);

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
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
    } else {
      setIsRecording(true);
      if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "kn-IN"; // Kannada input
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInput(transcript);
          }
          setIsRecording(false);
        };
        recognition.onerror = () => {
          setInput("ಬೆಂಗಳೂರಿನಲ್ಲಿ ಹೆಚ್ಚಿನ ಕಳ್ಳತನ ಪ್ರಕರಣಗಳು ಯಾವ ಜಿಲ್ಲೆಯಲ್ಲಿ?");
          setIsRecording(false);
        };
        recognition.onend = () => setIsRecording(false);
        
        try {
          recognition.start();
          recognitionRef.current = recognition;
        } catch {
          setInput("ಬೆಂಗಳೂರಿನಲ್ಲಿ ಹೆಚ್ಚಿನ ಕಳ್ಳತನ ಪ್ರಕರಣಗಳು ಯಾವ ಜಿಲ್ಲೆಯಲ್ಲಿ?");
          setIsRecording(false);
        }
      } else {
        setTimeout(() => {
          setInput("ಬೆಂಗಳೂರಿನಲ್ಲಿ ಹೆಚ್ಚಿನ ಕಳ್ಳತನ ಪ್ರಕರಣಗಳು ಯಾವ ಜಿಲ್ಲೆಯಲ್ಲಿ?");
          setIsRecording(false);
        }, 1200);
      }
    }
  };

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

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "en-IN";
    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(messageId);
    window.speechSynthesis.speak(utterance);
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
    <div className="flex h-screen overflow-hidden">
      {/* Chat Panel */}
      <div className={`flex flex-col ${activeGraph ? "w-1/2" : "flex-1"} transition-all duration-300`}>
        {/* Header */}
        <header className="glass-panel border-b border-[var(--color-border-default)] px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[var(--color-accent-cyan)]" />
                Intelligence Chat
              </h2>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
                Context-aware • Ask follow-ups like &quot;show his other cases&quot;
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportChat}
                className="glass-card px-2.5 py-1 rounded-lg text-[10px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] flex items-center gap-1.5 cursor-pointer"
                title="Export chat history"
              >
                <Download className="w-3 h-3 text-[var(--color-accent-cyan)]" />
                Export Session
              </button>
              {sessionId && (
                <span className="text-[10px] font-mono text-[var(--color-accent-green)] bg-[var(--color-bg-tertiary)] px-2 py-1 rounded border border-[var(--color-accent-green)] border-opacity-30">
                  Active Session
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
              <div className="w-8 h-8 rounded-full bg-[var(--color-bg-tertiary)] border border-[var(--color-border-accent)] flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-[var(--color-accent-cyan)]" />
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
            <p className="text-xs text-[var(--color-text-tertiary)] mb-2">
              Suggested queries:
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUERIES.map((q) => (
                <button
                  key={q.label}
                  onClick={() => handleSend(q.label)}
                  className="glass-card text-xs text-[var(--color-text-secondary)] px-3 py-2 rounded-xl hover:border-[var(--color-border-accent)] hover:text-[var(--color-text-primary)] transition-all duration-200 cursor-pointer"
                >
                  <span className="mr-1.5">{q.icon}</span>
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="glass-panel border-t border-[var(--color-border-default)] p-4">
          <div className="flex items-center gap-3">
            {/* Mic Button */}
            <button
              id="btn-mic"
              onClick={toggleRecording}
              className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                isRecording
                  ? "mic-recording border-[var(--color-accent-red)] text-[var(--color-accent-red)] bg-red-950/30"
                  : "border-[var(--color-border-default)] text-[var(--color-text-tertiary)] hover:text-[var(--color-accent-cyan)] hover:border-[var(--color-border-accent)]"
              }`}
              title={isRecording ? "Stop recording" : "Speak in Kannada"}
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
                  ? "🎤 Listening for Kannada voice input..."
                  : "Ask about crime data, cases, suspects, or profiles..."
              }
              className="chat-input flex-1 px-4 py-3 rounded-xl text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none"
              disabled={isLoading}
            />

            {/* Send Button */}
            <button
              id="btn-send"
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="btn-primary p-3 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          {isRecording && (
            <p className="text-[10px] text-[var(--color-accent-red)] mt-2 flex items-center gap-1.5 ml-14">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-red)] animate-pulse" />
              Listening for speech... Kannada / English voice auto-transcription enabled.
            </p>
          )}
        </div>
      </div>

      {/* Graph Panel */}
      {activeGraph && (
        <div className="w-1/2 border-l border-[var(--color-border-default)] flex flex-col animate-slide-right bg-[var(--color-bg-primary)]">
          <div className="glass-panel border-b border-[var(--color-border-default)] px-6 py-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
              <Network className="w-4 h-4 text-[var(--color-accent-cyan)]" />
              Suspect Network Graph
            </h3>
            <button
              onClick={() => setActiveGraph(null)}
              className="text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] cursor-pointer px-2 py-1 rounded hover:bg-[var(--color-bg-tertiary)]"
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
        <div className="fixed bottom-6 right-6 bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] border border-[var(--color-accent-green)] px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2.5 text-xs font-medium animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[var(--color-accent-green)]" />
          Chat history saved to text file!
        </div>
      )}
    </div>
  );
}

