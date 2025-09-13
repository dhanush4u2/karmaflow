// Path: supabase/functions/calculate-initial-credits/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface OnboardingData {
  userId: string;
  electricityKwh: number;
  fuelLiters: number;
  waterLiters: number;
  wasteKg: number;
  rawMaterialTons: number;
  transportKm: number;
  flightsPerYear: number;
  productionUnits: number;
}

interface GeminiResponse {
  estimated_emissions_tco2e: number;
  initial_credits_allocation: number;
  reasoning: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId, ...consumptionData }: OnboardingData = await req.json();
    if (!userId) throw new Error("User ID is required.");

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    await supabaseAdmin
      .from('onboarding_submissions')
      .insert({
        user_id: userId,
        submission_data: consumptionData
      })
      .throwOnError();

    const prompt = `
      You are an expert carbon footprint analyst for industrial facilities in India. 
      Based on the following average monthly operational data for a new user, your task is to:
      1. Estimate their total monthly carbon footprint in tCO₂e. Use conservative, region-specific Indian industry emission factors.
      2. Recommend an initial allocation of carbon credits as a baseline.
      3. Provide a brief, one-sentence justification for your analysis.

      User's Monthly Data:
      - Electricity Usage: ${consumptionData.electricityKwh || 0} kWh
      - Fuel Consumption: ${consumptionData.fuelLiters || 0} Liters
      - Water Usage: ${consumptionData.waterLiters || 0} Liters
      - Solid Waste Generated: ${consumptionData.wasteKg || 0} kg
      - Key Raw Materials: ${consumptionData.rawMaterialTons || 0} Tons
      - Logistics Fleet Travel: ${consumptionData.transportKm || 0} km
      - Annual Business Flights: ${consumptionData.flightsPerYear || 0}
      - Primary Production Output: ${consumptionData.productionUnits || 0} units

      Provide your response ONLY in a valid JSON format, with no other text.
      The JSON object must have three keys: "estimated_emissions_tco2e" (number), "initial_credits_allocation" (integer), and "reasoning" (string).
      Example: {"estimated_emissions_tco2e": 75.2, "initial_credits_allocation": 60, "reasoning": "Allocation based on moderate electricity consumption and standard industrial benchmarks."}
    `;

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) throw new Error("GEMINI_API_KEY is not set.");

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    if (!geminiResponse.ok) throw new Error("Failed to get AI analysis.");

    const result = await geminiResponse.json();
    const generatedText = result.candidates[0].content.parts[0].text;
    const aiData: GeminiResponse = JSON.parse(generatedText.match(/\{[\s\S]*\}/)![0]);

    await supabaseAdmin
      .from('dashboard_metrics')
      .update({ 
        available_credits: aiData.initial_credits_allocation,
        total_ghg_emissions: aiData.estimated_emissions_tco2e,
        last_month_ghg_emissions: aiData.estimated_emissions_tco2e
      })
      .eq('id', userId)
      .throwOnError();

    await supabaseAdmin
      .from('profiles')
      .update({ onboarding_completed: true })
      .eq('id', userId)
      .throwOnError();

    return new Response(JSON.stringify({ 
      message: "Onboarding complete!", 
      initialCredits: aiData.initial_credits_allocation 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});