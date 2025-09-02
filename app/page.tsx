'use client';

import { useState } from 'react';
import { Homeowner, ScoreResponse } from '@/types';
import { SAMPLE_CONTRACTORS } from '@/lib/contractors';
import HomeownerForm from '@/components/HomeownerForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import ThemeToggle from '@/components/ThemeToggle';
import StorageDebug from '@/components/StorageDebug';
import ThemeTest from '@/components/ThemeTest';

export default function Home() {
  const [results, setResults] = useState<ScoreResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (homeowner: Homeowner) => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/api/score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          homeowner,
          contractors: SAMPLE_CONTRACTORS,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get contractor matches');
      }

      const data: ScoreResponse = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Theme Toggle */}
      <ThemeToggle />
      
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90 dark:opacity-30"
        style={{
          backgroundImage: 'url(/background-hero.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Content Overlay */}
      <div className="relative z-10 h-screen overflow-auto dark:bg-gray-900/20">
        <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div 
              className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 pb-2 shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              onClick={() => window.location.reload()}
              title="Reload page"
            >
              <img
                src="/logo-dark.svg"
                alt="AG3 Mini Trust Engine Logo"
                className="h-16 w-auto hidden dark:block"
              />
              <img
                src="/logo.svg"
                alt="AG3 Mini Trust Engine Logo"
                className="h-16 w-auto dark:hidden"
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 drop-shadow-sm">
            AG3 Mini Trust Engine
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto drop-shadow-sm">
            AI-powered contractor matching system that finds your perfect home improvement partners
            based on your specific preferences and requirements.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start gap-8 relative">
            {/* Form Section - Always centered on mobile, positioned left on desktop when results show */}
            <div className={`transition-all duration-700 ease-in-out w-full max-w-md mx-auto ${
              results || isLoading ? 'lg:w-1/2 lg:max-w-none lg:mx-0' : 'lg:w-3/4 lg:max-w-2xl'
            }`}>
              <HomeownerForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>

            {/* Results Section - Slides in from right */}
            <div className={`transition-all duration-700 transform w-full max-w-md mx-auto lg:w-1/2 lg:max-w-none lg:mx-0
              ${results || isLoading ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 lg:absolute lg:right-0'}`}>
              <ResultsDisplay 
                results={results} 
                isLoading={isLoading} 
                error={error} 
              />
            </div>
          </div>
        </div>

                 {/* Footer */}
         <div className="mt-12 text-center text-gray-500 dark:text-gray-400 text-sm">
           <p>
             Powered by OpenAI GPT-4o • Built with Next.js and Tailwind CSS
           </p>
         </div>
         </div>
       </div>

       {/* Debug Components - Only visible in development */}
       {process.env.NODE_ENV === 'development' && (
         <>
           <StorageDebug />
           {/* <ThemeTest /> */}
         </>
       )}
     </div>
   );
 }
