import { useState } from 'react';
import { VideoData } from '../app/components/story-editor';

interface StoryOptions {
  genre: string;
  tone: string;
  style: string;
  format: string;
  customPrompt?: string;
}

interface GenerationProgress {
  status: 'idle' | 'processing' | 'complete' | 'error';
  step: number;
  error?: string;
}

export const useStoryGeneration = () => {
  const [story, setStory] = useState('');
  const [progress, setProgress] = useState<GenerationProgress>({
    status: 'idle',
    step: 0
  });

  const generateStory = async (
    videoData: VideoData & { transcript: string },
    storyOptions: StoryOptions
  ): Promise<string> => {
    try {
      setProgress({ status: 'processing', step: 0 });
      
      // Step 1: Prepare data
      setProgress({ status: 'processing', step: 1 });
      const enrichedVideoData = {
        ...videoData,
        description: "Video transcript: " + videoData.transcript
      };

      // Step 2: Generate outline
      setProgress({ status: 'processing', step: 2 });
      const res = await fetch('/api/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoData: enrichedVideoData,
          storyOptions
        }),
      });

      if (!res.ok) {
        throw new Error(`Error generating story: ${res.status}`);
      }

      // Step 3: Process response
      setProgress({ status: 'processing', step: 3 });
      const data = await res.json();
      
      // Step 4: Format story
      setProgress({ status: 'processing', step: 4 });
      setStory(data.story);
      
      setProgress({ status: 'complete', step: 4 });
      return data.story;
    } catch (error) {
      setProgress({
        status: 'error',
        step: 0,
        error: error instanceof Error ? error.message : 'Failed to generate story'
      });
      throw error;
    }
  };

  return { story, generateStory, progress };
};
