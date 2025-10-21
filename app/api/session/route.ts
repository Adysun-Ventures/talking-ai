import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(_req: NextRequest) {
  try {
    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const resp = await fetch('https://api.openai.com/v1/realtime/client_secrets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'realtime=v1', // IMPORTANT
      },
      // Use GA model (`gpt-realtime`). You can also set voice or instructions here.
      body: JSON.stringify({
        model: 'gpt-realtime',
        // optional extras:
        // voice: 'verse',
        // instructions: 'You are a helpful real-time voice assistant.'
      }),
    });

    // Better error logging before returning 500
    if (!resp.ok) {
      const text = await resp.text().catch(() => '');
      console.error('OpenAI client_secret creation failed', {
        status: resp.status,
        statusText: resp.statusText,
        body: text,
      });
      return NextResponse.json(
        { error: 'Failed to create ephemeral token', details: text || resp.statusText },
        { status: 500 }
      );
    }

    const data = await resp.json();

    // Shape per current docs/examples:
    // { client_secret: { value: string, expires_at: string/ISO } }
    const token = data?.client_secret?.value;
    const expiresAt = data?.client_secret?.expires_at;

    if (!token) {
      console.error('Unexpected OpenAI response shape', data);
      return NextResponse.json(
        { error: 'Unexpected response from OpenAI' },
        { status: 500 }
      );
    }

    // Keep the response simple for your client
    return NextResponse.json({
      token,
      // Ephemeral key TTL is ~60s. Use OpenAI's provided expiry if present.
      expires_at: expiresAt ?? new Date(Date.now() + 60_000).toISOString(),
    });
  } catch (err: any) {
    console.error('Error creating session:', err?.stack || err);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}
