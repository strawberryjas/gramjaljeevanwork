import React, { useState, useEffect, useRef } from 'react';
import { X, MessageCircle, Mic, MicOff, Volume2 } from 'lucide-react';

export const VoiceAssistant = ({ data, alerts = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: "Namaste! I am Jal-Mitra. Ask me about pump status, tank levels, or alerts." }
  ]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleVoiceInput = () => {
    if (isListening) return;
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      const queries = [
        "What is the current pump status?",
        "Is the water safe to drink?",
        "Check tank level",
        "Any active alerts?"
      ];
      const randomQuery = queries[Math.floor(Math.random() * queries.length)];
      handleUserQuery(randomQuery);
    }, 2000);
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleUserQuery = (query) => {
    setMessages(prev => [...prev, { type: 'user', text: query }]);
    let response = "I didn't quite get that.";
    
    if (query.toLowerCase().includes("pump")) {
      response = `The pump is currently ${data.pumpStatus}. Flow rate is ${data.pumpFlowRate.toFixed(0)} liters per minute.`;
    } else if (query.toLowerCase().includes("tank")) {
      response = `Tank level is at ${data.tankLevel.toFixed(0)}%.`;
    } else if (query.toLowerCase().includes("safe") || query.toLowerCase().includes("quality")) {
      const safe = data.qualityPH >= 6.5 && data.qualityPH <= 8.5;
      response = `Water quality is ${safe ? "Safe" : "Unsafe"}. pH is ${data.qualityPH.toFixed(1)}.`;
    } else if (query.toLowerCase().includes("alert")) {
      response = alerts.length > 0 ? `There are ${alerts.length} active alerts.` : "No critical alerts.";
    }
    
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'bot', text: response }]);
      speak(response);
    }, 800);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="fixed bottom-6 right-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white p-4 rounded-full shadow-xl transition-all z-50 flex items-center gap-2"
      >
        {isOpen ? <X size={24}/> : <MessageCircle size={24}/>}
      </button>
      
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Mic size={16}/>
              <span className="font-bold">Jal-Mitra AI</span>
            </div>
            <Volume2 size={18} className="opacity-70"/>
          </div>
          
          <div className="flex-1 h-80 p-4 overflow-y-auto space-y-3 bg-slate-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-xl text-sm ${
                  msg.type === 'user' 
                    ? 'bg-emerald-600 text-white rounded-tr-none' 
                    : 'bg-white border border-gray-200 text-gray-700 rounded-tl-none shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isListening && (
              <div className="flex justify-end">
                <div className="bg-emerald-100 text-emerald-700 text-xs px-3 py-1 rounded-full animate-pulse">
                  Listening...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-4 bg-white border-t border-gray-100">
            <button 
              onClick={handleVoiceInput} 
              className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                isListening 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {isListening ? <MicOff size={20}/> : <Mic size={20}/>}
              {isListening ? 'Stop Listening' : 'Tap to Speak'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

