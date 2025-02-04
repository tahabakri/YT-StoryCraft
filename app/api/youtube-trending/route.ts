import { getTrendingVideos } from "@/app/lib/youtube"
import { getYouTubeApiKey, ENV_ERRORS } from "@/app/lib/env"
import { NextResponse } from 'next/server';

// Mark route as dynamic
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const maxResults = Number(searchParams.get('maxResults')) || 10
    const region = searchParams.get('region') || 'US'

    let apiKey: string;
    try {
      apiKey = getYouTubeApiKey()
    } catch (error) {
      return NextResponse.json(
        { error: ENV_ERRORS.YOUTUBE_API_KEY_MISSING },
        { status: 500 }
      )
    }

    const videos = await getTrendingVideos(apiKey, maxResults, region);
    return NextResponse.json(videos);
  } catch (error) {
    console.error("YouTube API error:", error);
    const message = error instanceof Error 
      ? error.message 
      : "Failed to fetch trending videos"
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
