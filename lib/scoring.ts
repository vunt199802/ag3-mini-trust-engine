import { Contractor, Homeowner, NormalizedContractor } from '@/types';

export function normalizeContractorAttributes(contractor: Contractor, homeowner: Homeowner): NormalizedContractor {
  // Normalize years in business (0-20+ years -> 0-100)
  const experienceScore = Math.min(contractor.years_in_business * 5, 100);
  
  // Normalize review count (0-500+ reviews -> 0-100)
  const reviewsScore = Math.min((contractor.review_count / 5), 100);
  
  // Normalize rating (1-5 stars -> 0-100)
  const ratingScore = ((contractor.rating - 1) / 4) * 100;
  
  // Normalize pricing band ($ = 100, $$ = 75, $$$ = 50, $$$$ = 25, empty = 50)
  const pricingMap: { [key: string]: number } = {
    '$': 100,
    '$$': 75,
    '$$$': 50,
    '$$$$': 25,
    '': 50
  };
  const priceScore = pricingMap[contractor.pricing_band] || 50;
  
  // Speed score based on flags and experience (newer companies might be faster)
  let speedScore = 50; // default
  if (contractor.flags.includes('newer_company')) {
    speedScore = 80; // newer companies often have more availability
  } else if (contractor.years_in_business > 15) {
    speedScore = 40; // established companies might be busier
  } else {
    speedScore = 60; // moderate experience, good availability
  }
  
  // Apply homeowner weights
  const weightedScore = 
    (experienceScore * homeowner.weights.experience) +
    (reviewsScore * homeowner.weights.reviews) +
    (ratingScore * homeowner.weights.rating) +
    (priceScore * homeowner.weights.price) +
    (speedScore * homeowner.weights.speed);
  
  return {
    ...contractor,
    normalized_scores: {
      experience: experienceScore,
      reviews: reviewsScore,
      rating: ratingScore,
      price: priceScore,
      speed: speedScore
    },
    weighted_score: weightedScore
  };
}

export function filterRelevantContractors(contractors: Contractor[], projectType: string): Contractor[] {
  // Filter contractors based on project type and relevant verticals
  const relevantVerticals = [projectType, 'handyman']; // handyman can do most projects
  
  return contractors.filter(contractor => {
    // Direct match on vertical
    if (contractor.vertical === projectType) return true;
    
    // Handyman can do most projects
    if (contractor.vertical === 'handyman') return true;
    
    // For roofing projects, siding companies might also be relevant
    if (projectType === 'roofing' && contractor.vertical === 'siding') return true;
    
    return false;
  });
}
