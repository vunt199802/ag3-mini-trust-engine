'use client';

import { ContractorMatch, ScoreResponse } from '@/types';
import ContractorCard from './ContractorCard';

interface ResultsDisplayProps {
  results: ScoreResponse | null;
  isLoading: boolean;
  error: string | null;
}

export default function ResultsDisplay({ results, isLoading, error }: ResultsDisplayProps) {
  if (isLoading) {
    return (
      <div className="bg-white/95 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-xl p-8 border border-white/20 dark:border-gray-700/30 animate-fadeIn">
        <div className="text-center">
          <div className="relative">
            <div className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-blue-400 opacity-30"></div>
            <div className="animate-spin relative rounded-full h-12 w-12 border-4 border-blue-200 border-b-blue-600 mx-auto mb-4"></div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 animate-pulse">Analyzing Contractors...</h3>
          <p className="text-gray-600 dark:text-gray-300 animate-fadeIn" style={{ animationDelay: '0.5s' }}>Our AI is finding your perfect matches</p>
          <div className="mt-6 space-y-2 animate-fadeIn" style={{ animationDelay: '0.8s' }}>
            <div className="h-2 bg-blue-200 rounded animate-pulse"></div>
            <div className="h-2 bg-blue-200 rounded w-5/6 mx-auto animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="h-2 bg-blue-200 rounded w-4/6 mx-auto animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/30 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-xl p-6 border border-white/20 dark:border-gray-700/30 animate-fadeIn">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4 animate-bounce">⚠️</div>
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2 animate-slideDown">Error</h3>
          <p className="text-red-600 dark:text-red-300 animate-fadeIn" style={{ animationDelay: '0.3s' }}>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all duration-300 transform hover:scale-105 animate-fadeIn"
            style={{ animationDelay: '0.6s' }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/30 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-xl p-6 border border-white/20 dark:border-gray-700/30 animate-fadeIn">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 animate-slideDown">
          <span className="inline-block animate-fadeIn" style={{ animationDelay: '0.1s' }}>Your</span>{' '}
          <span className="inline-block animate-fadeIn" style={{ animationDelay: '0.2s' }}>Top</span>{' '}
          <span className="inline-block animate-fadeIn text-blue-600" style={{ animationDelay: '0.3s' }}>3</span>{' '}
          <span className="inline-block animate-fadeIn" style={{ animationDelay: '0.4s' }}>Contractor</span>{' '}
          <span className="inline-block animate-fadeIn" style={{ animationDelay: '0.5s' }}>Matches</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
          Based on your preferences, here are the contractors that best match your needs:
        </p>
        
        <div className="grid gap-6">
          {results.top3.map((match, index) => (
            <div 
              key={match.id} 
              className="animate-slideInRight" 
              style={{ animationDelay: `${0.3 + index * 0.3}s` }}
            >
              <ContractorCard match={match} rank={index + 1} />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-6 border border-white/20 dark:border-gray-700/30 animate-fadeIn shadow-lg" style={{ animationDelay: '1.5s' }}>
        <div className="flex items-center mb-4">
          <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full mr-3">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Analysis Details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/60 rounded-lg p-4 shadow-sm transform transition-all duration-300 hover:scale-105 animate-fadeIn flex flex-col justify-between" style={{ animationDelay: '1.6s' }}>
            <div className="flex items-center mb-2">
              <div className='mr-2'>
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 overflow-hidden text-ellipsis">AI Model</span>
            </div>
            <div className="text-blue-800 dark:text-blue-300 font-mono bg-blue-50 dark:bg-blue-900/50 px-2 py-1 rounded text-sm">
              {results.meta.model}
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 shadow-sm transform transition-all duration-300 hover:scale-105 animate-fadeIn flex flex-col justify-between" style={{ animationDelay: '1.7s' }}>
            <div className="flex mb-2">
              <div className='mr-2'>
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700 overflow-hidden text-ellipsis">Processing Time</span>
            </div>
            <div className="flex items-end">
              <span className="text-green-800 text-xl font-bold">{results.meta.elapsed_ms}</span>
              <span className="text-green-600 ml-1 text-sm">ms</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 shadow-sm transform transition-all duration-300 hover:scale-105 animate-fadeIn flex flex-col justify-between" style={{ animationDelay: '1.8s' }}>
            <div className="flex items-center mb-2">
              <div className='mr-2'>
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700 overflow-hidden text-ellipsis">Temperature</span>
            </div>
            <div className="flex items-center">
              <div className="w-full bg-purple-200 rounded-full h-2.5 mr-2">
                <div className="bg-purple-600 h-2.5 rounded-full animate-widthGrow" style={{ width: `${results.meta.temperature * 100}%`, animationDelay: '2s' }}></div>
              </div>
              <span className="text-purple-800 font-bold">{results.meta.temperature}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-gray-500 animate-fadeIn" style={{ animationDelay: '2s' }}>
          <p className="flex items-center">
            {/* <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg> */}
            Analysis performed using OpenAI's advanced AI models with optimized parameters for contractor matching.
          </p>
        </div>
      </div>
    </div>
  );
}
