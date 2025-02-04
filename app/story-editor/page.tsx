"use client";

import { StoryEditor } from '@/app/components/story-editor'

export default function StoryEditorPage() {
  // Provide default values for required VideoData properties
  const defaultVideoData = {
    id: "placeholder",
    title: "Select a video to get started",
    duration: "0:00",
    thumbnailUrl: "/placeholder.jpg",
    captions: []
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-white">Story Editor</h1>
      <StoryEditor videoData={defaultVideoData} />
    </div>
  );
}
