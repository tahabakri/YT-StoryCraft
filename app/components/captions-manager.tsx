"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { YoutubeTranscript } from "youtube-transcript"

interface CaptionsManagerProps {
  videoId: string
}

export function CaptionsManager({ videoId }: CaptionsManagerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleDownload = async () => {
    try {
      setIsLoading(true)
      const transcript = await YoutubeTranscript.fetchTranscript(videoId)
      
      // Convert transcript to SRT format
      const srtContent = transcript.map((item: any, index: number) => {
        const startTime = new Date(item.offset).toISOString().slice(11, 23).replace('.', ',')
        const endTime = new Date(item.offset + item.duration).toISOString().slice(11, 23).replace('.', ',')
        return `${index + 1}\n${startTime} --> ${endTime}\n${item.text}\n\n`
      }).join('')

      // Create a download link
      const blob = new Blob([srtContent], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `transcript.srt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      toast({
        title: "Success",
        description: "Transcript downloaded successfully",
      })
    } catch (error) {
      toast({
        title: "Download Error",
        description: "Failed to download transcript",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!videoId) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleDownload} disabled={isLoading}>
          {isLoading ? "Downloading..." : "Download Transcript"}
        </Button>
      </div>
    </div>
  )
}
