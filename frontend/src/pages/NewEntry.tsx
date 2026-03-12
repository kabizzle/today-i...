import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Save, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const NewEntry = () => {
  const [content, setContent] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the browser supports SpeechRecognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        // Append final transcript when dictating, ignore interim for cleaner text area update
        if (finalTranscript) {
          setContent((prev) => prev + (prev.endsWith(' ') || prev === '' ? '' : ' ') + finalTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      console.warn("Speech Recognition API not supported in this browser.");
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!content.trim()) return;
    
    setIsSaving(true);
    try {
      // Post the actual entry without explicit auth (backend handles via mock user)
      await api.post('/entries/', { content });
      
      navigate('/');
    } catch (error) {
      console.error('Failed to save entry:', error);
      alert('Failed to save entry. Check console or make sure backend is running.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-base-content tracking-tight">Today I...</h1>
        <p className="text-base-content/70 mt-2 text-lg">Speak or write down what you learned and accomplished today.</p>
      </header>

      <div className="card bg-base-100 shadow-xl border border-base-200">
        <div className="card-body">
          <div className="form-control w-full relative">
            <textarea 
              className="textarea textarea-bordered h-64 text-lg p-6 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none z-10 bg-transparent leading-relaxed" 
              placeholder="What did you tackle today? What problems did you solve?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>

            {isListening && (
              <div className="absolute inset-x-0 bottom-4 flex justify-center z-0 animate-pulse pointer-events-none">
                <div className="bg-error/10 text-error px-4 py-2 rounded-full font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
                  Listening...
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
            <div className="flex gap-3">
              <button 
                onClick={toggleListening}
                className={`btn btn-circle btn-lg ${isListening ? 'btn-error animate-pulse shadow-error/30' : 'btn-primary bg-primary/20 text-primary border-transparent hover:bg-primary hover:text-primary-content'} shadow-lg transition-all`}
                title={isListening ? "Stop Dictation" : "Start Dictation"}
              >
                {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>
              {content.length > 0 && (
                <button 
                  onClick={() => setContent('')}
                  className="btn btn-circle btn-ghost text-base-content/50 hover:text-error"
                  title="Clear Text"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              )}
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              <button onClick={() => navigate('/')} className="btn btn-ghost" disabled={isSaving}>Cancel</button>
              <button 
                onClick={handleSave} 
                className="btn btn-primary flex-1 sm:flex-none shadow-lg shadow-primary/30"
                disabled={content.trim().length === 0 || isSaving}
              >
                {isSaving ? <span className="loading loading-spinner loading-sm"></span> : <Save className="w-5 h-5 mr-1" />}
                {isSaving ? "Analyzing..." : "Save & Analyze"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewEntry;
