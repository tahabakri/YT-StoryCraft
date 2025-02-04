'use client'

import { useState } from "react"
import { StoryPreview } from "@/app/components/story-preview"
import { EnhanceStory } from "@/app/components/enhance-story"
import { VoiceoverControls } from "@/app/components/voiceover-controls"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, FileImage, Share2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ExportOption {
  id: string
  label: string
  format: string
  icon: React.ReactNode
}

const EXPORT_OPTIONS: ExportOption[] = [
  {
    id: "txt",
    label: "Plain Text",
    format: "TXT",
    icon: <FileText className="w-4 h-4" />
  },
  {
    id: "docx",
    label: "Microsoft Word",
    format: "DOCX",
    icon: <FileText className="w-4 h-4" />
  },
  {
    id: "pdf",
    label: "PDF Document",
    format: "PDF",
    icon: <FileImage className="w-4 h-4" />
  }
]

export default function StoryViewerPage() {
  const [storyContent] = useState("Your story content here...") // Replace with actual state management
  const [storyFormat] = useState("short-story") // Replace with actual state management
  const { toast } = useToast()

  const handleExport = async (format: string) => {
    // Replace with actual export logic
    toast({
      title: "Export Started",
      description: `Exporting story as ${format}...`
    })
  }

  const handleShare = async () => {
    // Replace with actual share logic
    await navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link Copied",
      description: "Story link copied to clipboard"
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        {/* Main Content */}
        <div className="space-y-6">
          <StoryPreview 
            content={storyContent}
            format={storyFormat}
            className="min-h-[600px]"
          />
          
          <VoiceoverControls story={storyContent} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <EnhanceStory 
            content={storyContent}
            onEnhance={(enhancedContent) => {
              // Handle enhancement
              console.log('Enhanced:', enhancedContent)
            }}
          />

          <Card className="bg-[#1a1625] border-gray-800 p-6 space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-white">Export Story</h3>
              <p className="text-sm text-gray-400">Download your story in various formats</p>
            </div>

            <div className="grid gap-3">
              {EXPORT_OPTIONS.map((option) => (
                <Button
                  key={option.id}
                  variant="outline"
                  className="w-full justify-start space-x-4 bg-[#252131] border-gray-700 hover:bg-[#2a2635]"
                  onClick={() => handleExport(option.format)}
                >
                  <span className="text-purple-400">{option.icon}</span>
                  <span className="flex-1 text-left">
                    <span className="font-medium text-white">{option.label}</span>
                    <span className="ml-2 text-sm text-gray-400">({option.format})</span>
                  </span>
                  <Download className="w-4 h-4 text-gray-400" />
                </Button>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-800">
              <Button
                variant="outline"
                className="w-full justify-start space-x-4 bg-[#252131] border-gray-700 hover:bg-[#2a2635]"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4 text-purple-400" />
                <span className="flex-1 text-left text-white">Share Story</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
