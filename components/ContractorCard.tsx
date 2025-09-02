import { ContractorMatch } from '@/types';
import { useEffect, useRef } from 'react';

interface ContractorCardProps {
  match: ContractorMatch;
  rank: number;
}

export default function ContractorCard({ match, rank }: ContractorCardProps) {
  const scoreBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (scoreBarRef.current) {
        scoreBarRef.current.style.width = `${match.trust_score}%`;
      }
    }, 500 + rank * 300);

    return () => clearTimeout(timer);
  }, [match.trust_score, rank]);
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 dark:border-yellow-500';
      case 2: return 'border-gray-300 bg-gray-50 dark:bg-gray-800/50 dark:border-gray-600';
      case 3: return 'border-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:border-amber-700';
      default: return 'border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '⭐';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/50';
    return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/50';
  };

  return (
    <div className={`border-2 rounded-lg p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] backdrop-blur-sm ${getRankColor(rank)}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className={`text-2xl transform transition-all duration-300 ${rank === 1 ? 'animate-bounce' : ''}`}>{getRankIcon(rank)}</span>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{match.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 animate-fadeIn" style={{ animationDelay: '0.8s' }}>
              {rank === 1 ? 'Best Match!' : rank === 2 ? 'Great Option' : 'Good Choice'}
            </p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(match.trust_score)}`}>
          {match.trust_score.toFixed(1)}
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{match.reason}</p>
      </div>
      
      <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>Trust Score</span>
        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            ref={scoreBarRef}
            className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-out origin-left"
            style={{ width: '0%' }}
          ></div>
        </div>
      </div>
    </div>
  );
}
