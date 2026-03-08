/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { submitResults } from "./submitResults";
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  PlayCircle, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  Trophy,
  Target,
  UserCheck,
  Zap,
  User,
  Home,
  Calendar
} from 'lucide-react';

// --- Types ---

type View = 'home' | 'signup' | 'video' | 'simulation' | 'results';

interface ScoreMap {
  [key: string]: number;
}

interface Question {
  id: number;
  text: string;
  options: {
    id: string;
    text: string;
    scores: ScoreMap;
  }[];
}

interface UserData {
  fullName: string;
  age: string;
  orphanageName: string;
}

// --- Constants ---

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "You arrive 15 minutes early for your interview. The interviewer is running late.",
    options: [
      { id: 'A', text: "Wait calmly and review your notes", scores: { 'Emotional Regulation': 2 } },
      { id: 'B', text: "Feel irritated and check your phone repeatedly", scores: { 'Emotional Regulation': -1 } },
      { id: 'C', text: "Ask the receptionist how much longer it will take", scores: { 'Confidence': 1 } }
    ]
  },
  {
    id: 2,
    text: "The interviewer asks a question you do not know.",
    options: [
      { id: 'A', text: "Guess confidently", scores: { 'Confidence': 1 } },
      { id: 'B', text: "Say you are unsure but explain how you would find the answer", scores: { 'Integrity': 2, 'Growth Mindset': 2 } },
      { id: 'C', text: "Freeze and say very little", scores: { 'Confidence': -1 } }
    ]
  },
  {
    id: 3,
    text: "Why should we hire you?",
    options: [
      { id: 'A', text: "Because I really need this job", scores: { 'Survival mindset': 1 } },
      { id: 'B', text: "Because I have skills and I am willing to learn and grow", scores: { 'Professional Positioning': 2 } },
      { id: 'C', text: "Because I will work harder than everyone else", scores: { 'Effort mindset': 1 } }
    ]
  },
  {
    id: 4,
    text: "Interviewer seems distracted.",
    options: [
      { id: 'A', text: "Shorten answers", scores: { 'Awareness': 1 } },
      { id: 'B', text: "Ask politely if they want more detail", scores: { 'Communication maturity': 2 } },
      { id: 'C', text: "Lose confidence", scores: { 'Emotional Regulation': -1 } }
    ]
  },
  {
    id: 5,
    text: "You make a speaking mistake.",
    options: [
      { id: 'A', text: "Continue confidently", scores: { 'Confidence': 1 } },
      { id: 'B', text: "Correct calmly and continue", scores: { 'Professional composure': 2 } },
      { id: 'C', text: "Apologise repeatedly", scores: { 'Confidence': -1 } }
    ]
  },
  {
    id: 6,
    text: "You oversleep and miss work.",
    options: [
      { id: 'A', text: "Ignore it", scores: { 'Responsibility': -1 } },
      { id: 'B', text: "Contact supervisor immediately", scores: { 'Accountability': 2, 'Integrity': 2 } },
      { id: 'C', text: "Lie about illness", scores: { 'Integrity': -2 } }
    ]
  },
  {
    id: 7,
    text: "Coworkers take longer breaks.",
    options: [
      { id: 'A', text: "Follow them", scores: { 'Conformity risk': 1 } },
      { id: 'B', text: "Follow the rules", scores: { 'Responsibility': 2 } },
      { id: 'C', text: "Ask supervisor", scores: { 'Proactive communication': 1 } }
    ]
  },
  {
    id: 8,
    text: "You make a mistake costing money.",
    options: [
      { id: 'A', text: "Hide it", scores: { 'Integrity': -2 } },
      { id: 'B', text: "Report and suggest solution", scores: { 'Accountability': 3 } },
      { id: 'C', text: "Blame unclear instructions", scores: { 'Defensive mindset': 1 } }
    ]
  }
];

const TRAITS_TO_CALCULATE = [
  'Confidence',
  'Integrity',
  'Responsibility',
  'Emotional Regulation',
  'Leadership Potential',
  'Accountability',
  'Growth Mindset'
];

// --- Components ---

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '',
  disabled = false,
  type = 'button'
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}) => {
  const baseStyles = "w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale cursor-pointer";
  const variants = {
    primary: "bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700",
    secondary: "bg-emerald-600 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700",
    outline: "border-2 border-slate-200 text-slate-600 hover:bg-slate-50",
  };

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Input = ({ label, value, onChange, placeholder, icon: Icon, type = "text" }: any) => (
  <div className="w-full mb-6">
    <label className="block text-slate-700 font-bold mb-2 ml-1 text-sm uppercase tracking-wider">{label}</label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
        <Icon size={20} />
      </div>
      <input 
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-6 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:outline-none transition-all text-lg font-medium"
        required
      />
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [view, setView] = useState<View>('home');
  const [userData, setUserData] = useState<UserData>({ fullName: '', age: '', orphanageName: '' });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setView('video');
  };

  const handleNext = () => {
  if (currentQuestionIndex < QUESTIONS.length - 1) {
    setCurrentQuestionIndex(prev => prev + 1);
  } else {

    // send results to Google Sheets
    submitResults({
      name: userData.fullName,
      age: userData.age,
      orphanage: userData.orphanageName,
      q1: answers[1],
      q2: answers[2],
      q3: answers[3],
      q4: answers[4],
      q5: answers[5],
      q6: answers[6],
      q7: answers[7],
      q8: answers[8],
      timestamp: new Date().toISOString()
    });

    setView('results');
  }
};


  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else {
      setView('video');
    }
  };

  const results = useMemo(() => {
    const scores: { [key: string]: number } = {};
    
    // Initialize all traits from scoring
    QUESTIONS.forEach(q => {
      q.options.forEach(o => {
        Object.keys(o.scores).forEach(trait => {
          scores[trait] = 0;
        });
      });
    });

    // Calculate scores
    Object.entries(answers).forEach(([qId, optionId]) => {
      const question = QUESTIONS.find(q => q.id === parseInt(qId));
      const option = question?.options.find(o => o.id === optionId);
      if (option) {
        Object.entries(option.scores).forEach(([trait, value]) => {
          scores[trait] += value;
        });
      }
    });

    // Sort all traits to find strengths and weaknesses
    const sortedTraits = Object.entries(scores)
      .sort(([, a], [, b]) => b - a);

    // Map trait names to descriptive strings for the report
    const traitDescriptions: { [key: string]: string } = {
      'Accountability': 'Strong accountability',
      'Integrity': 'High integrity',
      'Responsibility': 'Responsible decision making',
      'Confidence': 'Confidence in actions',
      'Emotional Regulation': 'Emotional composure',
      'Growth Mindset': 'Growth-oriented mindset',
      'Leadership Potential': 'Leadership potential',
      'Professional Positioning': 'Professional positioning',
      'Effort mindset': 'Strong effort mindset',
      'Awareness': 'Situational awareness',
      'Communication maturity': 'Good professional communication',
      'Professional composure': 'Professional composure',
      'Proactive communication': 'Proactive communication',
      'Survival mindset': 'Survival mindset awareness',
      'Conformity risk': 'Conformity awareness',
      'Defensive mindset': 'Defensive mindset awareness'
    };

    const toDevelopDescriptions: { [key: string]: string } = {
      'Accountability': 'Taking more ownership of mistakes',
      'Integrity': 'Being more honest in difficult situations',
      'Responsibility': 'Following workplace rules consistently',
      'Confidence': 'Confidence in uncertain situations',
      'Emotional Regulation': 'Handling mistakes calmly',
      'Growth Mindset': 'Viewing challenges as learning opportunities',
      'Leadership Potential': 'Taking initiative in group settings',
      'Professional Positioning': 'Positioning yourself professionally',
      'Effort mindset': 'Focusing on effort over results',
      'Awareness': 'Better situational awareness',
      'Communication maturity': 'Professional communication skills',
      'Professional composure': 'Staying calm under pressure',
      'Proactive communication': 'Communicating proactively',
      'Survival mindset': 'Moving beyond a survival mindset',
      'Conformity risk': 'Resisting negative peer influence',
      'Defensive mindset': 'Being less defensive when corrected'
    };

    return {
      strengths: sortedTraits.filter(([_, score]) => score > 0).slice(0, 3).map(([trait]) => traitDescriptions[trait] || trait),
      toDevelop: sortedTraits.filter(([_, score]) => score <= 0).slice(0, 2).map(([trait]) => toDevelopDescriptions[trait] || trait)
    };
  }, [answers]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col items-center overflow-x-hidden">
      <AnimatePresence mode="wait">
        {view === 'home' && (
          <motion.div 
            key="home"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md p-8 flex flex-col items-center justify-center min-h-screen text-center"
          >
            <div className="w-24 h-24 bg-indigo-100 rounded-3xl flex items-center justify-center mb-8">
              <UserCheck className="w-12 h-12 text-indigo-600" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">ReadyForWork</h1>
            <p className="text-xl text-slate-500 mb-12 font-medium">
              Learn how to handle interviews and workplace situations.
            </p>
            <Button onClick={() => setView('signup')}>
              Start Simulation <ArrowRight size={20} />
            </Button>
          </motion.div>
        )}

        {view === 'signup' && (
          <motion.div 
            key="signup"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full max-w-md p-8 flex flex-col min-h-screen"
          >
            <h2 className="text-3xl font-black mb-8 text-slate-900">Participant Signup</h2>
            <form onSubmit={handleSignup} className="flex-1">
              <Input 
                label="Full Name" 
                icon={User} 
                placeholder="Enter your full name" 
                value={userData.fullName} 
                onChange={(val: string) => setUserData({ ...userData, fullName: val })} 
              />
              <Input 
                label="Age" 
                icon={Calendar} 
                type="number"
                placeholder="Enter your age" 
                value={userData.age} 
                onChange={(val: string) => setUserData({ ...userData, age: val })} 
              />
              <Input 
                label="Orphanage Name" 
                icon={Home} 
                placeholder="Enter orphanage name" 
                value={userData.orphanageName} 
                onChange={(val: string) => setUserData({ ...userData, orphanageName: val })} 
              />
              <div className="mt-8">
                <Button type="submit">
                  Start Simulation <ArrowRight size={20} />
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        {view === 'video' && (
          <motion.div 
            key="video"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full h-screen bg-black flex flex-col"
          >
            <div className="flex-1 relative">
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/Q4flXpOrDRM?modestbranding=1&rel=0&autoplay=0" 
                title="Interview Preparation" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              ></iframe>
            </div>
            
            <div className="p-6 bg-slate-900">
              <Button onClick={() => setView('simulation')} variant="secondary">
                Start Assessment
              </Button>
            </div>
          </motion.div>
        )}

        {view === 'simulation' && (
          <motion.div 
            key="simulation"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full max-w-md p-6 flex flex-col min-h-screen"
          >
            <div className="flex items-center justify-between mb-8">
              <button onClick={handleBack} className="p-2 bg-white rounded-xl shadow-sm">
                <ChevronLeft size={24} />
              </button>
              <div className="flex gap-1">
                {QUESTIONS.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-1.5 w-4 rounded-full transition-all ${idx === currentQuestionIndex ? 'bg-indigo-600 w-8' : idx < currentQuestionIndex ? 'bg-indigo-200' : 'bg-slate-200'}`}
                  />
                ))}
              </div>
            </div>

            {currentQuestionIndex === 0 && (
              <div className="mb-8 bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                <h2 className="text-xl font-black text-indigo-900 mb-2">Decision Simulation</h2>
                <p className="text-indigo-700 font-medium text-sm">
                  This is not a test. There are no perfect answers. Answer honestly based on what you would really do.
                </p>
              </div>
            )}

            <div className="flex-1">
              <h3 className="text-2xl font-black mb-8 leading-tight">
                {QUESTIONS[currentQuestionIndex].text}
              </h3>

              <div className="space-y-4">
                {QUESTIONS[currentQuestionIndex].options.map((opt) => (
                  <button 
                    key={opt.id}
                    onClick={() => setAnswers({ ...answers, [QUESTIONS[currentQuestionIndex].id]: opt.id })}
                    className={`w-full p-5 rounded-2xl text-left font-bold text-lg border-2 transition-all flex items-center gap-4 ${answers[QUESTIONS[currentQuestionIndex].id] === opt.id ? 'bg-indigo-50 border-indigo-500 text-indigo-900 ring-4 ring-indigo-50' : 'bg-white border-white text-slate-700 shadow-sm hover:border-slate-200'}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black ${answers[QUESTIONS[currentQuestionIndex].id] === opt.id ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {opt.id}
                    </div>
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <Button 
                onClick={handleNext} 
                disabled={!answers[QUESTIONS[currentQuestionIndex].id]}
              >
                {currentQuestionIndex === QUESTIONS.length - 1 ? "Finish Simulation" : "Next Question"}
              </Button>
            </div>
          </motion.div>
        )}

        {view === 'results' && (
          <motion.div 
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md p-6 flex flex-col min-h-screen"
          >
            <div className="bg-white p-8 rounded-[40px] shadow-xl border border-slate-100 mb-8">
              <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-black mb-6 text-center">Simulation Complete</h2>
              
              <div className="bg-slate-50 p-6 rounded-3xl mb-8 text-left">
                <div className="mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Participant</span>
                  <p className="text-lg font-black text-slate-800">{userData.fullName}</p>
                </div>
                <div className="flex justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Orphanage</span>
                    <p className="text-sm font-bold text-slate-700">{userData.orphanageName}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Age</span>
                    <p className="text-sm font-bold text-slate-700">{userData.age}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-8 text-left">
                <div>
                  <h3 className="flex items-center gap-2 text-emerald-700 font-black text-lg mb-4">
                    <Zap size={20} /> Strengths
                  </h3>
                  <div className="space-y-2">
                    {results.strengths.length > 0 ? results.strengths.map(trait => (
                      <div key={trait} className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl text-emerald-900 font-bold">
                        <CheckCircle2 size={20} className="text-emerald-500" />
                        {trait}
                      </div>
                    )) : <p className="text-slate-400 italic ml-4">No specific strengths identified yet.</p>}
                  </div>
                </div>

                <div>
                  <h3 className="flex items-center gap-2 text-indigo-700 font-black text-lg mb-4">
                    <Target size={20} /> Areas to Improve
                  </h3>
                  <div className="space-y-2">
                    {results.toDevelop.length > 0 ? results.toDevelop.map(trait => (
                      <div key={trait} className="flex items-center gap-3 p-4 bg-indigo-50 rounded-2xl text-indigo-900 font-bold">
                        <ArrowRight size={20} className="text-indigo-400" />
                        {trait}
                      </div>
                    )) : <p className="text-slate-400 italic ml-4">No specific areas to improve identified.</p>}
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-slate-100">
                <p className="text-slate-600 font-medium leading-relaxed">
                  "You show strong {results.strengths[0] || 'potential'} and {results.strengths[1] || 'responsibility'}. Continue developing {results.toDevelop[0] || 'confidence'} during interviews and decision-making under pressure."
                </p>
              </div>
            </div>

            <div className="text-center mb-8">
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-2">Final Message</p>
              <p className="text-slate-500 font-medium">Thank you for participating. Facilitators can use these responses to guide coaching and training.</p>
            </div>

            <Button onClick={() => {
              setView('home');
              setAnswers({});
              setCurrentQuestionIndex(0);
              setUserData({ fullName: '', age: '', orphanageName: '' });
            }} variant="outline">
              Restart Simulation
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
