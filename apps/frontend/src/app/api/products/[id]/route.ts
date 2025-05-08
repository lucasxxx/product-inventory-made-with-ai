import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const backendRes = await fetch(`${process.env.BACKEND_URL}/products/${params.id}`);
  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const backendRes = await fetch(`${process.env.BACKEND_URL}/products/${params.id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Transform the data to ensure it matches the expected format
    const transformedBody = {
      ...body,
      price: typeof body.price === 'string' ? parseFloat(body.price) : body.price,
      quantity: typeof body.quantity === 'string' ? parseInt(body.quantity, 10) : body.quantity,
      isActive: body.isActive ?? true,
    };

    console.log('Updating product:', { id: params.id, body: transformedBody });

    const backendRes = await fetch(`${process.env.BACKEND_URL}/products/${params.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Cookie': `token=${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(transformedBody),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      console.error('Backend update error:', {
        status: backendRes.status,
        statusText: backendRes.statusText,
        data,
      });
      return NextResponse.json(
        { message: data.message || 'Failed to update product' },
        { status: backendRes.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Update product error:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { message: 'An error occurred while updating the product' },
      { status: 500 }
    );
  }
} 