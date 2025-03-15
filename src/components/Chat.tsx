"use client";
import { Message, useChat } from "ai/react";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'; // Syntax Highlighter
import useChatScroll from "@/hooks/useChatScroll";
import SpeechToText from "./SpeechToText";
import TextToSpeech from "./TextToSpeech";
import { Dispatch, SetStateAction, useMemo } from "react";
import useDebounce from "@/hooks/useDebounce";
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { ReactNode } from "react"; // Import ReactNode to type children
import CodeBlock from "./CodeBlock/CodeBlock";

// Component Interface
export interface IProps {
  transcript: string;
  setTranscript: Dispatch<SetStateAction<string>>;
  handleLogic: () => void;
  message?: Message[];
}

const customStyle = {
  ...dracula, // Keep all the existing styles from Dracula theme
  hljs: {
    ...dracula.hljs,
    background: 'black', // Custom background color (dark grey in this example)
    color: 'white', // text color
  },
  'pre[class*="language-"]': {
    ...dracula['pre[class*="language-"]'],
    background: 'black', // Keep code block background black
  },
};

export default function Chat() {
  const { messages, input: transcript, setInput: setTranscript, handleInputChange, isLoading, handleSubmit, stop } = useChat();
  const chatRef = useChatScroll(messages);

  const handleLogic = () => {
    console.log('Triggered handleLogic in parent');
    handleSubmit();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleLogic();
    }
  };

  const props = { transcript, setTranscript, handleLogic, messages };

  const renderMessages = useMemo(() => {
    if (messages.length % 2 === 0) {
      const getLastMessage = messages[messages.length - 1]?.content;
      return getLastMessage;
    }
    return '';
  }, [messages]);

  const lastMessage = useDebounce(renderMessages, 1000);

  // Define components for react-markdown with custom code block handling
  const renderers:any = {
    code: ({ inline, className, children }: { inline: boolean; className: string; children: ReactNode }) => {
      const language = className?.replace('language-', '');
      const value = String(children).replace(/\n$/, '');
      if (inline) {
        return <code>{children}</code>;
      } else {
        return <CodeBlock language={language} value={value} />;
      }
    },
    // Custom renderers for lists
    ul: ({ children }: { children: ReactNode }) => {
      return <ul className="pl-4 list-disc">{children}</ul>;
    },
    ol: ({ children }: { children: ReactNode }) => {
      return <ol className="pl-4 list-decimal">{children}</ol>;
    },
    li: ({ children }: { children: ReactNode }) => {
      return <li className="mb-2">{children}</li>;
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start">
    <div className="flex flex-col w-full max-w-lg rounded-lg bg-white/10 h-full">
      {/* Chat Messages Container with Scroll */}
      <div className="flex-1 overflow-y-auto p-4" ref={chatRef}>
        <div className="flex flex-col gap-2">
          {messages.length ? (
            messages.map((m, i) => (
              m.role === 'user' ? (
                <div key={i} className="w-full flex flex-col gap-2 items-end">
                  <span className="px-2">You</span>
                  <div className="flex flex-col items-center px-4 py-2 max-w-[90%] bg-orange-700/50 rounded-lg text-neutral-200 whitespace-pre-wrap">
                    {/* Apply background color for regular text/explanation */}
                    <Markdown components={renderers}>{m?.content}</Markdown>
                  </div>
                </div>
              ) : (
                <div key={i} className="w-full flex flex-col gap-2 items-start">
                  <span className="px-2">AI</span>
                  <div className="flex flex-col max-w-[90%] px-4 py-2 bg-[#1a1a1a] rounded-lg text-neutral-200 whitespace-pre-wrap">
                    {/* Apply background color for regular text/explanation */}
                    <Markdown components={renderers}>{m?.content}</Markdown>
                  </div>
                </div>
              )
            ))
          ) : (
            <div className="text-center flex-1 flex items-center justify-center text-neutral-500 text-4xl">
              <h1>Local AI Chat</h1>
            </div>
          )}
        </div>
      </div>

      {/* Input and Button Container */}
      <form onSubmit={handleSubmit} className="w-full px-3 py-2">
        <div className="relative w-full">
          <textarea
            value={transcript}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            className="w-full px-3 py-2 pb-10 border border-gray-700 bg-transparent rounded-lg text-neutral-200"
            placeholder="Enter your text here..."
          ></textarea>

          <div className="absolute bottom-3 right-3 flex items-center space-x-2">
            {isLoading && (
              <button
                type="button"
                onClick={stop}
                className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
              >
                Stop
              </button>
            )}
            <SpeechToText {...props} />
          </div>
        </div>
      </form>

      {/* Text to Speech */}
      <section>
        <TextToSpeech {...props} lastMessage={lastMessage} />
      </section>
    </div>
    </main>
  );
}
