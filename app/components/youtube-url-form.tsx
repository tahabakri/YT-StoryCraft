'use client';

import { useState } from 'react';
import axios from 'axios';

interface SearchResult {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      high?: { url: string };
    };
  };
}

interface VideoData {
  id: string;
  title: string;
  duration: string;
  thumbnailUrl: string;
  transcript?: any[];
}

interface YoutubeUrlFormProps {
  onVideoSelect: (data: VideoData) => void;
}

export function YoutubeUrlForm({ onVideoSelect }: YoutubeUrlFormProps): JSX.Element {
  const [videoPreview, setVideoPreview] = useState<VideoData | null>(null);
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isYouTubeUrl = (input: string) => {
    return /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/.test(input);
  };

  const handleAnalyze = async () => {
    setError(null);
    
    if (!url.trim()) {
      setError('Please enter a YouTube URL or search query');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Starting video analysis...');
      if (isYouTubeUrl(url)) {
        // Handle URL input
        console.log('Handling YouTube URL:', url);
        const response = await axios.get(`/api/youtube-meta?url=${encodeURIComponent(url)}`);
        const videoData = response.data;

        const formattedVideoData: VideoData = {
          id: videoData.id,
          title: videoData.title,
          duration: '',
          thumbnailUrl: videoData.thumbnailUrl,
          transcript: videoData.transcript
        };

        setVideoPreview(formattedVideoData);
        onVideoSelect(formattedVideoData);
      } else {
        // Handle search query
        console.log('Handling search query:', url);
        const response = await axios.get(`/api/youtube-meta?query=${encodeURIComponent(url)}`);
        const results = response.data;
        if (results && results.length > 0) {
          setSearchResults(results);
          setVideoPreview(null);
        } else {
          throw new Error('No results found');
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze video';
      
      // Check for specific API key related errors
      if (errorMessage.includes('API key')) {
        setError('YouTube API key error. Please check your API key configuration.');
      } else {
        console.error('Error analyzing video:', error);
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-youtube-dark rounded-xl p-6 space-y-4 shadow-lg hover:shadow-xl transition-shadow">
      <div className="space-y-2">
        <div className="flex gap-2 items-center bg-youtube-surface rounded-lg p-1">
        <input
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAnalyze();
            }
          }}
          className="flex-1 bg-transparent text-youtube-text-primary placeholder-youtube-text-secondary px-4 py-3 focus:outline-none"
          placeholder="Enter YouTube URL or search query..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button 
          className="bg-gradient-to-r from-youtube-accent to-youtube-secondary px-6 py-3 rounded-lg hover:scale-[1.02] transition-transform"
          onClick={handleAnalyze}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Analyze'}
        </button>
        </div>
        {error && (
          <div className="text-red-500 text-sm px-2">{error}</div>
        )}
      </div>
      {isLoading && (
        <div className="animate-fade-in flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-youtube-accent border-t-transparent rounded-full animate-spin"/>
        </div>
      )}
      {!isLoading && searchResults.length > 0 && !videoPreview && (
        <div className="animate-fade-in space-y-4">
          {searchResults.map((result) => (
            <div
              key={result.id.videoId}
              className="border border-youtube-surface rounded-lg p-4 hover:bg-youtube-surface/10 cursor-pointer transition-colors"
              onClick={async (e) => {
                e.preventDefault();
                setError(null);
                setIsLoading(true);
                try {
                  const response = await axios.get(`/api/youtube-meta?url=https://youtube.com/watch?v=${result.id.videoId}`);
                  const videoData = response.data;
                  const formattedVideoData: VideoData = {
                    id: videoData.id,
                    title: videoData.title,
                    duration: '',
                    thumbnailUrl: videoData.thumbnailUrl,
                    transcript: videoData.transcript
                  };
                  setVideoPreview(formattedVideoData);
                  onVideoSelect(formattedVideoData);
                  setSearchResults([]); // Clear search results
                } catch (error) {
                  const errorMessage = error instanceof Error ? error.message : 'Failed to select video';
                  if (errorMessage.includes('API key')) {
                    setError('YouTube API key error. Please check your API key configuration.');
                  } else {
                    console.error('Error selecting video:', error);
                    setError(errorMessage);
                  }
                } finally {
                  setIsLoading(false);
                }
              }}
            >
              <div className="flex gap-4">
                <img
                  src={result.snippet.thumbnails.high?.url || `https://img.youtube.com/vi/${result.id.videoId}/maxresdefault.jpg`}
                  alt={result.snippet.title}
                  className="w-40 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="text-youtube-text-primary font-medium mb-2">{result.snippet.title}</h3>
                  <p className="text-youtube-text-secondary text-sm line-clamp-2">{result.snippet.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {videoPreview && (
        <div className="animate-fade-in border border-youtube-surface rounded-lg p-4">
          <img 
            src={videoPreview.thumbnailUrl} 
            alt={videoPreview.title}
            className="aspect-video object-cover rounded-lg mb-4"
          />
          <div className="space-y-2">
            <h3 className="text-youtube-text-primary font-medium">{videoPreview.title}</h3>
            {videoPreview.duration && (
              <p className="text-youtube-text-secondary text-sm">{videoPreview.duration}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
