import { searchYouTube } from "@/app/lib/youtube";
import { getYouTubeApiKey, ENV_ERRORS } from "@/app/lib/env";
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
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

    let apiKey: string;
    try {
      apiKey = getYouTubeApiKey()
    } catch (error) {
      return NextResponse.json(
        { error: ENV_ERRORS.YOUTUBE_API_KEY_MISSING },
        { status: 500 }
      )
    }

    const videos = await searchYouTube(
      query,
      apiKey,
      maxResults ? parseInt(maxResults) : undefined
    )

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
