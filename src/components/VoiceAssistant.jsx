import React, { useState, useEffect, useRef } from 'react';
import { X, MessageCircle, Mic, MicOff, Volume2 } from 'lucide-react';

export const VoiceAssistant = ({ data, alerts = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: 'Namaste! I am Jal-Mitra. Ask me about pump status, tank levels, or alerts.',
    },
  ]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleVoiceInput = () => {
    if (isListening) return;
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      const queries = [
        'What is the current pump status?',
        'Is the water safe to drink?',
        'Check tank level',
        'Any active alerts?',
      ];
      const randomQuery = queries[Math.floor(Math.random() * queries.length)];
      handleUserQuery(randomQuery);
    }, 2000);
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleUserQuery = (query) => {
    setMessages((prev) => [...prev, { type: 'user', text: query }]);
    let response = "I didn't quite get that.";

    if (query.toLowerCase().includes('pump')) {
      response = `The pump is currently ${data.pumpStatus}. Flow rate is ${data.pumpFlowRate.toFixed(0)} liters per minute.`;
    } else if (query.toLowerCase().includes('tank')) {
      response = `Tank level is at ${data.tankLevel.toFixed(0)}%.`;
    } else if (query.toLowerCase().includes('safe') || query.toLowerCase().includes('quality')) {
      const safe = data.qualityPH >= 6.5 && data.qualityPH <= 8.5;
      response = `Water quality is ${safe ? 'Safe' : 'Unsafe'}. pH is ${data.qualityPH.toFixed(1)}.`;
    } else if (query.toLowerCase().includes('alert')) {
      response =
        alerts.length > 0 ? `There are ${alerts.length} active alerts.` : 'No critical alerts.';
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { type: 'bot', text: response }]);
      speak(response);
    }, 800);
  };

  return (
    <>
      {/* Simple Floating Voice Assistant Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[3000] w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
        aria-label="Voice Assistant"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-4 left-4 md:bottom-24 md:right-6 md:left-auto md:w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 z-[3000] flex flex-col overflow-hidden animate-in slide-in-from-bottom-10">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Mic size={16} />
              <span className="font-bold">Jal-Mitra AI</span>
            </div>
            <Volume2 size={18} className="opacity-70" />
          </div>

          {/* Status indicator */}
          {(isListening || isSpeaking) && (
            <div className="flex items-center justify-center p-4 bg-blue-50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                <span className="text-sm text-blue-600 font-medium">
                  {isListening ? 'Listening...' : 'Speaking...'}
                </span>
              </div>
            </div>
          )}

          <div className="flex-1 h-64 md:h-80 p-3 md:p-4 overflow-y-auto space-y-3 bg-slate-50">
            {messages.map((msg, idx) => {
              const isUser = msg.type === 'user';
              return (
                <div
                  key={idx}
                  className={isUser ? 'flex justify-end' : 'flex justify-start'}
                >
                  <div
                    className={
                      isUser
                        ? 'max-w-[80%] p-3 rounded-xl text-sm bg-emerald-600 text-white rounded-tr-none'
                        : 'max-w-[80%] p-3 rounded-xl text-sm bg-white border border-gray-200 text-gray-700 rounded-tl-none shadow-sm'
                    }
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
            {isListening && (
              <div className="flex justify-end">
                <div className="bg-emerald-100 text-emerald-700 text-xs px-3 py-1 rounded-full animate-pulse">
                  Listening...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 md:p-4 bg-white border-t border-gray-100">
            <button
              onClick={handleVoiceInput}
              className={
                isListening
                  ? 'w-full py-2.5 md:py-3 rounded-xl text-sm md:text-base font-bold flex items-center justify-center gap-2 transition-all bg-red-100 text-red-600'
                  : 'w-full py-2.5 md:py-3 rounded-xl text-sm md:text-base font-bold flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
              }
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              {isListening ? 'Stop Listening' : 'Tap to Speak'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
