
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { ChatMessage } from '../types';
import { SendIcon } from './icons/SendIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  history: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  selectedItemImage: string | null;
}

export const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose, history, onSendMessage, isLoading, selectedItemImage }) => {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, isLoading]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-20">
      <div className="w-[calc(100vw-3rem)] sm:w-96 h-[60vh] sm:h-[32rem] bg-white dark:bg-gray-800 rounded-xl shadow-2xl flex flex-col transition-transform duration-300 transform origin-bottom-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-pink-500" />
            {t('chat.title')}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">&times;</button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          {selectedItemImage && (
            <div className="mb-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
              <img src={selectedItemImage} alt="Selected item" className="w-10 h-10 rounded-md object-cover" />
              <span>{t('chat.askingAbout')}</span>
            </div>
          )}
          {history.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
              <div className={`max-w-xs lg:max-w-sm px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200'}`}>
                <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }}></p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start mb-3">
              <div className="max-w-xs lg:max-w-sm px-4 py-2 rounded-2xl bg-gray-200 dark:bg-gray-600 text-gray-800">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('chat.placeholder')}
              className="flex-1 w-full px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 dark:text-gray-200 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2 text-white bg-pink-500 rounded-full hover:bg-pink-600 disabled:bg-pink-300 disabled:cursor-not-allowed transition-colors"
              aria-label="Send"
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
