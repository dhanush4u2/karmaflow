import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

// Interface for the detailed data coming from the multi-step form
interface OnboardingData {
  userId: string;
  electricityUsageKwh: number;
  fuelConsumptionLiters: number;
  waterUsageKl: number;
  wasteGeneratedTons: number;
  rawMaterialsDetails: string;
  employeeTravelKm: number;
  productionOutputDetails: string;
}

// The expected JSON response format from the Gemini API
interface GeminiResponse {
  estimatedEmissions: number;
  initialCredits: number;
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

    // 1. Craft the new, more detailed prompt for the Gemini API
    const prompt = `
      You are an expert carbon footprint analyst for industrial facilities in India. 
      Based on the following average monthly operational data for a new user, your task is to:
      1. Estimate their total monthly carbon footprint in tCO₂e (tonnes of CO₂ equivalent). Use conservative, region-specific Indian industry emission factors.
      2. Recommend an initial allocation of carbon credits. This allocation serves as a baseline. Companies with lower initial emissions should be rewarded with a slightly higher credit balance (e.g., 50-100) to encourage their good standing. Companies with higher emissions should receive a lower balance (e.g., 10-40) to incentivize immediate reduction efforts.
      3. Provide a brief, one-sentence justification for your analysis and credit allocation.

      User's Monthly Data:
      - Electricity Usage: ${consumptionData.electricityUsageKwh || 0} kWh
      - Fuel Consumption (Diesel/LPG assumed): ${consumptionData.fuelConsumptionLiters || 0} Liters
      - Water Usage: ${consumptionData.waterUsageKl || 0} Kiloliters
      - Solid Waste Generated: ${consumptionData.wasteGeneratedTons || 0} Tons
      - Key Raw Materials: ${consumptionData.rawMaterialsDetails || 'Not provided'}
      - Employee Travel / Logistics: ${consumptionData.employeeTravelKm || 0} km
      - Primary Production Output: ${consumptionData.productionOutputDetails || 'Not provided'}

      Provide your response ONLY in a valid JSON format, with no other text, explanation, or markdown. The JSON object must have exactly these three keys: "estimatedEmissions" (number), "initialCredits" (integer), and "reasoning" (string).
      Example: {"estimatedEmissions": 75.2, "initialCredits": 60, "reasoning": "The allocation is based on moderate electricity consumption but significant fuel usage, offering a balanced starting point."}
    `;

    // 2. Call the Gemini API
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    if (!geminiResponse.ok) {
      const errorBody = await geminiResponse.text();
      throw new Error(`Failed to get AI analysis: ${errorBody}`);
    }

    const result = await geminiResponse.json();
    const generatedText = result.candidates[0].content.parts[0].text;
    const aiData: GeminiResponse = JSON.parse(generatedText.match(/\{[\s\S]*\}/)![0]);

    // 3. Store the raw submission and the AI analysis for auditing
    await supabaseAdmin
      .from('onboarding_submissions')
      .insert({
        user_id: userId,
        electricity_usage_kwh: consumptionData.electricityUsageKwh,
        fuel_consumption_liters: consumptionData.fuelConsumptionLiters,
        water_usage_kl: consumptionData.waterUsageKl,
        waste_generated_tons: consumptionData.wasteGeneratedTons,
        raw_materials_details: consumptionData.rawMaterialsDetails,
        employee_travel_km: consumptionData.employeeTravelKm,
        production_output_details: consumptionData.productionOutputDetails,
        ai_estimated_emissions: aiData.estimatedEmissions,
        ai_allocated_credits: aiData.initialCredits,
        ai_reasoning: aiData.reasoning
      })
      .throwOnError();

    // 4. Update the user's main metrics table with the initial values
    await supabaseAdmin
      .from('dashboard_metrics')
      .update({ 
        available_credits: aiData.initialCredits,
        total_ghg_emissions: aiData.estimatedEmissions,
        last_month_ghg_emissions: aiData.estimatedEmissions
      })
      .eq('id', userId)
      .throwOnError();

    // 5. Mark the user's onboarding as complete in their profile
    // Note: I'm assuming the column is `onboarding_completed`. Adjust if it is `onboarding_complete` as in your function.
    await supabaseAdmin
      .from('profiles')
      .update({ onboarding_completed: true }) 
      .eq('id', userId)
      .throwOnError();

    return new Response(JSON.stringify({ message: "Onboarding complete!", initialCredits: aiData.initialCredits }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("Critical error in onboarding function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});