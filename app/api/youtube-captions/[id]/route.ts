import { NextResponse } from "next/server"
import { google } from "googleapis"

// Mark route as dynamic
export const dynamic = 'force-dynamic';

const youtube = google.youtube('v3')

const api_key = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
if (!api_key) {
  throw new Error('YouTube API key not found in environment');
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url)
  const format = searchParams.get("format") || "json"

  if (!params.id) {
    return NextResponse.json({ error: "Video ID is required" }, { status: 400 })
  }

  try {
    const response = await youtube.videos.list({
      key: api_key,
      id: [params.id],
      part: ['snippet']
    });

    if (!response.data.items?.length) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json(response.data.items[0].snippet);
  } catch (error: any) {
    console.error("Error fetching video:", error);
    const status = error.response?.status || 500;
    const message = error.response?.data?.error?.message || "Failed to fetch video details";
    return NextResponse.json({ error: message }, { status });
  }
}
