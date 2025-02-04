import { NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';
import { YoutubeTranscript } from 'youtube-transcript';

type YouTubeApiError = AxiosError<{
  error?: {
    message?: string;
  };
}>;

interface YouTubeVideoSnippet {
  title: string;
  description: string;
}

// Get API key from environment variables
const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
if (!apiKey) {
  console.error('YouTube API key missing. Make sure NEXT_PUBLIC_YOUTUBE_API_KEY is set in .env.local');
} else {
  console.log('YouTube API Key is configured');
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const query = searchParams.get('query');

  if (!apiKey) {
    return NextResponse.json(
      { error: 'YouTube API key not configured. Make sure NEXT_PUBLIC_YOUTUBE_API_KEY is set in .env.local' },
      { status: 500 }
    );
  }

  try {
    if (url) {
      // Handle video URL
      const videoId = extractVideoId(url);
      if (!videoId) {
        return NextResponse.json(
          { error: 'Invalid YouTube URL' },
          { status: 400 }
        );
      }

      const [videoInfo, transcript] = await Promise.all([
        fetchVideoInfo(videoId),
        fetchTranscript(videoId)
      ]);

      return NextResponse.json({
        id: videoId,
        title: videoInfo.title,
        description: videoInfo.description,
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        transcript: transcript
      });
    } else if (query) {
      // Handle search query
      const results = await searchYouTube(query);
      return NextResponse.json(results);
    } else {
      return NextResponse.json(
        { error: 'Missing url or query parameter' },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    // Log detailed error information
    const err = error as YouTubeApiError;
    console.error('YouTube API error details:', {
      message: err.message || 'Unknown error',
      response: err.response?.data,
      status: err.response?.status,
      apiKeyLength: apiKey?.length || 0
    });

    // Check for specific YouTube API errors
    if (err.response?.data?.error?.message) {
      const errorMessage = err.response.data.error.message;
      console.error('YouTube API specific error:', errorMessage);
      
      // Check for common API key issues
      if (errorMessage.includes('API key')) {
        return NextResponse.json(
          { error: 'Invalid YouTube API key. Please check your API key configuration.' },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch YouTube data' },
      { status: 500 }
    );
  }
}

async function fetchVideoInfo(videoId: string): Promise<YouTubeVideoSnippet> {
  try {
    console.log(`Fetching video info for ID: ${videoId}`);
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`
    );
    const data = response.data;
    if (!data.items || data.items.length === 0) {
      throw new Error('Video not found');
    }
    return data.items[0].snippet;
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error fetching video info:', err.message || 'Unknown error');
    throw error;
  }
}

async function fetchTranscript(videoId: string): Promise<any[]> {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    return transcript.map(item => ({
      text: item.text,
      offset: item.offset,
      duration: item.duration
    }));
  } catch (error: unknown) {
    console.error('Error fetching transcript:', error);
    return [];
  }
}

async function searchYouTube(query: string) {
  try {
    console.log(`Searching YouTube for query: ${query}`);
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${apiKey}&type=video&maxResults=5`
    );
    const items = response.data.items;
    console.log(`Found ${items?.length || 0} results`);
    return items;
  } catch (error: unknown) {
    const err = error as YouTubeApiError;
    console.error('Search error details:', {
      message: err.message || 'Unknown error',
      response: err.response?.data,
      status: err.response?.status
    });
    throw err;
  }
}

function extractVideoId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
