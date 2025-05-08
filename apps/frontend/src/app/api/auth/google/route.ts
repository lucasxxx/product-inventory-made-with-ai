import { NextResponse } from 'next/server';

export async function GET() {
  const backendUrl = process.env.BACKEND_URL;
  return NextResponse.redirect(`${backendUrl}/auth/google`);
} 