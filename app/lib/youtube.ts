/**
 * YouTube API integration for fetching video details including
 * thumbnails and caption transcript indication.
 */

const BASE_URL = "https://www.googleapis.com/youtube/v3";

export interface VideoDetails {
    videoId: string;
    title: string;
    description: string;
    thumbnail: string;
    hasCaption: boolean;
    publishedAt: string;
    channelTitle: string;
}

export class YouTubeAPIError extends Error {
    constructor(
        message: string,
        public status?: number,
        public code?: string
    ) {
        super(message);
        this.name = 'YouTubeAPIError';
    }
}

const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes
const cache = new Map<string, { data: any; timestamp: number }>();

function getCachedData<T>(cacheKey: string): T | null {
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data as T;
    }
    return null;
}

function setCachedData<T>(cacheKey: string, data: T): void {
    cache.set(cacheKey, {
        data,
        timestamp: Date.now()
    });
}

async function fetchWithAuth(url: string, apiKey: string): Promise<Response> {
    try {
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
            },
            next: { revalidate: 300 } // Cache for 5 minutes on server
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new YouTubeAPIError(
                error.message || `API request failed with status ${response.status}`,
                response.status,
                error.error?.code
            );
        }

        return response;
    } catch (error) {
        if (error instanceof YouTubeAPIError) throw error;
        throw new YouTubeAPIError(
            error instanceof Error ? error.message : 'Failed to fetch from YouTube API'
        );
    }
}

export async function searchYouTube(
    query: string,
    apiKey: string,
    maxResults: number = 10
): Promise<VideoDetails[]> {
    const cacheKey = `search:${query}:${maxResults}`;
    const cached = getCachedData<VideoDetails[]>(cacheKey);
    if (cached) return cached;

    const url = new URL(`${BASE_URL}/search`);
    url.searchParams.append('part', 'snippet');
    url.searchParams.append('type', 'video');
    url.searchParams.append('maxResults', maxResults.toString());
    url.searchParams.append('q', query);
    url.searchParams.append('key', apiKey);

    const response = await fetchWithAuth(url.toString(), apiKey);
    const data = await response.json();

    if (!data.items?.length) {
        return [];
    }

    const videos = data.items.map((item: any): VideoDetails => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high?.url || 
                  item.snippet.thumbnails.medium?.url || 
                  item.snippet.thumbnails.default?.url,
        hasCaption: false, // Will be updated if needed
        publishedAt: item.snippet.publishedAt,
        channelTitle: item.snippet.channelTitle
    }));

    setCachedData(cacheKey, videos);
    return videos;
}

export async function getVideoDetails(
    videoId: string,
    apiKey: string
): Promise<VideoDetails> {
    const cacheKey = `video:${videoId}`;
    const cached = getCachedData<VideoDetails>(cacheKey);
    if (cached) return cached;

    const url = new URL(`${BASE_URL}/videos`);
    url.searchParams.append('part', 'snippet,contentDetails');
    url.searchParams.append('id', videoId);
    url.searchParams.append('key', apiKey);

    const response = await fetchWithAuth(url.toString(), apiKey);
    const data = await response.json();

    if (!data.items?.[0]) {
        throw new YouTubeAPIError('Video not found');
    }

    const item = data.items[0];
    const video: VideoDetails = {
        videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high?.url || 
                  item.snippet.thumbnails.medium?.url || 
                  item.snippet.thumbnails.default?.url,
        hasCaption: item.contentDetails.caption === 'true',
        publishedAt: item.snippet.publishedAt,
        channelTitle: item.snippet.channelTitle
    };

    setCachedData(cacheKey, video);
    return video;
}

export async function getTrendingVideos(
    apiKey: string,
    maxResults: number = 10,
    regionCode: string = 'US'
): Promise<VideoDetails[]> {
    const cacheKey = `trending:${regionCode}:${maxResults}`;
    const cached = getCachedData<VideoDetails[]>(cacheKey);
    if (cached) return cached;

    const url = new URL(`${BASE_URL}/videos`);
    url.searchParams.append('part', 'snippet,contentDetails');
    url.searchParams.append('chart', 'mostPopular');
    url.searchParams.append('regionCode', regionCode);
    url.searchParams.append('maxResults', maxResults.toString());
    url.searchParams.append('key', apiKey);

    const response = await fetchWithAuth(url.toString(), apiKey);
    const data = await response.json();

    if (!data.items?.length) {
        return [];
    }

    const videos = data.items.map((item: any): VideoDetails => ({
        videoId: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high?.url || 
                  item.snippet.thumbnails.medium?.url || 
                  item.snippet.thumbnails.default?.url,
        hasCaption: item.contentDetails.caption === 'true',
        publishedAt: item.snippet.publishedAt,
        channelTitle: item.snippet.channelTitle
    }));

    setCachedData(cacheKey, videos);
    return videos;
}
