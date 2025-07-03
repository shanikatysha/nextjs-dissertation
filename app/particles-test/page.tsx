"use client";

import Particles from '../components/particles';
import ParticlesFlashing from '../components/particles-flashing';
import NeuralNetworkParticles from '../components/neural-network';
import AnimationIn from '../components/rectangle-slide';
import { useEffect, useRef, useState } from 'react';
import NarrativeTextBox from '../components/narrative-box';
import Loader from '../components/loading-heartbeat';
import Instructions from '../components/instructions';

export default function ParticlesTest() {
    const [animationPhase, setAnimationPhase] = useState(0);
    const input400 = "Shanika stared at the glowing screen, her heart racing with anticipation. The AI art generator she'd been building for months was finally ready for its first real test. Her fingers trembled slightly as she uploaded her personal artwork - five carefully crafted designs that represented years of her creative journey. Part of her buzzed with excitement at the possibilities. This could revolutionize how people express emotions through art. But underneath the thrill, anxiety gnawed at her. What if the AI couldn't capture her unique style? What if months of work had been for nothing? The technology felt both magical and terrifying - a double-edged sword that could either amplify human creativity or replace it entirely. As she watched the neural network analyze her radial energy patterns, Shanika felt a profound sense of vulnerability. She was essentially teaching a machine to think like her, to create like her. The boundary between human and artificial creativity seemed to blur before her eyes, leaving her both amazed and unsettled about the future of artistic expression.Shanika stared at the glowing screen, her heart racing with anticipation. The AI art generator she'd been building for months was finally ready for its first real test. Her fingers trembled slightly as she uploaded her personal artwork - five carefully crafted designs that represented years of her creative journey. Part of her buzzed with excitement at the possibilities. This could revolutionize how people express emotions through art. But underneath the thrill, anxiety gnawed at her. What if the AI couldn't capture her unique style? What if months of work had been for nothing? The technology felt both magical and terrifying - a double-edged sword that could either amplify human creativity or replace it entirely. As she watched the neural network analyze her radial energy patterns, Shanika felt a profound sense of vulnerability. She was essentially teaching a machine to think like her, to create like her. The boundary between human and artificial creativity seemed to blur before her eyes, leaving her both amazed and unsettled about the future of artistic expression. The technology felt both magical and terrifying - a double-edged sword that could either amplify human creativity or replace it entirely. As she watched the neural network analyze her radial energy patterns, Shanika felt a profound sense of vulnerability. The technology felt both magical and terrifying - a double-edged sword that could either amplify human creativity or replace it entirely. As she watched the neural network analyze her radial energy patterns, Shanika felt a profound sense of vulnerability."
    useEffect(() => {
        const interval = setInterval(() => {
          setAnimationPhase((prev) => (prev < 5 ? prev + 1 : 5)); // only goes to step 5
        }, 2000000); // advance every...
      
        return () => clearInterval(interval);
      }, []);


      const [isLoading, setIsLoading] = useState(true);

      useEffect(() => {
        const timer = setTimeout(() => {
          setIsLoading(false);
        }, 5000);
      
        return () => clearTimeout(timer); // cleanup on unmount
      }, []);      


    // set text in box
    const getNarrativeText = () => {
        switch (animationPhase) {
            case 0:
                return "Let's begin!! Here's your input. Before anything, I need to break down your message into smaller chunks, like words. This helps me process information faster. Then, I turn your words into my own language, I call these 'tokens'! What you're witnessing are your words being tokenized so that I can understand exactly what you're saying.";
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
          case 0: return 'WORDS TO TOKENS';
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
    
    return (
        <main className='bg-black text-white h-screen w-full flex items-center justify-center'>
           {isLoading ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
              <Loader />
            </div>
            
          ) : (
            <>
              <NarrativeTextBox 
                text={getNarrativeText()}
                isVisible={animationPhase >= 0}
                title={getNarrativeTitle()}
                animationPhase={animationPhase}
                onNext={handleNext}
            />
            <AnimationIn direction='side'/>
            <NeuralNetworkParticles  />
            </>
          )}
        </main>
    );
}