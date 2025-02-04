import { NextResponse } from "next/server"
import { searchYouTube, getTrendingVideos, type YouTubeVideo } from "@/app/lib/youtube"

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
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();
    const type = searchParams.get("type") || "search";
    const region = searchParams.get("region") || "US";
    const maxResults = Number(searchParams.get("maxResults")) || 10;

    console.log(`Processing ${type} request for query: ${query}`);

    try {
      if (type === "trending") {
        const videos = await getTrendingVideos(apiKey, maxResults, region);
        return NextResponse.json(videos);
      } 
      
      if (query) {
        const searchTerm = type === "genre" ? `${query} videos` : query;
        console.log(`Searching for: ${searchTerm}`);
        const videos = await searchYouTube(searchTerm, apiKey, maxResults);
        return NextResponse.json(videos);
      }

      return NextResponse.json(
        { error: "Query parameter is required for search and genre types" },
        { status: 400 }
      );
    } catch (error) {
      console.error("YouTube API error:", error);
      const message = error instanceof Error 
        ? error.message 
        : "Failed to fetch videos";

      const status = message.includes("API key") ? 500 : 400;
      return NextResponse.json({ error: message }, { status });
    }
  } catch (error) {
    console.error("Route handler error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
