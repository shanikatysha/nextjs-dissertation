"use client";

import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [chatResponse, setChatResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'image'>('chat');

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;

    setLoading(true);
    setChatResponse('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: chatInput }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setChatResponse(data.response);
      } else {
        setChatResponse(`Error: ${data.error}`);
      }
    } catch (error) {
      setChatResponse('Error: Failed to get response');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSubmit = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setGeneratedImage(null);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setGeneratedImage(data.imageUrl);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert('Error: Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          OpenAI & DALL-E Integration
        </h1>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'chat'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              💬 Chat with AI
            </button>
            <button
              onClick={() => setActiveTab('image')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'image'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              🎨 Generate Images
            </button>
          </div>
        </div>

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Chat with OpenAI
            </h2>
            <div className="space-y-4">
              <div>
                <textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleChatSubmit)}
                  placeholder="Ask me anything... (Press Enter to send)"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={3}
                  disabled={loading}
                />
              </div>
              <button
                onClick={handleChatSubmit}
                disabled={loading || !chatInput.trim()}
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
              >
                {loading ? 'Thinking...' : 'Ask AI'}
              </button>
            </div>

            {chatResponse && (
              <div className="mt-6 p-4 bg-gray-50 rounded-md">
                <h3 className="font-semibold text-gray-800 mb-2">AI Response:</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{chatResponse}</p>
              </div>
            )}
          </div>
        )}

        {/* Image Generation Tab */}
        {activeTab === 'image' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Generate Images with DALL-E
            </h2>
            <div className="space-y-4">
              <div>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleImageSubmit)}
                  placeholder="Describe the image you want to generate... (Press Enter to generate)"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={3}
                  disabled={loading}
                />
              </div>
              <button
                onClick={handleImageSubmit}
                disabled={loading || !prompt.trim()}
                className="w-full bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
              >
                {loading ? 'Generating...' : 'Generate Image'}
              </button>
            </div>

            {generatedImage && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-800 mb-3">Generated Image:</h3>
                <div className="flex flex-col items-center">
                  <img
                    src={generatedImage}
                    alt="Generated by DALL-E"
                    className="max-w-full h-auto rounded-lg shadow-md"
                  />
                  <a
                    href={generatedImage}
                    download="generated-image.png"
                    className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors inline-block"
                  >
                    Download Image
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        {/* <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Setup Instructions:</h3>
          <ol className="list-decimal list-inside text-yellow-700 space-y-1">
            <li>Install OpenAI: <code className="bg-yellow-100 px-1 rounded">npm install openai</code></li>
            <li>Add your OpenAI API key to environment variables</li>
            <li>Create the API routes (chat.js and generate-image.js)</li>
            <li>Deploy to Vercel with environment variables set</li>
          </ol>
        </div> */}
      </div>
    </div>
  );
}