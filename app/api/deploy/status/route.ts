import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const token = req.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Vercel API token is required' }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: 'Deployment ID is required' }, { status: 400 });
    }

    const response = await fetch(`https://api.vercel.com/v13/deployments/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || 'Failed to fetch deployment status' }, { status: response.status });
    }

    return NextResponse.json({
      readyState: data.readyState,
      url: data.url,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
