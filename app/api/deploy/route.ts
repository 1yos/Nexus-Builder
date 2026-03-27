import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, projectName, files } = body;

    if (!token) {
      return NextResponse.json({ error: 'Vercel API token is required' }, { status: 401 });
    }

    if (!projectName) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }

    if (!files || typeof files !== 'object') {
      return NextResponse.json({ error: 'Files are required' }, { status: 400 });
    }

    // Convert Record<string, string> to Vercel API format
    const vercelFiles = Object.entries(files).map(([file, data]) => ({
      file,
      data: data as string,
    }));

    // Create deployment
    const response = await fetch('https://api.vercel.com/v13/deployments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: projectName,
        files: vercelFiles,
        projectSettings: {
          framework: 'nextjs',
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Vercel API error:', data);
      return NextResponse.json({ error: data.error?.message || 'Failed to deploy to Vercel' }, { status: response.status });
    }

    return NextResponse.json({
      url: data.url,
      id: data.id,
      readyState: data.readyState,
    });
  } catch (error: any) {
    console.error('Deploy error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
