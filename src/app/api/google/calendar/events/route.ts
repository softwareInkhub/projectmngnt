import { NextRequest, NextResponse } from 'next/server';
import { apiService } from '../../../../utils/apiService';

interface CalendarDateTime {
  dateTime: string;
  timeZone?: string;
}

interface CreateEventBody {
  title: string;
  description?: string;
  location?: string;
  // Accept either plain RFC3339 strings or objects with timezone
  start: string | CalendarDateTime;
  end: string | CalendarDateTime;
  externalId?: string;
  attendees?: { email: string; optional?: boolean }[];
  userId?: string;
}

const TOKEN_TABLE = 'project-management-calendar';

async function refreshAccessToken(refreshToken: string) {
  const client_id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string | undefined;
  const client_secret = process.env.GOOGLE_CLIENT_SECRET as string | undefined;
  if (!client_id || !client_secret) {
    throw new Error('Server missing Google credentials');
  }

  const params = new URLSearchParams({
    client_id,
    client_secret,
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to refresh token: ${text}`);
  }
  return res.json() as Promise<{ access_token: string; expires_in?: number; scope?: string; token_type?: string }>;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CreateEventBody;
    const { title, description, location, start, end, externalId, attendees, userId } = body || {};

    if (!title || !start || !end) {
      return NextResponse.json({ error: 'Missing required fields: title, start, end' }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId to find Google credentials' }, { status: 400 });
    }

    // Load stored tokens
    const tokenRes = await apiService.getItem<any>(TOKEN_TABLE, userId);
    if (!tokenRes.success || !tokenRes.data) {
      return NextResponse.json({ error: 'Google not connected', needsConnect: true }, { status: 401 });
    }
    let { access_token, refresh_token: refreshToken, expiry_date } = tokenRes.data as { access_token?: string; refresh_token?: string; expiry_date?: number | null };

    if (!refreshToken && !access_token) {
      return NextResponse.json({ error: 'Google not connected', needsConnect: true }, { status: 401 });
    }

    const now = Date.now();
    const isExpired = !access_token || (typeof expiry_date === 'number' && expiry_date <= now + 60_000);
    if (isExpired && refreshToken) {
      try {
        const refreshed = await refreshAccessToken(refreshToken);
        access_token = refreshed.access_token;
        const newExpiry = refreshed.expires_in ? now + refreshed.expires_in * 1000 : null;
        // Persist updated tokens
        await apiService.updateItem<any>(TOKEN_TABLE, userId, {
          access_token,
          expiry_date: newExpiry,
          scope: refreshed.scope,
        });
      } catch (e) {
        return NextResponse.json({ error: 'Token refresh failed', details: (e as Error).message }, { status: 401 });
      }
    }

    if (!access_token) {
      return NextResponse.json({ error: 'No valid access token' }, { status: 401 });
    }

    // Normalize start/end into Google format
    const normalize = (v: string | CalendarDateTime) => {
      if (typeof v === 'string') return { dateTime: v } as CalendarDateTime;
      return { dateTime: v.dateTime, timeZone: v.timeZone } as CalendarDateTime;
    };

    const payloadStart = normalize(start);
    const payloadEnd = normalize(end);

    // Create the Calendar event via Google API
    const eventPayload: Record<string, any> = {
      summary: title,
      description,
      location,
      start: payloadStart,
      end: payloadEnd,
      attendees: attendees?.map(a => ({ email: a.email, optional: !!a.optional })),
      extendedProperties: externalId ? { private: { externalId } } : undefined,
    };

    const createRes = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(eventPayload),
    });

    const createText = await createRes.text();
    let eventJson: any = null;
    try {
      eventJson = JSON.parse(createText);
    } catch {
      return NextResponse.json({ error: 'Invalid Google response', raw: createText }, { status: 502 });
    }

    if (!createRes.ok) {
      return NextResponse.json({ error: 'Google API error', details: eventJson }, { status: createRes.status });
    }

    return NextResponse.json({
      googleEventId: eventJson.id,
      status: eventJson.status,
      link: eventJson.htmlLink,
    });
  } catch (e: any) {
    return NextResponse.json({ error: 'unexpected_error', message: e?.message || 'Unknown error' }, { status: 500 });
  }
}



