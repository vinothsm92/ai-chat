// components/TextToSpeech.tsx
import { useState, useEffect, useCallback } from 'react';
import { IProps } from './Chat';

const TextToSpeech = ({transcript: text, lastMessage}: IProps & {lastMessage: string}) => {
  const [, setText] = useState('');
  const [speechInput, setSpeechInput] = useState('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);


  const speakText = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(" how are you");
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      utterance.lang = selectedVoice?.lang ?? 'en-US'; // Default language if no voice selected
      utterance.pitch = 1;
      utterance.rate = 1;

      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-Speech is not supported in this browser.');
    }
  },[selectedVoice]);

  useEffect(()=>{
    speakText(lastMessage);
  },[lastMessage, speakText])

//   useEffect(() => {
//     const getVoices = () => {
//       if ('speechSynthesis' in window) {
//         const availableVoices = window.speechSynthesis.getVoices();
//         setVoices(availableVoices);
//         if (availableVoices.length > 0) {
//           setSelectedVoice(availableVoices[0]);
//         }
//       }
//     };

//     // Load voices when the page loads or when speechSynthesis voices change
//     getVoices();
//     window.speechSynthesis.onvoiceschanged = getVoices;
//   }, []);

//   const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const voice = voices.find((voice) => voice.name === e.target.value);
//     setSelectedVoice(voice || null);
//   };


  return (
    <div>
      <div>
        {/* <select onChange={handleVoiceChange} value={selectedVoice?.name}>
          {voices.map((voice) => (
            <option key={voice.name} value={voice.name}>
              {voice.name} ({voice.lang})
            </option>
          ))}
        </select> */}
      </div>
      <button onClick={()=> speakText(text)}>Speak</button>
    </div>
  );
};

export default TextToSpeech;