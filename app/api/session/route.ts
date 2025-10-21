import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Generate ephemeral client secret using OpenAI's official endpoint
    const response = await fetch('https://api.openai.com/v1/realtime/client_secrets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session: {
          type: 'realtime',
          model: 'gpt-4o-realtime-preview-2024-10-01'
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to create ephemeral token: ${response.statusText}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      id: 'session_' + Date.now(),
      token: data.value, // This is the ephemeral key starting with 'ek_'
      expires_at: Date.now() + (60 * 60 * 1000), // 1 hour from now
    });
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}
