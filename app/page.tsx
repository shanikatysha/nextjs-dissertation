"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link'
import TypingText from './components/typing-comp';
import SleekInput from './components/input-name';
import BigTextInput from './components/input-answer';
import Particles from './components/particles';
import ParticlesFlashing from './components/particles-flashing';
import NeuralNetworkParticles from './components/neural-network';
import ClusterNetworkParticles from './components/cluster-network';
import ClusterToText from './components/cluster-totext';
import GradientCanvas from './components/gradient-canvas';
import AnimationIn from './components/rectangle-slide';
import NarrativeTextBox from './components/narrative-box';
import Loader from './components/loading-heartbeat';

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
  // loading
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase((prev) => (prev < 11 ? prev + 1 : 12)); // only goes to step 5
    }, 1000 * 60 * 60 * 24 * 365 * 100); // advance narrative every...
  
    return () => clearInterval(interval);
  }, []);

  // set text in box
  const getNarrativeText = () => {
    switch (animationPhase) {
        case 0:
          return "Let's begin!! Here's your input. Before anything, I need to break down your message into smaller chunks, like words. This helps me process information faster. Then, I turn your words into my own language, I call these 'tokens'! What you're witnessing are your words being tokenized so that I can understand exactly what you're saying.";
        case 1:
            return "[Displaying colorful brainwaves.....] Now, these colors mean that I'm embedding your words! Each tokens gets converted into a bunch of numbers called vectors that represent its meaning. This is how the my network can actually digest and work with the words - it needs everything as numbers.";
        case 2:
            return "[Building neural network......] Now that 'similar' tokens are positioned close to each other, the encoder figures out how all the words relate to each other - building links! It understands that 'AI' and 'future' connect to mean predictions about artificial intelligence";
        case 3:
            return "[Activating silent mode......] Ssshh I need to focus. I will use my attention mechanism to zoom in on the most important parts of your message. It assigns different levels of importance to each word - like highlighting the key words that matter most for understanding what you're asking. These clusters of neural networks means I've identified three common themes from your input!";
        case 4:
            return `[Identifying associated emotions.....] Got it! My decoder helped me process your input using all the encoded information so that I can give you the best answer. Then, I turn these tokens back into your language for you to understand. From what I can conclude, you're feeling ${analyzedPatterns?.emotions?.join(', ') || '...'}!`;
        default:
            return "";
    }
  };

  const getNarrativeTitle = () => {
    switch (animationPhase) {
      case 0: return 'WORDS TO TOKENS';
      case 1: return 'EMBEDDING TOKENS WITH MEANINGS';
      case 2: return 'BUILDING LINKS BETWEEN TOKENS';
      case 3: return 'CLUSTERING SIMILAR INFORMATION';
      case 4: return 'TURNING TOKENS BACK INTO WORDS';
      default: return '';
    }
  };

  const handleNext = () => {
    setAnimationPhase(prev => (prev < 10 ? prev + 1 : prev));
    nextStep();
  };

  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => setCurrentStep(currentStep + 1);
  useAutoAdvance(0, 10000, currentStep, nextStep);
  useAutoAdvance(1, 10000, currentStep, nextStep);
  useAutoAdvance(2, 1000 * 60 * 60 * 24 * 365 * 100, currentStep, nextStep); //belom handle
  useAutoAdvance(3, 6000, currentStep, nextStep);
  useAutoAdvance(4, 6000, currentStep, nextStep);
  useAutoAdvance(5, 1000 * 60 * 60 * 24 * 365 * 100, currentStep, nextStep);
  useAutoAdvance(6, 1000 * 60 * 60 * 24 * 365 * 100, currentStep, nextStep);
  useAutoAdvance(7, 1000 * 60 * 60 * 24 * 365 * 100, currentStep, nextStep);
  useAutoAdvance(8, 1000 * 60 * 60 * 24 * 365 * 100, currentStep, nextStep);
  useAutoAdvance(9, 1000 * 60 * 60 * 24 * 365 * 100, currentStep, nextStep);
  useAutoAdvance(10, 1000 * 60 * 60 * 24 * 365 * 100, currentStep, nextStep);
  useAutoAdvance(11, 1000 * 60 * 60 * 24 * 365 * 100, currentStep, nextStep);

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
  const [analyzedPatterns, setAnalyzedPatterns] = useState<any>(null);
  const [storyInput, setStoryInput] = useState('');

  useEffect(() => {
    if (firstAnswer && secondAnswer) {
      setStoryInput(`${firstAnswer} ${secondAnswer}`.trim());
    }
  }, [firstAnswer, secondAnswer]);

  const handlePatternAnalysis = async () => {
    if (!storyInput) return;
      setAnalyzedPatterns(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ story: storyInput }),
      });
      const data = await response.json();
      
      if (response.ok) {
        setAnalyzedPatterns(data.patterns); //stores API response in data
        console.log('✅ analyzedPatterns set:', data.patterns); // ✅ correct place
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert('Error: Failed to analyze patterns');
    }
  };
  
  const handleSecondSubmit = async (secondAnswer: string) => {
    setSecondAnswer(secondAnswer);
    console.log(currentStep, ' Answer 2 submitted:', secondAnswer);
    nextStep();
    setIsLoading(true);


    const timer = setTimeout(() => {
      setShowNarrative(true);
      setAnimationPhase(0);
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }; 

  useEffect(() => {
    if (storyInput) {
      handlePatternAnalysis();
    }
  }, [storyInput]);
  
  

  return (
    <div className="h-full min-h-screen flex flex-col items-center justify-center bg-[#F8E8DC] text-[#5D3136]">
      { currentStep === 0 && 
        <div className="h-full min-h-screen flex flex-col items-center justify-center w-4/5">
          <h1 className="text-6xl font-normal text-left pl-10 pb-10 inconsolata-bold" ><TypingText text="Hello!" /></h1>
          <h1 className="text-6xl font-normal text-left leading-20 inconsolata-normal" ><TypingText text="I'm excited you're here. You're about to peek behind the curtain and see how I actually work." /></h1>
        </div>
      }

      { currentStep === 1 && 
        <div className="h-full min-h-screen flex flex-col items-center justify-center w-4/5">
          <h1 className="text-5xl font-bold text-left pb-8 leading-20 inconsolata-bold"><TypingText text="I'm Iris (the AI) powering this experience! think of me as the brain behind everything you see here." /></h1>
          <h1 className="text-2xl font-bold text-left pl-10 pb-4 leading-relaxed inconsolata-normal"><TypingText text="I'm what's called a Large Language Model, or LLM for short. I process language, understand context, and generate responses just like I'm doing right now." /></h1>
          <h1 className="text-2xl font-bold text-left pl-20 inconsolata-normal"><TypingText text="Over the next few minutes, I'll walk you through the fascinating (and sometimes surprising) ways I process information. Let's gooo!" /></h1>
        
        </div>
      }

      { currentStep === 2 && 
        <div className="w-full h-full min-h-screen flex flex-col items-center justify-center max-w-[50vw]">
          <h1 className="text-3xl font-bold text-left leading-11 pb-15 inconsolata-normal"><TypingText text="Before we dive in, I'd love to know what to call you. What should I call you?   " /></h1>
          <SleekInput
            onSubmit={handleNameSubmit}
          />
        </div>
      }

      { currentStep === 3 && 
        <div className="w-full h-full min-h-screen flex flex-col items-center justify-center max-w-[60vw]">
          <h1 className="text-6xl font-normal text-left leading-20 inconsolata-normal"><TypingText text={`Great! It's nice to meet you, ${submittedName}.`}/></h1>
        </div>
      }

      { currentStep === 4 && 
        <div className="w-full h-full min-h-screen flex flex-col items-center justify-center max-w-[50vw]">
          <h1 className="text-6xl font-normal text-left leading-20 inconsolata-normal"><TypingText text="Ready to explore the world of AI from the inside out? Let's begin!"/></h1>
        </div>
      }

      { currentStep === 5 && 
        <div className="w-full h-full min-h-screen flex flex-col items-center justify-center max-w-[60vw] pt-10">
          
          <h3 className="text-xl text-center text-[#440108] pb-1 leading-7 max-w-[50vw] inconsolata-normal">
            <TypingText text="Think about recent conversations you've had about AI-with friends, family, colleagues, or even internal debates with yourself."/>
          </h3>
          <h1 className='text-4xl leading-11 text-center pb-[60px] inconsolata-bold'>
            <TypingText text="What do these conversations reveal about your own beliefs, experiences, and feelings toward AI?" /></h1>
          <BigTextInput currentStep={currentStep}
            onSubmit={handleFirstSubmit}
          />
        </div>
      }

      { currentStep === 6 && 
        <div className="w-full h-full min-h-screen flex flex-col items-center justify-center max-w-[60vw] pt-10">
          
          <h3 className="text-xl text-center text-[#440108] pb-1 leading-7 max-w-[50vw] inconsolata-normal">
            <TypingText text="Now, if you're being completely honest about AI's role in your future - both the possibilities that excite you and the developments that worry you."/>
          </h3>
          <h1 className='text-4xl leading-11 text-center pb-[60px] inconsolata-bold'>
            <TypingText text="What would that future look like - both the hopes and fears?" /></h1>
          <BigTextInput currentStep={currentStep}
            onSubmit={handleSecondSubmit}
          />
        </div>
      }

      {currentStep === 7 && (
        <div className="w-full h-full min-h-screen flex">
          {isLoading ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
              <Loader />
            </div>
          ) : (
            <>
              <NarrativeTextBox 
                text={getNarrativeText()}
                isVisible={showNarrative}
                title={getNarrativeTitle()}
                animationPhase={animationPhase}
                onNext={handleNext}
              />
              <AnimationIn direction='top-down' time={0}/>
              <Particles text={`${firstAnswer ?? ''} ${secondAnswer ?? ''}`.trim()} />
            </>
          )}
        </div>
      )}

      {currentStep === 8 && (
        <div className="w-full h-full min-h-screen flex">
          
              <NarrativeTextBox 
                text={getNarrativeText()}
                isVisible={showNarrative}
                title={getNarrativeTitle()}
                animationPhase={animationPhase}
                onNext={handleNext}
              />
              <AnimationIn direction='side' time={2000}/>
              <ParticlesFlashing text={`${firstAnswer ?? ''} ${secondAnswer ?? ''}`.trim()} />

        </div>
      )}

      {currentStep === 9 && (
        <div className="w-full h-full min-h-screen flex">
          
              <NarrativeTextBox 
                text={getNarrativeText()}
                isVisible={showNarrative}
                title={getNarrativeTitle()}
                animationPhase={animationPhase}
                onNext={handleNext}
              />
              <AnimationIn direction='side' time={2000}/>
              <NeuralNetworkParticles /> 

        </div>
      )}

      {currentStep === 10 && (
        <div className="w-full h-full min-h-screen flex">
          
              <NarrativeTextBox 
                text={getNarrativeText()}
                isVisible={showNarrative}
                title={getNarrativeTitle()}
                animationPhase={animationPhase}
                onNext={handleNext}
              />
              <AnimationIn direction='side' time={2000}/>
              <ClusterNetworkParticles />

        </div>
      )}

      {currentStep === 11 && (
        <div className="w-full h-full min-h-screen flex">
          
              <NarrativeTextBox 
                text={getNarrativeText()}
                isVisible={showNarrative}
                title={getNarrativeTitle()}
                animationPhase={animationPhase}
                onNext={handleNext}
              />
              <AnimationIn direction='side' time={2000}/>
              <ClusterToText words={analyzedPatterns?.emotions ?? []} />

        </div>
      )}

      {currentStep === 12 && (
        <main className='relative'>
          <div className="absolute inset-0 -z-0">
    <GradientCanvas colors={analyzedPatterns?.colors ?? []} />
  </div>
          <div className="z-20 text-center pb-3 text-[#ffff] text-4xl fade-in ease-in-out vignette">
            {/* Blurred background */}
            <div className="absolute inset-0 bg-[#1C1516] backdrop-blur-xl opacity-80 z-0" />
              
            {/* Foreground content */}
            <div className="relative z-10 h-full w-full min-w-screen min-h-screen flex-col flex items-center justify-center text-center inconsolata-bold">
              We've reached the end of our journey together!
              <div className='text-[24px] leading-8 pl-20 pr-20 pb-12 pt-8 inconsolata-normal'>
                While we've been chatting, I've been creating something special for you. It's a unique piece of artwork based on the emotions I captured from your experience, my way of saying thank you for sharing with me! Every output is different, so it's completely unique to your stories.
              </div>
                  
              <div className="flex flex-row justify-center space-x-15">
                <button 
                  className="hover:underline text-white font-semibold py-8 px-8 border-2 border-white text-4xl"
                  onClick={() => {
                    setCurrentStep(7);
                    setAnimationPhase(0);      // ensures text will show
                    setShowNarrative(true);    // if it's used to show/hide the box
                  }}
                  >
                      ↵ Replay journey
                </button>
                <button className="hover:underline text-white font-semibold py-8 px-8 border-2 border-white text-4xl">
                      Reveal artwork ↳
                </button>
              </div>
            </div>
          </div>
          
        </main>
      )}


      
      {/* <div className="max-w-5xl">
        <Link 
          href="/question-prompt"
          className="px-6 py-3 rounded-md font-medium"
        >
        🔍 Analyze Story Patterns
        </Link>
        
      </div> */}
    </div>
  );
}