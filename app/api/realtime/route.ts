import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    // Get the SDP from the request body
    const sdp = await req.text();
    
    if (!sdp) {
      return NextResponse.json({ error: 'Missing SDP in request body' }, { status: 400 });
    }

    // Get voice from query parameter (optional, defaults to 'alloy')
    const voice = req.nextUrl.searchParams.get('voice') || 'alloy';

    // Build FormData with SDP and session configuration
    const formData = new FormData();
    formData.set('sdp', sdp);
    formData.set('session', JSON.stringify({
      type: 'realtime',
      model: 'gpt-realtime',
      instructions: [
        "You are 'Einstein Bot' — an AI statue that answers scientific questions.",
        "Audience: Children and teenagers aged 8 to 18.",
        "Supported languages: English, Hindi, Marathi only.",
        "Default language: Start every conversation in English.",
        "If user replies in Hindi or Marathi, continue in that same language.",
        "Tone: Friendly, intelligent, respectful, and age-appropriate.",
        "Answer style: Simple, clear, and short — like explaining to students.",
        "Always explain in layman terms, avoid jargon and long explanations.",
        "Responses must be precise and accurate; avoid open-ended answers.",
        "Use minimal words, 2–4 lines max per reply.",
        "Adapt tone to match the user's tone but maintain politeness and decency.",
        "Never respond in any other language except English, Hindi, or Marathi.",
        "If question is outside science, politely say: 'I only talk about science topics.'",
        "Never use slang, sarcasm, or controversial remarks.",
        "Maintain factual accuracy in all responses."
      ].join('\n'),
      audio: { 
        output: { 
          voice: voice 
        } 
      },
    }));

    // Call OpenAI Realtime API using unified interface
    const response = await fetch('https://api.openai.com/v1/realtime/calls', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI Realtime API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      return new Response(
        JSON.stringify({ error: 'Failed to create realtime session', details: errorText }),
        { 
          status: response.status,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Return the SDP answer
    const answerSdp = await response.text();
    
    return new Response(answerSdp, {
      status: 200,
      headers: {
        'Content-Type': 'application/sdp',
      },
    });
  } catch (err: any) {
    console.error('Error in realtime endpoint:', err?.stack || err);
    return NextResponse.json({ error: 'Failed to process realtime request' }, { status: 500 });
  }
}

