'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface StoryOptions {
  genre: string
  tone: string
  style: string
  voice: string
  refine: string
  creativity: string
  detail: string
  complexity: string
  customPrompt?: string
}

interface VideoData {
  id: string
  title: string
  duration: string
  thumbnailUrl: string
  captions?: any[]
}

interface AIStoryGeneratorProps {
  videoData: VideoData
  storyOptions: StoryOptions
  onStoryGenerated: (story: string) => void
}

export function AIStoryGenerator({ 
  videoData, 
  storyOptions, 
  onStoryGenerated 
}: AIStoryGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generateStory = async () => {
    try {
      setIsGenerating(true)

      // Example API call - replace with your actual story generation endpoint
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoData,
          options: {
            ...storyOptions,
            creativity: parseInt(storyOptions.creativity),
            detail: parseInt(storyOptions.detail),
            complexity: parseInt(storyOptions.complexity)
          }
        }),
      })

      if (!response.ok) {
        throw new Error('Story generation failed')
      }

      const data = await response.json()
      onStoryGenerated(data.story)
    } catch (error) {
      console.error('Error generating story:', error)
      // You might want to handle the error more gracefully in your UI
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="hidden">
      <Button
        id="story-generator"
        onClick={generateStory}
        disabled={isGenerating}
      >
        {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Generate Story
      </Button>
      <Button
        id="regenerate-story"
        onClick={generateStory}
        disabled={isGenerating}
      >
        {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Regenerate
      </Button>
    </div>
  )
}
