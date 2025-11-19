import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();
    // Usar remove.bg API
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': process.env.REMOVE_BG_API_KEY || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_url: imageUrl,
        size: 'auto',
        format: 'png',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to process image');
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