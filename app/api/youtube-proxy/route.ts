import { NextResponse } from 'next/server';
import { hasYouTubeApiKey, getYouTubeApiKey } from "@/app/lib/env";
import { searchYouTube, getTrendingVideos, getVideoDetails } from "@/app/lib/youtube";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');

  if (!hasYouTubeApiKey()) {
    return NextResponse.json(
      { error: "YouTube API key not configured" },
      { status: 500 }
    );
  }

  const apiKey = getYouTubeApiKey();

  try {
    switch (endpoint) {
      case 'search': {
        const query = searchParams.get('query');
        const maxResults = Number(searchParams.get('maxResults')) || 10;

        if (!query) {
          return NextResponse.json(
            { error: "Query parameter required for search" },
            { status: 400 }
          );
        }

        const videos = await searchYouTube(query, apiKey, maxResults);
        return NextResponse.json(videos);
      }

      case 'trending': {
        const maxResults = Number(searchParams.get('maxResults')) || 10;
        const region = searchParams.get('region') || 'US';
        const videos = await getTrendingVideos(apiKey, maxResults, region);
        return NextResponse.json(videos);
      }

      case 'video': {
        const videoId = searchParams.get('videoId');
        
        if (!videoId) {
          return NextResponse.json(
            { error: "Video ID required" },
            { status: 400 }
          );
        }

        const video = await getVideoDetails(videoId, apiKey);
        return NextResponse.json(video);
      }

      default:
        return NextResponse.json(
          { error: "Invalid endpoint" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("YouTube API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch from YouTube" },
      { status: 500 }
    );
  }
}
