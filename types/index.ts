export interface Contractor {
  id: string;
  name: string;
  vertical: string;
  years_in_business: number;
  rating: number;
  review_count: number;
  service_area: string;
  pricing_band: string;
  licenses: string[];
  flags: string[];
}

export interface HomeownerWeights {
  experience: number;
  reviews: number;
  rating: number;
  price: number;
  speed: number;
}

export interface Homeowner {
  city: string;
  project_type: string;
  notes: string;
  weights: HomeownerWeights;
}

export interface ScoreRequest {
  homeowner: Homeowner;
  contractors: Contractor[];
}

export interface ContractorMatch {
  id: string;
  name: string;
  trust_score: number;
  reason: string;
}

export interface ScoreResponse {
  top3: ContractorMatch[];
  meta: {
    model: string;
    temperature: number;
    elapsed_ms: number;
  };
}

export interface NormalizedContractor extends Contractor {
  normalized_scores: {
    experience: number;
    reviews: number;
    rating: number;
    price: number;
    speed: number;
  };
  weighted_score: number;
}
