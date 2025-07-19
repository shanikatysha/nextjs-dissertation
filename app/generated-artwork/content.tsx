"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

type ArtworkProps = {
  emotions: string[];
  colors: string[];
  overallTone: string;
};

export default function Artwork ({ emotions, colors, overallTone }: ArtworkProps) {
    const [artworkGenerated, setGeneratedArtwork] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [hasGenerated, setHasGenerated] = useState(false);


    // get data from URL parameters
    // const emotions = JSON.parse(searchParams.get('emotions') || '[]');
    // const colors = JSON.parse(searchParams.get('colors') || '[]');
    // const overallTone = searchParams.get('overallTone') || '';

    const generateArtwork = async () => {
        setIsGenerating(true);
    
        // send the data TO the API
        const response = await fetch('/api/predictions', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                emotions,        
                colors,            
                overallTone
            }),
        });
    
        const data = await response.json();
        setGeneratedArtwork(data.imageUrl); // display the generated image
        console.log('DATA PASSED 🎨 Generated image URL:', data.imageUrl);
        setIsGenerating(false);
    };

    // auto-generate on page load
  useEffect(() => {
    if (!hasGenerated && emotions.length && colors.length && overallTone) {
      generateArtwork();
      setHasGenerated(true); // ensures it only runs once
    }
  }, [emotions, colors, overallTone, hasGenerated]);

  return (
    <div className="relative z-10 text-center text-white ">
      

      {/* Show loading text */}
      {isGenerating && 
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="flex items-center justify-center space-x-3">
          <div className="relative">
            <div className="w-3 h-3 bg-white rounded-sm transform rotate-45 animate-ping"></div>
            <div className="absolute top-0 left-0 w-3 h-3 bg-white rounded-sm transform rotate-45"></div>
          </div>
          <span className="text-white font-light animate-pulse tracking-wide text-center">
            Generating artwork...
          </span>
        </div>
      </div>
      }

      {/* Show image when ready */}
      {!isGenerating && artworkGenerated && (
        <main>
        <div className="mt-20 pl-10 pr-10 flex flex-row items-center justify-between gap-x-8">
          <div className='flex flex-col text-left w-2/5'>
          <h1 className="text-4xl inconsolata-bold pb-5">Generated Artwork</h1>
          <p className="text-4xl pb-5">↳</p>
          <p className='inconsolata-bold text-3xl pb-8 pr-8 hover:underline'>{overallTone}</p>
          <p className='inconsolata-normal text-2xl pr-8'>Your personal experiences, thoughts, and emotions towards AI shows that you're feeling </p>
          <p className='inconsolata-bold text-2xl pr-10 hover:underline'>{emotions.join(', ')}</p>
          
          </div>
          <div className='flex flex-col'>

          <img
            src={artworkGenerated}
            alt="Generated artwork"
            style={{ maxWidth: "100%", boxShadow: "-16px -18px 0px white",display: 'block', }}
          />
          <a
            href={artworkGenerated}
            download="iris_artwork.png"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-black bg-white rounded hover:underline"
            style={{ display: 'inline-block' }}
            >
      ⬇ Download Artwork
    </a>
    </div>
    
        </div>
        
        <div className='w-full mt-50 pl-40 pr-40 flex flex-col items-center gap-y-12'>
          <h1 className='text-4xl'>Acknowledgements</h1>
          <div className='flex flex-col text-left inconsolata-normal gap-x-6'>
            <div className='pr-6 pl-6 pt-8 pb-8 border-1 w-5/5'>
              <h1 className='text-2xl inconsolata-bold pb-3'>Technology</h1>
              <p className='pb-4'>This experience was created using OpenAI GPT-4 for text analysis and my custom 'Aurora' model using Flux + LoRA trained on my original designs for text-to-image generation. These tools demonstrate how multiple AI systems can work together to amplify human creativity. </p>
              <p className='pb-4'>The visual animations and processing steps you saw are simplified representations of what's actually happening behind the scenes. Real AI processing involves complex mathematical calculations, pattern matching across millions of data points, and probability predictions that happen in milliseconds.</p>
              <p className='pb-4'>The goal is for you to grasp that AI isn't magic - it's a sophisticated but understandable system that analyzes, finds patterns, and generates outputs based on training data.</p>
            
            </div>
            <div className='border-1 items-center'>
              <img
              src="../images/diagram.png"
              alt="Generated artwork"
              style={{ maxWidth: "100%", display: 'block',  margin: '0 auto',}}
              >
              </img>
              <p className='pb-2 pl-8 pr-8 pt-6'>The diagram above explains how your input is processed to generate a unique piece of artwork. The prototype you have just experienced demonstrates the future of human-AI creative partnership and personalized AI collaboration.</p>
            </div>
          </div>
        </div>
    
       </main>
        
      )}
    </div>
  );

}