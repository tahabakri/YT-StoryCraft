import { NextResponse } from "next/server"
import { searchYouTube, getTrendingVideos, type VideoDetails } from "@/app/lib/youtube"
import { getYouTubeApiKey, ENV_ERRORS } from "@/app/lib/env"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")?.trim()
    const type = searchParams.get("type") || "search" // search, trending
    const region = searchParams.get("region") || "US"
    const maxResults = Number(searchParams.get("maxResults")) || 10

    let apiKey: string;
    try {
      apiKey = getYouTubeApiKey()
    } catch (error) {
      return NextResponse.json(
        { error: "YouTube API key not configured" },
        { status: 500 }
      )
    }

    try {
      if (type === "trending") {
        const videos = await getTrendingVideos(apiKey, maxResults, region)
        return NextResponse.json(videos)
      } 
      
      if (query) {
        const searchTerm = type === "genre" ? `${query} videos` : query
        const videos = await searchYouTube(searchTerm, apiKey, maxResults)
        return NextResponse.json(videos)
      }

      return NextResponse.json(
        { error: "Query parameter is required for search and genre types" },
        { status: 400 }
      )
    } catch (error) {
      console.error("YouTube API error:", error)
      const message = error instanceof Error 
        ? error.message 
        : "Failed to fetch videos"

      const status = message.includes("API key") ? 500 : 400
      return NextResponse.json({ error: message }, { status })
    }
  } catch (error) {
    console.error("Route error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
