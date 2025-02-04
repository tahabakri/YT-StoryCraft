/**
 * YouTube API integration for fetching video details including
 * thumbnails and caption transcript indication.
 */

const BASE_URL = "https://www.googleapis.com/youtube/v3";

export interface YouTubeVideo {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    duration?: string;
    channelTitle: string;
    publishedAt: string;
    viewCount?: number;
    tags?: string[];
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

async function fetchWithAuth(url: string, apiKey: string): Promise<Response> {
    try {
        console.log(`Fetching YouTube API: ${url}`);
        
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('YouTube API Error Response:', errorData);
            
            const errorMessage = errorData.error?.message || `API request failed with status ${response.status}`;
            throw new YouTubeAPIError(
                errorMessage,
                response.status,
                errorData.error?.code
            );
        }

        return response;
    } catch (error) {
        console.error('YouTube API Fetch Error:', error);
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
): Promise<YouTubeVideo[]> {
    const url = new URL(`${BASE_URL}/search`);
    url.searchParams.append('part', 'snippet');
    url.searchParams.append('type', 'video');
    url.searchParams.append('maxResults', maxResults.toString());
    url.searchParams.append('q', query);
    url.searchParams.append('key', apiKey);

    try {
        const response = await fetchWithAuth(url.toString(), apiKey);
        const data = await response.json();

        if (!data.items?.length) {
            console.log('No videos found for query:', query);
            return [];
        }

        console.log(`Found ${data.items.length} videos for query:`, query);

        const videos = data.items.map((item: any): YouTubeVideo => ({
            id: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnailUrl: item.snippet.thumbnails.high?.url || 
                      item.snippet.thumbnails.medium?.url || 
                      item.snippet.thumbnails.default?.url,
            publishedAt: item.snippet.publishedAt,
            channelTitle: item.snippet.channelTitle
        }));

        return videos;
    } catch (error) {
        console.error('Error in searchYouTube:', error);
        throw error;
    }
}

export async function getVideoDetails(
    videoId: string,
    apiKey: string
): Promise<YouTubeVideo> {
    const url = new URL(`${BASE_URL}/videos`);
    url.searchParams.append('part', 'snippet,contentDetails,statistics');
    url.searchParams.append('id', videoId);
    url.searchParams.append('key', apiKey);

    try {
        const response = await fetchWithAuth(url.toString(), apiKey);
        const data = await response.json();

        if (!data.items?.[0]) {
            throw new YouTubeAPIError('Video not found');
        }

        const item = data.items[0];
        const video: YouTubeVideo = {
            id: videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnailUrl: item.snippet.thumbnails.high?.url || 
                      item.snippet.thumbnails.medium?.url || 
                      item.snippet.thumbnails.default?.url,
            duration: item.contentDetails?.duration,
            publishedAt: item.snippet.publishedAt,
            channelTitle: item.snippet.channelTitle,
            viewCount: parseInt(item.statistics?.viewCount || '0'),
            tags: item.snippet.tags || []
        };

        return video;
    } catch (error) {
        console.error('Error in getVideoDetails:', error);
        throw error;
    }
}

export async function getTrendingVideos(
    apiKey: string,
    maxResults: number = 10,
    regionCode: string = 'US'
): Promise<YouTubeVideo[]> {
    const url = new URL(`${BASE_URL}/videos`);
    url.searchParams.append('part', 'snippet,contentDetails,statistics');
    url.searchParams.append('chart', 'mostPopular');
    url.searchParams.append('regionCode', regionCode);
    url.searchParams.append('maxResults', maxResults.toString());
    url.searchParams.append('key', apiKey);

    try {
        const response = await fetchWithAuth(url.toString(), apiKey);
        const data = await response.json();

        if (!data.items?.length) {
            console.log('No trending videos found');
            return [];
        }

        console.log(`Found ${data.items.length} trending videos`);

        const videos = data.items.map((item: any): YouTubeVideo => ({
            id: item.id,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnailUrl: item.snippet.thumbnails.high?.url || 
                      item.snippet.thumbnails.medium?.url || 
                      item.snippet.thumbnails.default?.url,
            duration: item.contentDetails?.duration,
            publishedAt: item.snippet.publishedAt,
            channelTitle: item.snippet.channelTitle,
            viewCount: parseInt(item.statistics?.viewCount || '0'),
            tags: item.snippet.tags || []
        }));

        return videos;
    } catch (error) {
        console.error('Error in getTrendingVideos:', error);
        throw error;
    }
}
