import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage } from '../types';
import { getGeminiResponse } from '../lib/gemini';
import { cn } from '../lib/utils';

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: 'Olá! Sou seu assistente técnico. Como posso ajudar com sua entrega hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    const response = await getGeminiResponse(newMessages);
    setMessages([...newMessages, { role: 'model', content: response }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 w-[350px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col border border-slate-100 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary p-4 text-white flex justify-between items-center group">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-bold">Assistente Técnico</h3>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                    <span className="text-[10px] text-blue-100 uppercase tracking-wider font-semibold">Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/10 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-app-bg"
            >
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "flex flex-col max-w-[85%] animate-in fade-in slide-in-from-bottom-2",
                    msg.role === 'user' ? "ml-auto" : "mr-auto"
                  )}
                >
                  <div className={cn(
                    "p-3 rounded-[12px] text-sm",
                    msg.role === 'user' 
                      ? "bg-primary text-white rounded-tr-none" 
                      : "bg-white text-app-text shadow-sm border border-app-border rounded-tl-none"
                  )}>
                    {msg.content}
                  </div>
                  <span className={cn(
                    "text-[10px] text-app-secondary mt-1 font-medium px-1",
                    msg.role === 'user' ? "text-right" : "text-left"
                  )}>
                    {msg.role === 'user' ? <div className="flex items-center gap-1 justify-end"><User size={10}/> Você</div> : <div className="flex items-center gap-1"><Bot size={10}/> Assistente</div>}
                  </span>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2 p-3 bg-white border border-app-border rounded-[12px] rounded-tl-none w-fit shadow-sm">
                  <span className="w-1.5 h-1.5 bg-app-border rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-app-border rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-app-border rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-app-border">
              <div className="flex gap-2 bg-app-bg p-2 rounded-[8px] focus-within:ring-2 focus-within:ring-primary/10 transition-all border border-app-border">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Digite sua dúvida..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-1 px-2 text-app-text"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="bg-primary text-white p-2 rounded-[8px] hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-primary transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary text-white w-14 h-14 rounded-full shadow-lg shadow-primary/20 flex items-center justify-center hover:bg-blue-700 active:scale-95 transition-all group"
      >
        <MessageSquare className="group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
};
