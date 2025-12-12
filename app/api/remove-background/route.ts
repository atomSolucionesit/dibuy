import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();
    
    console.log('Processing image URL:', imageUrl);
    
    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    if (!process.env.NEXT_PUBLIC_REMOVE_BG_API_KEY) {
      console.error('API key not found in environment variables');
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    // Verificar si la URL es válida y accesible
    if (imageUrl.includes('placeholder.svg') || imageUrl.startsWith('/')) {
      console.log('Skipping placeholder or relative URL:', imageUrl);
      return NextResponse.json({ error: 'Invalid URL for processing' }, { status: 400 });
    }

    console.log('Sending request to remove.bg API...');
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': process.env.NEXT_PUBLIC_REMOVE_BG_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_url: imageUrl,
        size: 'auto',
        format: 'png',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Remove.bg API error:', response.status, errorText);
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const imageBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    const processedImageUrl = `data:image/png;base64,${base64Image}`;

    return NextResponse.json({ processedImageUrl });
  } catch (error) {
    console.error('Background removal error:', error);
    return NextResponse.json(
      { error: 'Failed to remove background' },
      { status: 500 }
    );
  }
}