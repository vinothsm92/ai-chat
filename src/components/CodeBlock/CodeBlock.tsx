"use client";
import { Message, useChat } from "ai/react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'; 
import { Dispatch, memo, SetStateAction } from "react";

// Component Interface
export interface IProps {
  transcript: string;
  setTranscript: Dispatch<SetStateAction<string>>;
  handleLogic: () => void;
  message?: Message[];
}

const customStyle: any = {
  hljs: {
    background: '#1e1e1e', // VS Code background color (dark gray)
    color: '#d4d4d4', // VS Code text color (light gray)
  },
  'pre[class*="language-"]': {
    background: '#1e1e1e', // Keep the code block background consistent
    color: '#d4d4d4', // Light text for code
    padding: '10px', // Some padding for comfort
    borderRadius: '5px', // Rounded corners for the code block
    overflowX: 'auto', // Allow horizontal scrolling if needed
    whiteSpace: 'pre', // Prevent line wrapping
    wordWrap: 'normal', // Disable word wrapping, long lines should overflow
    width: '100%',  // Ensure the full width of the code block
    maxWidth: '100%', // Ensure the max width fits the container
    display: 'block', // Block display for correct overflow behavior
  },
  'keyword': {
    color: '#c586c0', // Purple for keywords like 'const', 'let', 'import', etc.
    fontWeight: 'bold',
  },
  'string': {
    color: '#ce9178', // Light brown/orange for strings
  },
  'number': {
    color: '#b5cea8', // Greenish for numbers
  },
  'function': {
    color: '#569cd6', // Blue for function names
  },
  'variable': {
    color: '#9cdcfe', // Light cyan/blue for variables
  },
  'operator': {
    color: '#d4d4d4', // Light gray for operators (e.g., +, -, =)
  },
  'comment': {
    color: '#6a9955', // Dark green for comments
    fontStyle: 'italic',
  },
  'class': {
    color: '#4ec9b0', // Teal for classes
  },
  'tag': {
    color: '#569cd6', // Blue for tags (like 'import', 'export')
  },
  'punctuation': {
    color: '#d4d4d4', // Light gray for punctuation (e.g., commas, periods)
  },
  'parameter': {
    color: '#9cdcfe', // Light blue for parameters in functions
  },
  'file': {
    color: '#d7ba7d', // Light yellow-brown for file paths
  },
  'constant': {
    color: '#ce9178', // Light brown/orange for constants
  },
};

// Custom renderer for code blocks
const CodeBlock = ({ language, value }: { language: string; value: string }) => {
  return (
    <div className="flex flex-col gap-2">
      {/* Display the language name */}
      <div className="text-sm text-white font-medium bg-red-600 p-2 rounded-md">
        {language?.toUpperCase()}
      </div>

      {/* Render the actual code block */}
      <div 
        style={{
          maxWidth: '100%', // Ensure it fits within the parent container
          overflowX: 'auto', // Enable horizontal scrolling
          padding: '5px',
          boxSizing: 'border-box', // Ensures padding is included in the width/height calculation
          width: '100%', // Ensure the width is set to 100%
          margin: '0 auto', // Center the code block if needed
          display: 'flex',
          justifyContent: 'flex-start', // Ensure content starts from the left side
        }}
      >
        <SyntaxHighlighter language={language || 'javascript'} style={customStyle}>
          {value}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default memo(CodeBlock);
