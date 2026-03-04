
import React, { useState, useRef, useEffect } from 'react';
import { askNGOAssistant } from '../services/geminiService';
import { apiService } from '../services/apiService';

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

type CollectionStep = 'idle' | 'name' | 'email' | 'amount' | 'program' | 'done';

const NGOAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'ai', text: 'Hello! I am the Giving Without Limit Assistant. How can I help you today? You can ask about our mission, programs, or how to donate.' }
  ]);
  const [loading, setLoading] = useState(false);

  // Lead Collection State
  const [step, setStep] = useState<CollectionStep>('idle');
  const [leadType, setLeadType] = useState<'donation' | 'volunteer' | null>(null);
  const [leadData, setLeadData] = useState({
    full_name: '',
    email: '',
    amount: '',
    program_info: ''
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (role: 'user' | 'ai', text: string) => {
    setMessages(prev => [...prev, { role, text }]);
  };

  const handleSend = async () => {
    if (!query.trim()) return;

    const userMsg = query;
    setQuery('');
    addMessage('user', userMsg);

    // Handle Collection Flow
    if (step !== 'idle' && step !== 'done') {
      processCollection(userMsg);
      return;
    }

    // Detect Initial Intent
    const lowerMsg = userMsg.toLowerCase();
    if (lowerMsg.includes('donate') || lowerMsg.includes('donation') || lowerMsg.includes('give')) {
      setLeadType('donation');
      setStep('name');
      addMessage('ai', 'I would be honored to help you with that. May I have your full name, please?');
      return;
    }

    if (lowerMsg.includes('volunteer') || lowerMsg.includes('join') || lowerMsg.includes('help')) {
      setLeadType('volunteer');
      setStep('name');
      addMessage('ai', 'That is wonderful! We are always looking for willing hearts. What is your full name, please?');
      return;
    }

    // Default AI Response
    setLoading(true);
    try {
      const response = await askNGOAssistant(userMsg);
      addMessage('ai', response);
    } catch (error) {
      addMessage('ai', 'I am sorry, I am having trouble connecting right now. Please email us at bisowilly@yahoo.com.');
    } finally {
      setLoading(false);
    }
  };

  const processCollection = async (msg: string) => {
    switch (step) {
      case 'name':
        setLeadData(prev => ({ ...prev, full_name: msg }));
        setStep('email');
        addMessage('ai', `Thank you, ${msg.split(' ')[0]}! And what is your best email address to reach you at?`);
        break;
      case 'email':
        setLeadData(prev => ({ ...prev, email: msg }));
        if (leadType === 'donation') {
          setStep('amount');
          addMessage('ai', 'Perfect. How much would you like to contribute today? (e.g. $50, $100)');
        } else {
          setStep('program');
          addMessage('ai', 'Great! Which of our programs interests you most? (Feeding, Education, Widows, etc.)');
        }
        break;
      case 'amount':
        const finalDataDonation = { ...leadData, amount: msg, type: 'donation' };
        setLeadData(finalDataDonation);
        setStep('done');
        completeSubmission(finalDataDonation);
        break;
      case 'program':
        const finalDataVolunteer = { ...leadData, program_info: msg, type: 'volunteer' };
        setLeadData(finalDataVolunteer);
        setStep('done');
        completeSubmission(finalDataVolunteer);
        break;
    }
  };

  const completeSubmission = async (data: any) => {
    setLoading(true);
    try {
      await apiService.submitAILead(data);
      addMessage('ai', 'I have received your details! I am notifying our founder and admin right now. They will reach out to you shortly. \n\nYou can also contact us directly at 312-479-3840. God bless you!');
    } catch (error) {
      addMessage('ai', 'I saved your details, but had trouble sending the instant notification. Rest assured we have your request! God bless.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[60]">
      {isOpen ? (
        <div className="bg-white w-80 sm:w-96 h-[500px] rounded-[2.5rem] shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-count">
          <div className="bg-primary p-5 text-white flex justify-between items-center relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gold"></div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-gold text-2xl backdrop-blur-md">
                <i className="fas fa-robot"></i>
              </div>
              <div>
                <h3 className="font-black text-sm uppercase tracking-tighter">NGO Assistant</h3>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                  <p className="text-[9px] text-gray-300 uppercase font-black tracking-widest">Always Online</p>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-10 h-10 rounded-xl hover:bg-white/10 transition-colors">
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50 custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed ${msg.role === 'user'
                    ? 'bg-primary text-white rounded-tr-none shadow-lg'
                    : 'bg-white border border-gray-100 text-gray-700 shadow-sm rounded-tl-none font-medium'
                  }`}>
                  {msg.text.split('\n').map((line, j) => (
                    <p key={j} className={j > 0 ? 'mt-2' : ''}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 p-4 rounded-3xl rounded-tl-none flex space-x-1.5 shadow-sm">
                  <div className="w-2 h-2 bg-gold/40 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gold/60 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-gold/80 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-5 border-t border-gray-100 bg-white flex space-x-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={step === 'idle' ? "Ask me anything..." : "Reply here..."}
              className="flex-1 bg-gray-50 px-6 py-3 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 border border-gray-100 font-bold transition-all"
            />
            <button
              onClick={handleSend}
              disabled={loading || !query.trim()}
              className="bg-primary text-white w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-secondary disabled:opacity-50 transition-all shadow-xl active:scale-95"
            >
              <i className="fas fa-paper-plane text-lg"></i>
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary text-white w-20 h-20 rounded-[2.5rem] shadow-2xl flex items-center justify-center text-3xl hover:bg-secondary hover:scale-105 transition-all group relative border-4 border-white"
        >
          <div className="absolute -top-3 -right-3 bg-gold text-primary text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg border-2 border-white animate-bounce">
            MISSION CHAT
          </div>
          <i className="fas fa-comment-dots group-hover:rotate-12 transition-transform"></i>
        </button>
      )}
    </div>
  );
};

export default NGOAssistant;
