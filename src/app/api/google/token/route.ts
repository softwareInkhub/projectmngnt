import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { code, redirect_uri, code_verifier } = await req.json();
    const client_id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const client_secret = process.env.GOOGLE_CLIENT_SECRET;

    if (!client_id || !client_secret) {
      return NextResponse.json({ error: 'Server missing Google credentials' }, { status: 500 });
    }

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri,
      client_id,
      client_secret,
      code_verifier,
    });

    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    const text = await res.text();
    try {
      const json = JSON.parse(text);
      if (!res.ok) {
        return NextResponse.json(json, { status: res.status });
      }
      return NextResponse.json(json);
    } catch {
      return NextResponse.json({ error: 'invalid_response', raw: text }, { status: res.status });
    }
  } catch (e: any) {
    return NextResponse.json({ error: 'unexpected_error', message: e?.message || 'Unknown error' }, { status: 500 });
  }
}


