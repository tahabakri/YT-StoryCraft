"use client";

import { StoryEditor } from '@/app/components/story-editor'

export default function StoryEditorPage() {
  const handleStoryGenerated = (story: string) => {
    // Handle the generated story
    console.log('Story generated:', story);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-white">Story Editor</h1>
      <StoryEditor 
        videoData={{}}
        storyOptions={{
          genre: '',
          tone: '',
          style: '',
          format: ''
        }}
        onStoryGenerated={handleStoryGenerated}
      />
    </div>
  );
}
