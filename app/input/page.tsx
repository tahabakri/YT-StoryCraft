'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { YoutubeUrlForm } from "@/app/components/youtube-url-form"
import { StoryTypeSelector } from "@/app/components/story-type-selector"
import { Card } from "@/components/ui/card"

interface VideoData {
  id: string
  title: string
  duration: string
  thumbnailUrl: string
  captions?: any[]
}

export default function InputPage() {
  const [videoData, setVideoData] = useState<VideoData | null>(null)
  const [storyType, setStoryType] = useState("")
  const router = useRouter()

  const handleVideoSelect = (data: VideoData) => {
    setVideoData(data)
    // Store video data in localStorage or state management solution
    localStorage.setItem('selectedVideo', JSON.stringify(data))
  }

  const handleStoryTypeChange = (type: string) => {
    setStoryType(type)
    localStorage.setItem('storyType', type)
  }

  const handleContinue = () => {
    if (videoData) {
      router.push('/customize')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-5xl font-bold">
          <span className="text-white">Free </span>
          <span className="bg-gradient-to-r from-[#ff4d79] via-[#c054ff] to-[#6d6aff] text-transparent bg-clip-text">
            YouTube Story
          </span>
          <span className="text-white"> Generator</span>
        </h1>
        <p className="text-gray-400 text-xl max-w-2xl mx-auto">
          Transform any YouTube video into an engaging story with AI. Just paste a URL or search for a video to get started.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto space-y-8">
        <YoutubeUrlForm onVideoSelect={handleVideoSelect} />
        
        {videoData && (
          <Card className="bg-[#1a1625] border-gray-800 p-6 space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-white">
                Choose Story Type
              </h2>
              <p className="text-gray-400">
                Select the type of story you want to generate from this video.
              </p>
            </div>

            <StoryTypeSelector onStoryTypeChange={handleStoryTypeChange} />

            <button
              onClick={handleContinue}
              disabled={!storyType}
              className={`w-full py-3 px-4 bg-gradient-to-r from-[#ff4d79] via-[#c054ff] to-[#6d6aff]
                text-white font-medium rounded-lg shadow-lg transition-all duration-300
                ${storyType ? 'hover:opacity-90' : 'opacity-50 cursor-not-allowed'}`}
            >
              Continue to Customization
            </button>
          </Card>
        )}
      </div>
    </div>
  )
}
