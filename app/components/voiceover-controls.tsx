'use client'

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { 
  Play, 
  Pause, 
  Download, 
  RefreshCw, 
  Speaker, 
  Wand2,
  Volume2,
  Gauge
} from "lucide-react"
import { generateVoiceover } from "../lib/elevenlabs"
import { useToast } from "@/components/ui/use-toast"
import { VoiceShowcase } from "./voice-showcase"
import { WaveformVisualizer } from "./waveform-visualizer"
import { cn } from "@/lib/utils"

interface Voice {
  id: string
  name: string
  description: string
  preview: string
  avatar: string
  category: string
  tags: string[]
}

export function VoiceoverControls({ story }: { story: string }) {
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null)
  const [speed, setSpeed] = useState(1)
  const [pitch, setPitch] = useState(1)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { toast } = useToast()

  const handleGenerateVoiceover = async () => {
    if (!selectedVoice) return

    setIsGenerating(true)
    try {
      const url = await generateVoiceover(story, selectedVoice.id)
      setAudioUrl(url)
      toast({
        title: "Voiceover generated successfully",
        description: "You can now play or download the audio.",
      })
    } catch (error) {
      console.error("Error in handleGenerate:", error)
      toast({
        title: "Error generating voiceover",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleSpeedChange = (newSpeed: number[]) => {
    setSpeed(newSpeed[0])
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed[0]
    }
  }

  const handleDownload = () => {
    if (audioUrl) {
      const a = document.createElement("a")
      a.href = audioUrl
      a.download = "voiceover.mp3"
      a.click()
    }
  }

  return (
    <div className="grid grid-cols-[1fr_400px] gap-6 h-[calc(100vh-160px)]">
      {/* Left Panel - Voice Selection */}
      <VoiceShowcase
        selectedVoice={selectedVoice?.id || ""}
        onVoiceSelect={setSelectedVoice}
      />

      {/* Right Panel - Voice Customization */}
      <div className="flex flex-col space-y-6">
        <Card className="flex-1 p-6 bg-[#1F1F1F] border-[#2F2F2F]">
          {selectedVoice ? (
            <>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{selectedVoice.name}</h3>
                    <p className="text-sm text-gray-400">{selectedVoice.description}</p>
                  </div>
                </div>

                {/* Voice Controls */}
                <div className="space-y-6 pt-4 border-t border-[#2F2F2F]">
                  {/* Speed Control */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm text-gray-400 flex items-center gap-2">
                        <Gauge className="w-4 h-4" />
                        Speed
                      </label>
                      <span className="text-sm text-gray-400">{speed}x</span>
                    </div>
                    <Slider
                      value={[speed]}
                      onValueChange={handleSpeedChange}
                      max={2}
                      min={0.5}
                      step={0.1}
                      className="[&_[role=slider]]:bg-purple-600"
                    />
                  </div>

                  {/* Pitch Control */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm text-gray-400 flex items-center gap-2">
                        <Volume2 className="w-4 h-4" />
                        Pitch
                      </label>
                      <span className="text-sm text-gray-400">{pitch}x</span>
                    </div>
                    <Slider
                      value={[pitch]}
                      onValueChange={(value) => setPitch(value[0])}
                      max={2}
                      min={0.5}
                      step={0.1}
                      className="[&_[role=slider]]:bg-purple-600"
                    />
                  </div>
                </div>

                {/* Waveform Preview */}
                <div className="relative">
                  <WaveformVisualizer
                    audioUrl={audioUrl}
                    isPlaying={isPlaying}
                    className="bg-[#2F2F2F]/50"
                  />
                  {!audioUrl && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Speaker className="w-8 h-8 text-gray-500" />
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-6">
                <Button
                  className={cn(
                    "flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white",
                    "hover:from-purple-700 hover:to-pink-700 transition-all duration-300",
                    "shadow-lg hover:shadow-xl hover:scale-[1.02]",
                    "focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
                  )}
                  onClick={audioUrl ? handlePlayPause : handleGenerateVoiceover}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : audioUrl ? (
                    isPlaying ? (
                      <>
                        <Pause className="w-5 h-5 mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 mr-2" />
                        Play
                      </>
                    )
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5 mr-2" />
                      Apply Voiceover to Story
                    </>
                  )}
                </Button>
                {audioUrl && (
                  <Button
                    variant="outline"
                    className="bg-transparent border-[#2F2F2F] text-white hover:bg-[#2F2F2F]
                      transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
                    onClick={handleDownload}
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <Speaker className="w-12 h-12 text-gray-500" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Select a Voice</h3>
                <p className="text-sm text-gray-400">
                  Choose a voice from the left to customize and preview
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Hidden Audio Element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      )}
    </div>
  )
}
