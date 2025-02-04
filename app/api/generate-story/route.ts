import { NextResponse } from 'next/server';
import { generateStory } from '@/app/lib/groq';

export async function POST(request: Request) {
  try {
    const { videoData, storyOptions } = await request.json();
    
    if (!videoData || !storyOptions) {
      return NextResponse.json(
        { error: 'Video data and story options are required' },
        { status: 400 }
      );
    }

    const story = await generateStory(videoData, `${storyOptions.genre} ${storyOptions.format} with a ${storyOptions.tone} tone in ${storyOptions.style} style`);
    
    return NextResponse.json({ story });
  } catch (error) {
    console.error('Error generating story:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate story' },
      { status: 500 }
    );
  }
}
