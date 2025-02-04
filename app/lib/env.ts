// Environment variable helpers

export const ENV_ERRORS = {
  YOUTUBE_API_KEY_MISSING: "YouTube API key is not configured. Please add NEXT_PUBLIC_YOUTUBE_API_KEY to your .env.local file",
  YOUTUBE_API_KEY_INVALID: "Invalid YouTube API key. Please check your NEXT_PUBLIC_YOUTUBE_API_KEY in .env.local file"
} as const;

// Helper to safely get environment variables
export function getYouTubeApiKey(): string {
  const key = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  
  if (!key) {
    throw new Error(ENV_ERRORS.YOUTUBE_API_KEY_MISSING);
  }
  
  return key;
}

// Helper to check if API key is configured
export function hasYouTubeApiKey(): boolean {
  return !!process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
}
