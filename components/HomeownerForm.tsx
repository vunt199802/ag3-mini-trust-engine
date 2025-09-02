'use client';

import { useState } from 'react';
import { Homeowner } from '@/types';

interface HomeownerFormProps {
  onSubmit: (homeowner: Homeowner) => void;
  isLoading: boolean;
}

export default function HomeownerForm({ onSubmit, isLoading }: HomeownerFormProps) {
  const [homeowner, setHomeowner] = useState<Homeowner>({
    city: "Salt Lake City",
    project_type: "roofing",
    notes: "I value experience and warranty over price. Prefer bids under 3 weeks.",
    weights: {
      experience: 0.4,
      reviews: 0.25,
      rating: 0.2,
      price: 0.1,
      speed: 0.05
    }
  });

  const handleWeightChange = (key: keyof typeof homeowner.weights, value: number) => {
    setHomeowner(prev => ({
      ...prev,
      weights: {
        ...prev.weights,
        [key]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(homeowner);
  };

  const totalWeight = Object.values(homeowner.weights).reduce((sum, weight) => sum + weight, 0);
  const isWeightValid = Math.abs(totalWeight - 1.0) < 0.01;

  return (
    <div className="bg-white/30 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-xl p-6 border border-white/20 dark:border-gray-700/30 transform transition-all duration-500 hover:shadow-2xl animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 animate-slideDown">Homeowner Preferences</h2>

      <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* City Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              City
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={homeowner.city}
                onChange={(e) => setHomeowner(prev => ({ ...prev, city: e.target.value }))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:!text-gray-300 bg-white dark:bg-gray-700 shadow-sm transition-all duration-200 hover:border-blue-300"
                required
                placeholder="Enter city name"
              />
            </div>
          </div>

          {/* Project Type Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Project Type
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <select
                value={homeowner.project_type}
                onChange={(e) => setHomeowner(prev => ({ ...prev, project_type: e.target.value }))}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:!text-gray-300 bg-white dark:bg-gray-700 shadow-sm transition-all duration-200 hover:border-blue-300 appearance-none"
              >
                <option value="roofing">Roofing</option>
                <option value="siding">Siding</option>
                <option value="handyman">Handyman</option>
                <option value="plumbing">Plumbing</option>
                <option value="electrical">Electrical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Project Notes Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Project Notes
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 flex items-start pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <textarea
              value={homeowner.notes}
              onChange={(e) => setHomeowner(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:!text-gray-300 bg-white dark:bg-gray-700 shadow-sm transition-all duration-200 hover:border-blue-300"
              placeholder="Describe your project requirements, timeline, and preferences..."
            />
          </div>
        </div>

        {/* Priority Weights Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Priority Weights</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Adjust the importance of each factor (total must equal 1.0)
          </p>
          
          <div className="space-y-4">
            {Object.entries(homeowner.weights).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-4">
                <label className="w-24 text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                  {key}:
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={value}
                  onChange={(e) => handleWeightChange(key as keyof typeof homeowner.weights, parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
                <span className="w-12 text-sm text-gray-600 dark:text-gray-400 text-right">
                  {value.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 rounded-md bg-[#f0f9ff] dark:bg-gray-800/30">
            <p className={`text-sm font-medium ${
              isWeightValid 
                ? 'text-blue-800 dark:text-blue-300' 
                : 'text-red-800 dark:text-red-300'
            }`}>
              Total Weight: {totalWeight.toFixed(2)} {isWeightValid ? '✓' : '✗'}
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isWeightValid || isLoading}
          className={`w-full py-3 px-4 rounded-md font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] animate-pulse-subtle ${
            !isWeightValid || isLoading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed animate-none'
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Finding Your Top 3 Matches...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              Get My 3 Options
              <svg className="ml-2 h-5 w-5 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </span>
          )}
        </button>
      </form>
    </div>
  );
}