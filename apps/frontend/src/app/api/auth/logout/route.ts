import { NextResponse } from 'next/server';

export async function POST() {
  const backendRes = await fetch(`${process.env.BACKEND_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const response = NextResponse.json({ success: true });
  // Forward Set-Cookie header to clear the cookie
  const setCookie = backendRes.headers.get('set-cookie');
  if (setCookie) {
    response.headers.set('set-cookie', setCookie);
  }
  return response;
} 