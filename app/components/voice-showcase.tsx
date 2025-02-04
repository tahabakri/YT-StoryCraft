'use client'

import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Voice {
  id: string
  name: string
  description: string
  preview: string
  avatar: string
  category: string
  tags: string[]
}

const AVAILABLE_VOICES: Voice[] = [
  {
    id: "21m00Tcm4TlvDq8ikWAM",
    name: "Rachel",
    description: "A warm and professional voice perfect for storytelling, with natural intonation and clear pronunciation.",
    preview: "/voices/rachel-preview.mp3",
    avatar: "/voices/rachel-avatar.jpg",
    category: "Professional",
    tags: ["Clear", "Warm", "Natural"]
  },
  {
    id: "AZnzlk1XvdvUeBnXmlld",
    name: "Domi",
    description: "An energetic and engaging voice that brings stories to life with dynamic expression and enthusiasm.",
    preview: "/voices/domi-preview.mp3",
    avatar: "/voices/domi-avatar.jpg",
    category: "Dynamic",
    tags: ["Energetic", "Expressive", "Young"]
  },
  {
    id: "EXAVITQu4vr4xnSDxMaL",
    name: "Bella",
    description: "A smooth and sophisticated voice with perfect pacing and emotional depth, ideal for immersive narratives.",
    preview: "/voices/bella-preview.mp3",
    avatar: "/voices/bella-avatar.jpg",
    category: "Narrative",
    tags: ["Smooth", "Sophisticated", "Emotional"]
  },
  {
    id: "MF3mGyEYCl7XYWbV9V6O",
    name: "Marcus",
    description: "A deep and authoritative voice that commands attention while maintaining a friendly and approachable tone.",
    preview: "/voices/marcus-preview.mp3",
    avatar: "/voices/marcus-avatar.jpg",
    category: "Professional",
    tags: ["Deep", "Authoritative", "Friendly"]
  },
  {
    id: "TxGEqnHWrfWFTfGW9XjX",
    name: "Sophie",
    description: "A gentle and soothing voice that creates a calming atmosphere while maintaining clear articulation.",
    preview: "/voices/sophie-preview.mp3",
    avatar: "/voices/sophie-avatar.jpg",
    category: "Narrative",
    tags: ["Gentle", "Soothing", "Articulate"]
  }
]

interface VoiceShowcaseProps {
  selectedVoice: string
  onVoiceSelect: (voice: Voice) => void
}

export function VoiceShowcase({ selectedVoice, onVoiceSelect }: VoiceShowcaseProps) {
  const [playingPreview, setPlayingPreview] = useState<string | null>(null)

  const handlePreviewPlay = (voiceId: string, previewUrl: string) => {
    if (playingPreview === voiceId) {
      const audio = document.getElementById(`preview-${voiceId}`) as HTMLAudioElement
      audio.pause()
      setPlayingPreview(null)
    } else {
      // Stop any currently playing preview
      if (playingPreview) {
        const currentAudio = document.getElementById(`preview-${playingPreview}`) as HTMLAudioElement
        currentAudio.pause()
      }
      // Play new preview
      const audio = document.getElementById(`preview-${voiceId}`) as HTMLAudioElement
      audio.play()
      setPlayingPreview(voiceId)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-[#2F2F2F]">
        <h3 className="text-lg font-semibold text-white">Voice Selection</h3>
        <span className="text-sm text-gray-400">{AVAILABLE_VOICES.length} voices available</span>
      </div>
      <div className="flex-1 overflow-auto p-4 grid gap-4">
        {AVAILABLE_VOICES.map((voice) => (
          <Card 
            key={voice.id}
            className={`relative p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02]
              ${selectedVoice === voice.id 
                ? 'bg-[#2F2F2F] border-purple-500' 
                : 'bg-[#1F1F1F] border-[#2F2F2F] hover:bg-[#2F2F2F]/50'}`}
            onClick={() => onVoiceSelect(voice)}
          >
            <div className="flex items-start gap-4">
              <Avatar className={`h-16 w-16 border-2 ${
                selectedVoice === voice.id ? 'border-purple-500' : 'border-purple-500/20'
              }`}>
                <AvatarImage src={voice.avatar} />
                <AvatarFallback>{voice.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-white">{voice.name}</h4>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-[#2F2F2F] text-gray-400">
                    {voice.category}
                  </span>
                </div>
                <p className="text-sm text-gray-400 line-clamp-2 mb-2">{voice.description}</p>
                <div className="flex gap-2">
                  {voice.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="px-2 py-0.5 text-xs rounded-full bg-purple-500/10 text-purple-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full transition-all duration-300
                  ${playingPreview === voice.id
                    ? 'bg-purple-500 text-white hover:bg-purple-600'
                    : 'text-gray-400 hover:text-white hover:bg-[#2F2F2F]'}`}
                onClick={(e) => {
                  e.stopPropagation()
                  handlePreviewPlay(voice.id, voice.preview)
                }}
              >
                {playingPreview === voice.id ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>
            </div>
            <audio
              id={`preview-${voice.id}`}
              src={voice.preview}
              onEnded={() => setPlayingPreview(null)}
              className="hidden"
            />
          </Card>
        ))}
      </div>
    </div>
  )
}
