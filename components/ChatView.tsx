"use client";

import { Settings, Bot, Quote, ChevronDown, Send, Star, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  docs?: any[];
}

export default function ChatView() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [chatId, setChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize or fetch the latest chat
    const initChat = async () => {
      try {
        let { data: chats, error } = await supabase
          .from("chats")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1);

        if (error) {
          console.error("Supabase error fetching chats:", error);
          setMessages([{ id: 'error-init', role: 'assistant', content: `채팅 초기화 실패 (데이터베이스 연결 오류): ${error.message}` }]);
          return;
        }

        let currentChatId = null;

        if (chats && chats.length > 0) {
          currentChatId = chats[0].id;
        } else {
          // Create a new chat
          const { data: newChat, error: newChatError } = await supabase
            .from("chats")
            .insert({})
            .select()
            .single();
            
          if (newChatError) {
            console.error("Supabase error creating chat:", newChatError);
            setMessages([{ id: 'error-init-2', role: 'assistant', content: `새 채팅 생성 실패: ${newChatError.message}` }]);
            return;
          }
            
          if (newChat) currentChatId = newChat.id;
        }

        if (currentChatId) {
          setChatId(currentChatId);
          // Load messages for this chat
          const { data: dbMessages } = await supabase
            .from("messages")
            .select("*")
            .eq("chat_id", currentChatId)
            .order("created_at", { ascending: true });
          
          if (dbMessages) {
            setMessages(dbMessages.map(m => ({
              id: m.id,
              role: m.role as "user" | "assistant",
              content: m.content
            })));
          }
        }
      } catch (err: any) {
        console.error("Unexpected error initializing chat:", err);
        setMessages([{ id: 'error-init-3', role: 'assistant', content: `채팅 초기화 중 알 수 없는 오류가 발생했습니다.` }]);
      }
    };

    initChat();
  }, []);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatId || isLoading) return;

    const userMessageContent = input;
    setInput("");
    setIsLoading(true);

    const tempUserId = Date.now().toString();
    setMessages(prev => [...prev, { id: tempUserId, role: "user", content: userMessageContent }]);

    // Insert user message to Supabase
    await supabase.from("messages").insert({
      chat_id: chatId,
      role: "user",
      content: userMessageContent
    });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessageContent }),
      });

      const data = await res.json();
      
      const assistantMessageContent = data.answer || data.error || "오류가 발생했습니다.";
      const docs = data.docs;

      const tempAssistantId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: tempAssistantId, role: "assistant", content: assistantMessageContent, docs }]);

      // Insert assistant message to Supabase
      await supabase.from("messages").insert({
        chat_id: chatId,
        role: "assistant",
        content: assistantMessageContent
      });

    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: "assistant", content: "통신 오류가 발생했습니다." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8f9fa] relative">
      <header className="h-16 border-b border-gray-200 flex items-center justify-between px-8 bg-white shrink-0">
        <h1 className="text-xl font-bold text-[#0052cc]">프리미엄 무선 이어폰 Pro</h1>
        <button className="text-gray-500 hover:text-gray-700">
          <Settings className="w-5 h-5" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-8 py-6 pb-32">
        <div className="max-w-4xl mx-auto flex flex-col gap-6">
          <div className="flex justify-center">
            <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">Today</span>
          </div>

          {messages.map((msg, index) => (
            <div key={msg.id || index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'user' ? (
                <div className="bg-[#0052cc] text-white px-6 py-3 rounded-2xl rounded-tr-sm max-w-[80%] shadow-sm">
                  <p>{msg.content}</p>
                </div>
              ) : (
                <div className="flex gap-4 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-[#0052cc] flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex flex-col gap-3 flex-1">
                    <div className="bg-white text-gray-800 px-6 py-4 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 leading-relaxed">
                      <p>{msg.content}</p>
                    </div>

                    {msg.docs && msg.docs.length > 0 && (
                      <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden mt-2 shadow-sm">
                        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100 cursor-pointer">
                          <div className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                            <Quote className="w-4 h-4" />
                            참고한 리뷰
                          </div>
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="p-4 flex flex-col gap-3 bg-gray-50/50">
                          {msg.docs.map((doc, i) => (
                            <div key={i} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                  <div className="flex text-yellow-400">
                                    {Array.from({ length: 5 }).map((_, starIdx) => (
                                      <Star key={starIdx} className={`w-4 h-4 ${starIdx < parseInt(doc.metadata?.rating || '5') ? 'fill-current text-yellow-400' : 'text-gray-200 fill-current'}`} />
                                    ))}
                                  </div>
                                  <span className="text-gray-800">{doc.metadata?.author || "익명"}</span>
                                </div>
                              </div>
                              <p className="text-gray-600 text-sm leading-relaxed">
                                "{doc.pageContent}"
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-[#0052cc] flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white text-gray-800 px-6 py-4 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#0052cc]" />
                <span className="text-sm text-gray-500">답변을 생성중입니다...</span>
              </div>
            </div>
          )}
          <div ref={endOfMessagesRef} />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#f8f9fa] via-[#f8f9fa] to-transparent pt-10 pb-6 px-8">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-3">
          <div className="w-full relative flex items-center bg-white border border-gray-200 rounded-xl shadow-sm px-4 py-3 focus-within:border-[#0052cc] focus-within:ring-1 focus-within:ring-[#0052cc] transition-all">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="프리미엄 무선 이어폰 Pro에 대해 무엇이든 물어보세요..."
              className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400 text-[15px]"
              disabled={isLoading}
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim() || !chatId}
              className="p-1.5 text-gray-400 hover:text-[#0052cc] disabled:opacity-50 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-400">
            AI는 실수를 할 수 있습니다. 중요한 정보는 직접 확인하세요.
          </p>
        </div>
      </div>
    </div>
  );
}
