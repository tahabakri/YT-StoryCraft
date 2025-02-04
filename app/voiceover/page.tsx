"use client"

import { VoiceoverControls } from '@/app/components/voiceover-controls'

// For demo purposes, we'll assume the story is passed from the previous step
const DEMO_STORY = `Once upon a time in a digital realm, there was a story waiting to be brought to life through the magic of voice. This story was crafted with care and imagination, ready to be transformed into an engaging audio experience.`

export default function VoiceoverPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-white">Voice Selection</h1>
        <div className="text-sm text-gray-400">
          Story length: {DEMO_STORY.length} characters
        </div>
      </div>
      <VoiceoverControls story={DEMO_STORY} />
    </div>
  )
}
