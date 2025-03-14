import { useState, useEffect, useCallback } from 'react';
import { IProps } from './Chat';

const TextToSpeech = ({ transcript: text, lastMessage }: IProps & { lastMessage: string }) => {
    const [speechInput, setSpeechInput] = useState('');
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const speakText = useCallback((text: string) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }
            utterance.lang = selectedVoice?.lang ?? 'en-US'; // Default language if no voice selected
            utterance.pitch = 1;
            utterance.rate = 1;

            utterance.onstart = () => {
                setIsSpeaking(true);  // Set state to true when speech starts
            };

            utterance.onend = () => {
                setIsSpeaking(false); // Set state to false when speech ends
            };

            window.speechSynthesis.speak(utterance);
        } else {
            alert('Text-to-Speech is not supported in this browser.');
        }
    }, [selectedVoice]);

    const stopSpeaking = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Stop the current speech
            setIsSpeaking(false); // Update state to reflect that speech has been stopped
        }
    };

    useEffect(() => {
        speakText(lastMessage);
    }, [lastMessage, speakText]);

    return (
        <div>
            {!isSpeaking ? <button onClick={() => speakText(text)} disabled={isSpeaking}>
                Speak
            </button> :
                <button onClick={stopSpeaking} disabled={!isSpeaking}>
                    Stop
                </button>}
        </div>
    );
};

export default TextToSpeech;
