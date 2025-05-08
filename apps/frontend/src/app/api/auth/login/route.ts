import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const backendRes = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    credentials: 'include', // important for cookies
  });

  const data = await backendRes.json();
  const response = NextResponse.json(data, { status: backendRes.status });

  // Forward Set-Cookie header
  const setCookie = backendRes.headers.get('set-cookie');
  if (setCookie) {
    response.headers.set('set-cookie', setCookie);
  }

  return response;
} 