import { useState, useEffect, useRef } from 'react';
import { BookOpen, CheckCircle, Brain, Target, Mic, MicOff, XCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Assessment = () => {
    const [explanation, setExplanation] = useState('');
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);
    const [step, setStep] = useState(1);
    const navigate = useNavigate();
    const location = useLocation();

    // Read skill from navigation state, or fallback if accessed directly
    const skill = location.state?.skill || {
        name: "React Hooks",
        description: "State management and lifecycle features in functional components",
        degradation_level: 65
    };
    
    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onresult = (event: any) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }
                if (finalTranscript) {
                    setExplanation((prev) => prev + (prev.endsWith(' ') || prev === '' ? '' : ' ') + finalTranscript);
                }
            };

            recognition.onerror = () => setIsListening(false);
            recognition.onend = () => setIsListening(false);
            recognitionRef.current = recognition;
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

    const handleSubmit = () => {
        // Mock submitting the explanation for AI evaluation
        console.log("Submitting explanation:", explanation);
        setStep(2);
    };

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <header className="text-center mb-10">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                    <Brain className="w-10 h-10" />
                </div>
                <h1 className="text-4xl font-extrabold text-base-content tracking-tight">Skill Assessment</h1>
                <p className="text-base-content/70 mt-2 text-lg">Use the Feynman Technique to reinforce your knowledge.</p>
            </header>

            {step === 1 ? (
                <div className="card bg-base-100 shadow-xl border border-base-200">
                    <div className="card-body">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="bg-warning/20 p-3 rounded-xl text-warning">
                                <Target className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-base-content/50 uppercase tracking-wider mb-1">Target Skill</h2>
                                <h3 className="text-2xl font-bold text-base-content">{skill.name}</h3>
                                <p className="text-base-content/70 mt-1">{skill.description}</p>
                            </div>
                        </div>

                        <div className="bg-base-200 p-6 rounded-2xl mb-6 border border-base-300">
                            <h4 className="font-bold flex items-center gap-2 mb-2">
                                <BookOpen className="w-5 h-5 text-primary" />
                                Your Task
                            </h4>
                            <p className="text-base-content/80">
                                Explain <strong>{skill.name}</strong> as simply as you can. Imagine you are teaching someone who has basic programming knowledge but has never used this specific concept before. What is it, why is it useful, and how does it work?
                            </p>
                        </div>

                        <div className="form-control w-full relative">
                            <textarea 
                                className="textarea textarea-bordered h-48 text-lg p-4 focus:outline-none focus:border-primary transition-all resize-none relative z-10 bg-transparent" 
                                placeholder="Start teaching here..."
                                value={explanation}
                                onChange={(e) => setExplanation(e.target.value)}
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
                                    className={`btn btn-circle ${isListening ? 'btn-error animate-pulse shadow-error/30' : 'btn-primary bg-primary/10 text-primary border-transparent hover:bg-primary hover:text-primary-content'} shadow-sm transition-all`}
                                    title={isListening ? "Stop Dictation" : "Start Dictation"}
                                >
                                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                                </button>
                                {explanation.length > 0 && (
                                    <button 
                                        onClick={() => setExplanation('')}
                                        className="btn btn-circle btn-ghost text-base-content/50 hover:text-error"
                                        title="Clear Text"
                                    >
                                        <XCircle className="w-5 h-5" />
                                    </button>
                                )}
                            </div>

                            <div className="flex gap-3 w-full sm:w-auto">
                                <button onClick={() => navigate('/')} className="btn btn-ghost">Skip for Now</button>
                                <button 
                                    onClick={handleSubmit} 
                                    className="btn btn-primary"
                                    disabled={explanation.length < 50}
                                >
                                    Submit Explanation
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="card bg-base-100 shadow-md border border-base-200 animate-in zoom-in-95 duration-300">
                    <div className="card-body items-center text-center p-12">
                        <CheckCircle className="w-20 h-20 text-success mb-6" />
                        <h2 className="text-3xl font-bold mb-4">Great Explanation!</h2>
                        <p className="text-base-content/80 text-lg mb-8 max-w-lg">
                            Your conceptual understanding of <strong>{skill.name}</strong> is solid.
                            We've refreshed this skill in your profile back to 100% retention.
                        </p>
                        <button onClick={() => navigate('/')} className="btn btn-primary btn-wide">
                            Return to Dashboard
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Assessment;
