import { Contractor } from '@/types';

export const SAMPLE_CONTRACTORS: Contractor[] = [
  {
    "id": "c1",
    "name": "NorthPeak Roofing",
    "vertical": "roofing",
    "years_in_business": 18,
    "rating": 4.7,
    "review_count": 312,
    "service_area": "Salt Lake City",
    "pricing_band": "",
    "licenses": ["UT-ROOF-44121"],
    "flags": []
  },
  {
    "id": "c2",
    "name": "Beehive Home Repair",
    "vertical": "handyman",
    "years_in_business": 6,
    "rating": 4.4,
    "review_count": 128,
    "service_area": "Salt Lake City",
    "pricing_band": "$$",
    "licenses": ["UT-GEN-99812"],
    "flags": ["limited_roofing_experience"]
  },
  {
    "id": "c3",
    "name": "Wasatch Elite Exteriors",
    "vertical": "siding",
    "years_in_business": 12,
    "rating": 4.8,
    "review_count": 205,
    "service_area": "Salt Lake City",
    "pricing_band": "",
    "licenses": ["UT-EXT-77421"],
    "flags": ["premium_pricing"]
  },
  {
    "id": "c4",
    "name": "Granite Peak Roofing Co.",
    "vertical": "roofing",
    "years_in_business": 9,
    "rating": 4.5,
    "review_count": 164,
    "service_area": "Salt Lake City",
    "pricing_band": "$$",
    "licenses": ["UT-ROOF-55210"],
    "flags": []
  },
  {
    "id": "c5",
    "name": "QuickFix Pros",
    "vertical": "roofing",
    "years_in_business": 3,
    "rating": 4.2,
    "review_count": 59,
    "service_area": "Salt Lake City",
    "pricing_band": "$",
    "licenses": ["UT-ROOF-12003"],
    "flags": ["newer_company"]
  }
];

export const DEFAULT_HOMEOWNER = {
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
};
