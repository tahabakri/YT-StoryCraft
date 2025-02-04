import { NextResponse } from "next/server"
import { YoutubeTranscript, TranscriptResponse } from "youtube-transcript"

interface TranscriptItem {
  text: string;
  offset: number;
  duration: number;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const videoId = searchParams.get("videoId")

  if (!videoId) {
    return NextResponse.json({ error: "Video ID is required" }, { status: 400 })
  }

  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId)
    return NextResponse.json({
      transcript: transcript.map(item => ({
        text: item.text,
        offset: item.offset,
        duration: item.duration
      }))
    })
  } catch (error: any) {
    console.error("Error fetching transcript:", error)
    return NextResponse.json({ error: "Failed to fetch transcript" }, { status: 500 })
  }
}
