import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { IProps } from './Chat';
import Recording from '@/assets/images/Recording.png'
import Record from '@/assets/images/Record-light.png'

const SpeechToText = ({ transcript, setTranscript, handleLogic }: IProps) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null); // Use SpeechRecognition type
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const [tempValue, setTempValue] = useState('');


  useEffect(()=>{
    if(tempValue === transcript){
      handleLogic(); // Trigger handleSubmit logic in the parent component
    }
  },[handleLogic, tempValue, transcript])

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          interimTranscript += result[0].transcript;
        }
        setTranscript(interimTranscript); // Update the transcript immediately while speaking

        // Clear the previous debounce timer whenever there is new speech input
        if (debounceTimer.current) {
          clearTimeout(debounceTimer.current);
        }

        // Set a new debounce timer to stop the recognition after 1 second of silence
        debounceTimer.current = setTimeout(() => {
          recognition.stop(); // Stop recognition after 1 second of silence
          setTempValue(interimTranscript);
        }, 1000); // 1 second debounce
      };

      recognition.onerror = (event: any) => {
        console.error('Speech Recognition error', event);
      };

      // Save the recognition object in the useRef
      recognitionRef.current = recognition;
    } else {
      alert('Speech Recognition is not supported in this browser.');
    }
  }, [handleLogic, setTranscript]);

  const startListening = () => {
    recognitionRef.current?.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    handleLogic();
  };

  return (
    <>
      {!isListening ? (
          <Image
              width='40'
              height='40'
              alt='record'
              onClick={startListening}
              src={Record}
            />
        ) : (
            <Image
              width='40'
              height='40'
              onClick={stopListening}
              alt='stop-record'
              src={Recording}
          />
      )}
    </>
  );
};

export default SpeechToText;
