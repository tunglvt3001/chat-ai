import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import styles from './ChatMessage.module.scss';


interface ChatMessageProps {
  text: string;
  isUser: boolean;
  isDarkMode: boolean;
}

export function ChatMessage({ text, isUser,isDarkMode }: ChatMessageProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 3000); // Reset after 3 seconds
    });
  };

  return (
    <div className={`${styles.message} ${isUser ? styles.user : styles.ai} ${isDarkMode ? styles.darkMode : ''}`}>
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const code = String(children).replace(/\n$/, '');
            return !inline && match ? (
              <div className={styles.codeBlock}>
                <div className={styles.codeHeader}>
                  <span className={styles.language}>{match[1]}</span>
                  <button 
                    className={styles.copyButton}
                    onClick={() => copyToClipboard(code)}
                  >
                    {copiedCode === code ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {code}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}