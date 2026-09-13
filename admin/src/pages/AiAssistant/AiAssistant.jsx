import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, ArrowRight, Building, Award, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader.jsx';
import Button from '../../components/common/Button.jsx';
import aiService from '../../services/aiService.js';

export function AiAssistant() {
  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      sender: 'bot',
      text: "Hello Siddhartha! I am the Sahara Real Estate AI Assistant. Ask me about properties in New Town or Salt Lake, agent revenue leaderboards, overdue follow-up tasks, or pending payment collections.",
      timestamp: 'Just now'
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedQueries = [
    'Show me all 3 BHK properties in New Town under ₹1 Cr.',
    'Which agents generated the most revenue this month?',
    'Which leads have overdue follow-ups?',
    'Show available commercial properties in Sector V.',
    'Which bookings have pending payments?'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendQuery = async (queryText) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await aiService.processQuery(textToSend);
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.message,
        payload: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'bot',
          text: "I encountered an issue processing your query. Please try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <PageHeader
        title="Sahara AI Real Estate Intelligence"
        subtitle="Conversational assistant with instant access to active Kolkata inventory, broker metrics, and financial milestones"
        breadcrumbs={[{ label: 'General' }, { label: 'AI Assistant' }]}
      />

      {/* Suggested Query Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-print shrink-0">
        <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Suggestions:
        </span>
        {suggestedQueries.map((q, i) => (
          <button
            key={i}
            onClick={() => handleSendQuery(q)}
            className="text-xs px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 whitespace-nowrap transition-colors shadow-2xs cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Window */}
      <div className="flex-1 overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xs space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-xs'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed space-y-3 ${
                msg.sender === 'user'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
              }`}
            >
              <div className="whitespace-pre-wrap font-medium">
                {msg.text}
              </div>

              {/* Rich Response Payload Cards */}
              {msg.payload?.type === 'properties' && msg.payload.items && (
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  {msg.payload.items.map((prop, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white text-xs block">
                          {prop.title}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {prop.location}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-extrabold text-amber-600 dark:text-amber-400 text-xs block">
                          {prop.price}
                        </span>
                        <Link
                          to={prop.link}
                          className="text-[10px] font-bold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-0.5"
                        >
                          View Listing <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {msg.payload?.type === 'brokers' && msg.payload.items && (
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  {msg.payload.items.map((b, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white text-xs block">
                          {b.name} ({b.role})
                        </span>
                        <span className="text-[10px] text-slate-400">{b.specialization}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-extrabold text-emerald-600 text-xs block">{b.revenue}</span>
                        <span className="text-[10px] text-slate-400">{b.deals}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {msg.payload?.type === 'followUps' && msg.payload.items && (
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  {msg.payload.items.map((f, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div>
                        <span className="font-bold text-rose-900 dark:text-rose-200 text-xs block">
                          {f.title}
                        </span>
                        <span className="text-[10px] text-rose-700/80 dark:text-rose-300">
                          Due: {f.dueDate} • Assigned: {f.assignedTo}
                        </span>
                      </div>
                      <Link
                        to={f.link}
                        className="text-[10px] font-bold text-rose-700 dark:text-rose-300 hover:underline shrink-0"
                      >
                        Action Now →
                      </Link>
                    </div>
                  ))}
                </div>
              )}

              {msg.payload?.type === 'payments' && msg.payload.items && (
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  {msg.payload.items.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white text-xs block">
                          {p.client}
                        </span>
                        <span className="text-[10px] text-slate-400">Due: {p.dueDate}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-extrabold text-rose-600 dark:text-rose-400 text-xs block">
                          {p.amount}
                        </span>
                        <span className="text-[10px] font-semibold text-rose-500 uppercase">{p.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <span className="text-[10px] opacity-60 block text-right">
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 pl-11">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            Analyzing Sahara ERP records...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSendQuery();
        }}
        className="relative flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          placeholder="Ask Sahara AI anything (e.g. 'Show 3 BHK in New Town under ₹1 Cr')..."
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 pl-4 pr-12 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
        />
        <Button
          type="submit"
          variant="primary"
          icon={Send}
          disabled={!input.trim() || isLoading}
          className="absolute right-1.5 px-3 py-2 rounded-xl"
        >
          <span className="hidden sm:inline">Ask</span>
        </Button>
      </form>
    </div>
  );
}

export default AiAssistant;
