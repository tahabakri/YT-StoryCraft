'use client'

import { useState } from "react"
import { VideoPreview } from "./video-preview"
import { StoryOptions } from "./story-options"
import { VoiceoverControls } from "./voiceover-controls"
import { AIStoryGenerator } from "./ai-story-generator"
import { Button } from "../../components/ui/button"
import { Textarea } from "../../components/ui/textarea"
import { ScrollArea } from "../../components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { 
  BookOpen, // Genre
  Palette, // Style
  Music, // Tone
  Mic2, // Voice
  Settings2, // Refine
  Download, 
  Copy,
  Wand2, // Generate
  RefreshCw // Regenerate
} from "lucide-react"
import { useToast } from "../../components/ui/use-toast"

export interface VideoData {
  id: string
  title: string
  duration: string
  thumbnailUrl: string
  captions?: any[]
}

type CategoryType = "genre" | "tone" | "style" | "voice" | "refine"

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

interface StoryEditorProps {
  videoData: VideoData
}

const DEFAULT_OPTIONS: StoryOptions = {
  genre: "fantasy",
  tone: "inspirational",
  style: "narrative",
  voice: "natural",
  refine: "",
  creativity: "50",
  detail: "50",
  complexity: "50",
  customPrompt: ""
}

const TAB_CONFIG = [
  { id: 'genre', icon: BookOpen, label: 'Genre' },
  { id: 'tone', icon: Music, label: 'Tone' },
  { id: 'style', icon: Palette, label: 'Style' },
  { id: 'voice', icon: Mic2, label: 'Voice' },
  { id: 'refine', icon: Settings2, label: 'Refine' }
] as const

export function StoryEditor({ videoData }: StoryEditorProps) {
  const [storyContent, setStoryContent] = useState("")
  const [options, setOptions] = useState<StoryOptions>(DEFAULT_OPTIONS)
  const [activeTab, setActiveTab] = useState<CategoryType>('genre')
  const { toast } = useToast()

  const handleCopyToClipboard = async () => {
    await navigator.clipboard.writeText(storyContent)
    toast({
      title: "Copied to clipboard",
      description: "Story content has been copied to your clipboard"
    })
  }

  const handleDownload = () => {
    const blob = new Blob([storyContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `story-${videoData.id}.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast({
      title: "Story downloaded",
      description: "Your story has been downloaded as a text file"
    })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] p-6 mt-4 max-w-[1920px] mx-auto bg-[#0F0F0F] text-white">
      {/* Top Tabs */}
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as CategoryType)}
        className="w-full mb-6"
      >
        <TabsList className="flex w-full gap-2 p-1 bg-[#1F1F1F] rounded-xl h-16">
          {TAB_CONFIG.map(({ id, icon: Icon, label }) => (
            <TabsTrigger
              key={id}
              value={id}
              className="flex-1 flex flex-col items-center justify-center gap-1 h-full
                data-[state=active]:bg-[#2F2F2F] rounded-lg transition-all
                hover:bg-[#2F2F2F]/50
                text-gray-400 data-[state=active]:text-white"
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-[350px_1fr_300px] gap-6 flex-1 overflow-hidden">
        {/* Left Panel - Dynamic Controls */}
        <div className="bg-[#1F1F1F] rounded-xl border border-[#2F2F2F] overflow-hidden">
          <ScrollArea className="h-full p-4">
            <StoryOptions 
              options={options}
              onOptionsChange={setOptions}
              activeTab={activeTab}
            />
            <AIStoryGenerator
              videoData={videoData}
              storyOptions={options}
              onStoryGenerated={setStoryContent}
            />
          </ScrollArea>
        </div>

        {/* Center Panel - Live Preview */}
        <div className="flex flex-col bg-[#1F1F1F] rounded-xl border border-[#2F2F2F] overflow-hidden">
          <div className="flex-1 p-4">
            <Textarea
              value={storyContent}
              onChange={(e) => setStoryContent(e.target.value)}
              placeholder="Your story will appear here..."
              className="w-full h-full bg-transparent border-0 resize-none focus-visible:ring-0 
                text-white placeholder:text-gray-500"
            />
          </div>
          <div className="flex justify-between items-center p-4 border-t border-[#2F2F2F] bg-[#1A1A1A]">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleCopyToClipboard}
                className="bg-transparent border-[#2F2F2F] hover:bg-[#2F2F2F] text-white"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button
                variant="outline"
                onClick={handleDownload}
                className="bg-transparent border-[#2F2F2F] hover:bg-[#2F2F2F] text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
            <div className="text-sm text-gray-400">
              {storyContent.length} characters
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="flex flex-col bg-[#1F1F1F] rounded-xl border border-[#2F2F2F]">
          <div className="p-4 border-b border-[#2F2F2F]">
            <VideoPreview {...videoData} />
          </div>
          <div className="flex-1 p-4">
            <h3 className="font-medium text-white mb-3">Selected Options</h3>
            <div className="space-y-2 text-sm text-gray-400">
              {Object.entries(options).map(([key, value]) => (
                key !== 'customPrompt' && (
                  <div key={key} className="flex justify-between">
                    <span className="capitalize">{key}:</span>
                    <span className="text-white capitalize">{value.replace(/-/g, ' ')}</span>
                  </div>
                )
              ))}
            </div>
          </div>
          <div className="p-4 border-t border-[#2F2F2F] space-y-3">
            <Button 
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              onClick={() => {
                // Trigger the story generator button
                const generator = document.querySelector('#story-generator') as HTMLButtonElement
                if (generator) {
                  generator.click()
                }
              }}
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Generate Story
            </Button>
            {storyContent && (
              <Button
                variant="outline"
                className="w-full bg-transparent border-[#2F2F2F] hover:bg-[#2F2F2F] text-white"
                onClick={() => {
                  const regenerateBtn = document.querySelector('#regenerate-story') as HTMLButtonElement
                  if (regenerateBtn) {
                    regenerateBtn.click()
                  }
                }}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
