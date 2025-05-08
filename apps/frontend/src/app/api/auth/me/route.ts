import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  // Read the token cookie from the incoming request
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  const res = await fetch(`${process.env.BACKEND_URL}/auth/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Cookie: `token=${token}` } : {}),
    },
  });

  if (!res.ok) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const data = await res.json();
  return NextResponse.json(data);
} 