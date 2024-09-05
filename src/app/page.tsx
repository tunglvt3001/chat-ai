'use client'
import { useEffect, useState } from 'react';
import styles from "./page.module.scss";
import { ChatMessage } from "../components/ui/ChatMessage/ChatMessage";
import { ChatInput } from "../components/ui/ChatMessage/ChatInput";
import { getGeminiResponse } from "../api/chatgpt.service";
import Link from 'next/link';

interface Message {
  text: string;
  isUser: boolean;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Load chat history from local storage
    const storedMessages = localStorage.getItem('chatHistory');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }

    // Load dark mode preference
    const storedDarkMode = localStorage.getItem('darkMode');
    setIsDarkMode(storedDarkMode === 'true');
  }, []);

  useEffect(() => {
    // Save chat history to local storage
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    // Save dark mode preference
    localStorage.setItem('darkMode', isDarkMode.toString());
    // Apply dark mode class to body
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  const handleSendMessage = async (message: string) => {
    setMessages(prev => [...prev, { text: message, isUser: true }]);
    setIsLoading(true);

    try {
      const response = await getGeminiResponse(message);
      setMessages(prev => [...prev, { text: response, isUser: false }]);
    } catch (error) {
      console.error('Error getting ChatGPT response:', error);
      setMessages(prev => [...prev, { text: "Sorry, I couldn't process your request.", isUser: false }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem('chatHistory');
  };

  return (
    <main className={`${styles.main} ${isDarkMode ? styles.darkMode : ''}`}>
      <header className={styles.header}>
        <h1>AI Chat Assistant</h1>
        <p>Ask me anything! I can handle markdown and code snippets.</p>
        <div className={styles.controls}>
          <button onClick={toggleDarkMode} className={styles.modeToggle}>
            {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          <button onClick={clearHistory} className={styles.clearHistory}>
            🗑️ Clear History
          </button>
          <Link href="/heart3d" className={styles.heart3dLink}>
            💖 3D Heart
          </Link>
        </div>
      </header>

      <div className={styles.chatContainer}>
        {messages.map((message, index) => (
          <ChatMessage key={index} text={message.text} isUser={message.isUser} isDarkMode={isDarkMode} />
        ))}
        {isLoading && <div className={styles.loading}>AI is thinking...</div>}
      </div>

      <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} isDarkMode={isDarkMode} />

      <footer className={styles.footer}>
        <p>&copy; 2024 AI Chat Assistant. All rights reserved.</p>
      </footer>
    </main>
  );
}