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
      )}
    </div>
  );

}