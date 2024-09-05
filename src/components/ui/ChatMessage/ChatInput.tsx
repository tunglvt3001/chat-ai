import { useState, KeyboardEvent } from 'react';
import styles from './ChatInput.module.scss';

interface ChatInputProps {
    onSendMessage: (message: string) => void;
    disabled?: boolean;
    isDarkMode: boolean;
  }
  
export function ChatInput({ onSendMessage, disabled,isDarkMode }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className={`${styles.inputContainer} ${isDarkMode ? styles.darkMode : ''}`} onSubmit={handleSubmit}>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message here... (Shift + Enter for new line)"
        className={styles.input}
        disabled={disabled}
        rows={3}
      />
      <button type="submit" className={styles.sendButton} disabled={disabled}>
        Send
      </button>
    </form>
  );
}