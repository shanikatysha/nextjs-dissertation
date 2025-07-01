"use client";

import { useState } from 'react';

export default function Prompt() {
    const [storyInput, setStoryInput] = useState('');
    const [analyzedPatterns, setAnalyzedPatterns] = useState<any>(null);

    // after submit input story
    const handlePatternAnalysis = async () => {
        if (!storyInput.trim()) return;
    
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
          } else {
            alert(`Error: ${data.error}`);
          }
        } catch (error) {
          alert('Error: Failed to analyze patterns');
        }
    };

    // handle button submit
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && e.ctrlKey) {
          e.preventDefault();
          handlePatternAnalysis();
        }
    };

    const navigateToArtwork = () => {
      if (!analyzedPatterns) {
        alert('Please analyze patterns first!');
        return;
      }
      // pass data through URL
      const params = new URLSearchParams({
        emotions: JSON.stringify(analyzedPatterns.emotions),
        colors: JSON.stringify(analyzedPatterns.colors),
        overallTone: analyzedPatterns.overallTone
      });
      
      window.location.href = `/generated-artwork?${params.toString()}`;
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-4xl mx-auto">

                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paste or write your story here (minimum 150 words for better analysis)
                </label>
                <textarea
                    value={storyInput}
                    onChange={(e) => setStoryInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Tell your story..."
                    className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none text-sm leading-relaxed"
                    rows={12}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-500">
                    {storyInput.length} characters | {storyInput.split(' ').filter(w => w.length > 0).length} words
                  </span>
                  <span className="text-xs text-gray-400">
                    Ctrl + Enter to analyze
                  </span>
                </div>

                <button
                    onClick={handlePatternAnalysis}
                    disabled={storyInput.trim().length < 150}
                    className="w-full bg-purple-600 text-white py-3 px-6 rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors text-lg"
                >Submit
                </button>

                {/* Results Section */}
                {analyzedPatterns && (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                      Pattern Analysis Results
                    </h2>
                    
                    <div className="grid lg:grid-cols-2 gap-6 mb-6">
                      {/* Pattern 1 */}
                      <div className="p-5 rounded-lg border">
                        <h3 className="font-bold mb-3 text-lg flex items-center">
                          Emotional Patterns
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {analyzedPatterns.emotions?.map((emotion: string, i: number) => (
                            <span key={i} className="px-3 py-2 text-sm font-medium">
                              {emotion}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Pattern 3 */}
                      <div className="p-5 rounded-lg border">
                        <h3 className="font-bold mb-3 text-lg flex items-center">
                          Internal/External Conflicts
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {analyzedPatterns.conflicts?.map((conflict: string, i: number) => (
                            <span key={i} className="px-3 py-2 text-sm font-medium">
                              {conflict}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Pattern 5 */}
                      <div className="p-5 rounded-lg border">
                        <h3 className="font-bold mb-3 text-lg flex items-center">
                          Overall Emotional Tone
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <p className="text-lg italic">
                            "{analyzedPatterns.overallTone}"
                          </p>
                        </div>
                      </div>

                      {/* Pattern 6 */}
                      <div className="p-5 rounded-lg border">
                        <h3 className="font-bold mb-3 text-lg flex items-center">
                          Associated Colors
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {analyzedPatterns.colors?.map((color: string, i: number) => (
                            <span key={i} className="px-3 py-2 text-sm font-medium">
                              {color}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                    </div>
                    <button onClick={navigateToArtwork} className="px-6 py-3 rounded-md font-medium">
                      🔍 See artwork...
                    </button>
                  </div>
                )}

            </div>
        </div>
    );
}