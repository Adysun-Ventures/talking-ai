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

