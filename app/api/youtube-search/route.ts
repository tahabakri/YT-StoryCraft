import { searchYouTube } from "@/app/lib/youtube"
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  if (!apiKey) {
    console.error("YouTube API key missing");
    return NextResponse.json(
      { error: "YouTube API key not configured" },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query")
    const maxResults = searchParams.get("maxResults")

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      )
    }

    console.log(`Searching YouTube for: ${query}`);
    const videos = await searchYouTube(
      query,
      apiKey,
      maxResults ? parseInt(maxResults) : undefined
    )

    console.log(`Found ${videos.length} videos for query: ${query}`);
    return NextResponse.json(videos)
  } catch (error) {
    console.error("YouTube search error:", error)
    const message = error instanceof Error ? error.message : "Failed to fetch videos"
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
