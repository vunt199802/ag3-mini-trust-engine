import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ScoreRequest, ScoreResponse, ContractorMatch } from '@/types';
import { normalizeContractorAttributes, filterRelevantContractors } from '@/lib/scoring';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    console.log('API /score called');
    
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.log('OpenAI API key not found in environment variables');
      return NextResponse.json(
        { error: 'OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable.' },
        { status: 500 }
      );
    }
    
    console.log('OpenAI API key found, proceeding with request');

    const body: ScoreRequest = await request.json();
    console.log('Request body parsed successfully');
    
    const { homeowner, contractors } = body;

    // Validate request
    if (!homeowner || !contractors || !Array.isArray(contractors)) {
      console.log('Invalid request format:', { homeowner: !!homeowner, contractors: !!contractors, isArray: Array.isArray(contractors) });
      return NextResponse.json(
        { error: 'Invalid request format. Expected homeowner and contractors array.' },
        { status: 400 }
      );
    }
    
    console.log('Request validation passed, processing contractors');

    // Filter contractors relevant to the project type
    const relevantContractors = filterRelevantContractors(contractors, homeowner.project_type);
    
    if (relevantContractors.length === 0) {
      return NextResponse.json(
        { error: 'No contractors found for the specified project type.' },
        { status: 400 }
      );
    }

    // Normalize and score contractors
    const normalizedContractors = relevantContractors.map(contractor => 
      normalizeContractorAttributes(contractor, homeowner)
    );

    // Sort by weighted score (highest first)
    normalizedContractors.sort((a, b) => b.weighted_score - a.weighted_score);

    // Take top 5 for AI processing
    const topCandidates = normalizedContractors.slice(0, 5);

    // Prepare data for OpenAI
    const contractorData = topCandidates.map(contractor => ({
      id: contractor.id,
      name: contractor.name,
      vertical: contractor.vertical,
      years_in_business: contractor.years_in_business,
      rating: contractor.rating,
      review_count: contractor.review_count,
      pricing_band: contractor.pricing_band,
      flags: contractor.flags,
      weighted_score: contractor.weighted_score,
      normalized_scores: contractor.normalized_scores
    }));

    // Create prompt for OpenAI
    const prompt = `You are an expert contractor matching system. Based on the homeowner's preferences and contractor data, provide the top 3 matches with trust scores (0-100) and one-line reasons.

Homeowner Preferences:
- City: ${homeowner.city}
- Project Type: ${homeowner.project_type}
- Notes: ${homeowner.notes}
- Weights: Experience ${homeowner.weights.experience}, Reviews ${homeowner.weights.reviews}, Rating ${homeowner.weights.rating}, Price ${homeowner.weights.price}, Speed ${homeowner.weights.speed}

Contractor Data:
${JSON.stringify(contractorData, null, 2)}

Instructions:
1. Select the top 3 contractors based on the homeowner's preferences
2. Adjust the weighted scores by ±5 points based on qualitative factors
3. Provide a one-line reason for each selection
4. Ensure trust scores are between 0-100
5. Consider the homeowner's specific notes and preferences

CRITICAL: You must respond with ONLY valid JSON. No explanations, no markdown, no code blocks. Just the raw JSON object.

Example response format:
{"top3":[{"id":"c1","name":"Contractor Name","trust_score":85.5,"reason":"One-line explanation"}]}`;

    // Call OpenAI
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    console.log('Calling OpenAI with model:', model);
    
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are an expert contractor matching system. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 1000
    });
    
    console.log('OpenAI API call completed successfully');

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    console.log('Raw OpenAI response:', responseText);

    // Parse OpenAI response - handle cases where JSON might be wrapped in markdown
    let aiResponse;
    try {
      // First try to parse as-is
      aiResponse = JSON.parse(responseText);
    } catch (parseError) {
      console.log('Direct parsing failed, trying to extract JSON from response');
      
      // Try to extract JSON from markdown code blocks
      const jsonMatch = responseText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      if (jsonMatch) {
        try {
          aiResponse = JSON.parse(jsonMatch[1]);
        } catch (secondParseError) {
          console.error('Failed to parse extracted JSON:', jsonMatch[1]);
          throw new Error('Invalid JSON format in code block');
        }
      } else {
        // Try to find JSON object in the response
        const jsonObjectMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonObjectMatch) {
          try {
            aiResponse = JSON.parse(jsonObjectMatch[0]);
          } catch (thirdParseError) {
            console.error('Failed to parse found JSON object:', jsonObjectMatch[0]);
            throw new Error('Invalid JSON object format');
          }
        } else {
          console.error('No JSON found in response:', responseText);
          throw new Error('No valid JSON found in AI response');
        }
      }
    }

    // Validate AI response structure
    if (!aiResponse.top3 || !Array.isArray(aiResponse.top3) || aiResponse.top3.length === 0) {
      console.error('Invalid AI response structure:', aiResponse);
      throw new Error('Invalid AI response structure - missing or empty top3 array');
    }

    // Ensure we have exactly 3 results
    const top3: ContractorMatch[] = aiResponse.top3.slice(0, 3).map((match: any, index: number) => {
      // Validate each match has required fields
      if (!match.id || !match.name) {
        console.error(`Invalid match at index ${index}:`, match);
        throw new Error(`Invalid match structure at index ${index}`);
      }
      
      return {
        id: match.id,
        name: match.name,
        trust_score: Math.max(0, Math.min(100, match.trust_score || 0)),
        reason: match.reason || 'Good match based on preferences'
      };
    });

    const elapsedMs = Date.now() - startTime;

    const response: ScoreResponse = {
      top3,
      meta: {
        model,
        temperature: 0.2,
        elapsed_ms: elapsedMs
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error in /api/score:', error);
    
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      if (error.message.includes('API key') || error.message.includes('authentication')) {
        return NextResponse.json(
          { error: 'Invalid OpenAI API key. Please check your configuration.' },
          { status: 401 }
        );
      }
      
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'OpenAI API rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
      
      if (error.message.includes('quota') || error.message.includes('billing')) {
        return NextResponse.json(
          { error: 'OpenAI API quota exceeded. Please check your billing.' },
          { status: 402 }
        );
      }
      
      // Return the actual error message for debugging
      return NextResponse.json(
        { 
          error: 'Internal server error. Please try again later.',
          details: error.message 
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
