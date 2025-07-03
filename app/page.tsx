"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link'
import TypingText from './components/typing-comp';
import SleekInput from './components/input-name';
import BigTextInput from './components/input-answer';
import Particles from './components/particles';
import AnimationIn from './components/rectangle-slide';
import NarrativeTextBox from './components/narrative-box';

function useAutoAdvance(
  stepNumber: number, 
  delay: number, 
  currentStep: number, 
  nextStep: () => void
): void {
  useEffect(() => {
    if (currentStep === stepNumber) {
      const timer = setTimeout(nextStep, delay);
      return () => clearTimeout(timer);
    }
  }, [currentStep, stepNumber, nextStep]);
}

export default function Home() {
  const [animationPhase, setAnimationPhase] = useState(-1); //narrative box phase
  const [showNarrative, setShowNarrative] = useState(false); // narrative box visibility

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase((prev) => (prev < 5 ? prev + 1 : 5)); // only goes to step 5
    }, 30000); // advance narrative every...
  
    return () => clearInterval(interval);
  }, []);

  // set text in box
  const getNarrativeText = () => {
    switch (animationPhase) {
        case 0:
            return "Let's begin! Before anything, I need to break down your story into smaller parts because it helps me process faster. I call these 'tokens' ! in your world, you'd basically call them words.";
        case 1:
            return "Right, you wrote just enough for me to understand your personal experience! thanks for that. Now, I need to translate these tokens into a language that I can understand. I will describe each tokens with labels like definitions. That way, my brain can understand what you're trying to say.";
        case 2:
            return "Now that I understand everything, I will start analyzing your story. Hmmm, I see that your story make sense given your...";
        case 3:
            return "I'm identifying patterns in your story, and I think I know how you feel. I'll group similar patterns together so I can analyze better. Here! you can see the different colors representing each emotions you felt!";
        case 4:
            return "I have everything I need. I'm ready to generate a personal artwork for you based on your emotions caught in your story.";  
        default:
            return "";
    }
  };

  const getNarrativeTitle = () => {
    switch (animationPhase) {
      case 0: return 'READING YOUR STORY';
      case 1: return 'TRANSLATING YOUR WORDS TO MY LANGUAGE';
      case 2: return 'EXTRACTING INFORMATION';
      case 3: return 'COLORING SIMILAR INFORMATION';
      case 4: return 'ANALYZING COMPLETE!';
      default: return '';
    }
  };

  const handleNext = () => {
    setAnimationPhase(prev => (prev < 5 ? prev + 1 : prev));
  };

  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => setCurrentStep(currentStep + 1);
  useAutoAdvance(0, 3000, currentStep, nextStep);
  useAutoAdvance(1, 3000, currentStep, nextStep);
  useAutoAdvance(2, 1000 * 60 * 60 * 24 * 365 * 100, currentStep, nextStep); //belom handle
  useAutoAdvance(3, 3000, currentStep, nextStep);
  useAutoAdvance(4, 3000, currentStep, nextStep);
  useAutoAdvance(5, 1000 * 60 * 60 * 24 * 365 * 100, currentStep, nextStep);
  useAutoAdvance(6, 1000 * 60 * 60 * 24 * 365 * 100, currentStep, nextStep);

  const [submittedName, setSubmittedName] = useState<string | null>(null);
  const handleNameSubmit = (name: string) => {
    console.log('User name submitted:', name);
    setSubmittedName(name);
    nextStep();
  };

  const [firstAnswer, setFirstAnswer] = useState<string | null>(null);
  const handleFirstSubmit = (firstAnswer: string) => {
    setFirstAnswer(firstAnswer);
    console.log(currentStep,' Answer 1 submitted:', firstAnswer);
    nextStep();
  };

  const [secondAnswer, setSecondAnswer] = useState<string | null>(null);
  const handleSecondSubmit = (secondAnswer: string) => {
    setSecondAnswer(secondAnswer);
    console.log(currentStep, ' Answer 2 submitted:', secondAnswer);
    nextStep();

    const timer = setTimeout(() => {
      setShowNarrative(true);
      setAnimationPhase(0);
    }, 3000);

    return () => clearTimeout(timer);
  };
  

  return (
    <div className="h-full min-h-screen flex flex-col items-center justify-center bg-[#000000] text-[#e7e7e7]">
      { currentStep === 0 && 
        <div className="h-full min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-center" ><TypingText text="Hello!   " /></h1>
        </div>
      }

      { currentStep === 1 && 
        <div className="h-full min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-center"><TypingText text="Welcome. I'm Iris, you're AI collaborator!   " /></h1>
        </div>
      }

      { currentStep === 2 && 
        <div className="w-full h-full min-h-screen flex flex-col items-center justify-center max-w-[50vw]">
          <h1 className="text-4xl font-bold text-center pb-10"><TypingText text="What should I call you?   " /></h1>
          <SleekInput
            onSubmit={handleNameSubmit}
          />
        </div>
      }

      { currentStep === 3 && 
        <div className="w-full h-full min-h-screen flex flex-col items-center justify-center max-w-[50vw]">
          <h1 className="text-4xl font-bold text-center pb-10"><TypingText text={`Great! It's nice to meet you, ${submittedName}.`}/></h1>
        </div>
      }

      { currentStep === 4 && 
        <div className="w-full h-full min-h-screen flex flex-col items-center justify-center max-w-[50vw]">
          <h1 className="text-4xl font-bold text-center pb-10"><TypingText text="Let's get started.   "/></h1>
        </div>
      }

      { currentStep === 5 && 
        <div className="w-full h-full min-h-screen flex flex-col items-center justify-center max-w-[50vw]">
          <h3 className="text-lg text-center text-gray-400 pb-2">
            <TypingText text="Think about recent conversations you've had about AI-with friends, family, colleagues, or even internal debates with yourself."/>
          </h3>
          <h1 className='text-3xl leading-11 text-center pb-[80px]'>What do these conversations reveal about your own beliefs, experiences, and feelings toward AI?</h1>
          <BigTextInput currentStep={currentStep}
            onSubmit={handleFirstSubmit}
          />
        </div>
      }

      { currentStep === 6 && 
        <div className="w-full h-full min-h-screen flex flex-col items-center justify-center max-w-[50vw]">
          <h3 className="text-lg text-center text-gray-400 pb-2">
            <TypingText text="Now, if you're being completely honest about AI's role in your future - both the possibilities that excite you and the developments that worry you."/>
          </h3>
          <h1 className='text-3xl leading-11 text-center pb-[80px]'>What would that future look like - both the hopes and fears?</h1>
          <BigTextInput currentStep={currentStep}
            onSubmit={handleSecondSubmit}
          />
        </div>
      }

      { currentStep === 7 && 
        <div className="w-full h-full min-h-screen flex">
          <NarrativeTextBox 
                text={getNarrativeText()}
                isVisible={showNarrative}
                title={getNarrativeTitle()}
                animationPhase={animationPhase}
                onNext={handleNext}
            />
          <AnimationIn/>
          <Particles text={`${firstAnswer ?? ''} ${secondAnswer ?? ''}`.trim()} />
        </div>
      }

      
      <div className="max-w-5xl">
        <Link 
          href="/question-prompt"
          className="px-6 py-3 rounded-md font-medium"
        >
        🔍 Analyze Story Patterns
        </Link>
        
      </div>
    </div>
  );
}