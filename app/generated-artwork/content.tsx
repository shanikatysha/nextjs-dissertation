"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function Artwork () {
    const [artworkGenerated, setGeneratedArtwork] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const searchParams = useSearchParams();

    // Get data from URL parameters
    const emotions = JSON.parse(searchParams.get('emotions') || '[]');
    const colors = JSON.parse(searchParams.get('colors') || '[]');
    const overallTone = searchParams.get('overallTone') || '';

    const generateArtwork = async () => {
        setIsGenerating(true);
    
        //send the data TO the API
        const response = await fetch('/api/predictions', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                emotions: emotions,        
                colors: colors,            
                overallTone: overallTone  
            }),
        });
    
        const data = await response.json();
        setGeneratedArtwork(data.imageUrl); // display the generated image
        setIsGenerating(false);
    };

    // auto-generate on page load
  useEffect(() => {
    if (emotions.length > 0 && colors.length > 0 && overallTone) {
      generateArtwork();
    }
  }, []);

  return (
    <div>
      <h1>Generated Artwork</h1>
      
      {/* Show the inputs used */}
      <div>
        <p><strong>Emotions:</strong> {emotions.join(', ')}</p>
        <p><strong>Colors:</strong> {colors.join(', ')}</p>
        <p><strong>Overall Tone:</strong> {overallTone}</p>
      </div>

      {/* Generate button */}
      <button onClick={generateArtwork} disabled={isGenerating}>
        {isGenerating ? 'Generating...' : 'Generate Artwork'}
      </button>

      {/* Display artwork */}
      {artworkGenerated && (
        <img src={artworkGenerated} alt="Generated artwork" style={{maxWidth: '100%'}} />
      )}
    </div>
  );

}