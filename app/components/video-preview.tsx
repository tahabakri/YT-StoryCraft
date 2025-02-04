'use client'

import { Card } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Skeleton } from "@/components/ui/skeleton"

interface VideoPreviewProps {
  videoId?: string
  title?: string
  duration?: string
  thumbnailUrl?: string
  isLoading?: boolean
  channelTitle?: string
  viewCount?: string
  tags?: string[]
}

export function VideoPreview({ 
  videoId, 
  title,
  duration,
  thumbnailUrl,
  isLoading = false,
  channelTitle,
  viewCount,
  tags = []
}: VideoPreviewProps) {
  if (isLoading) {
    return (
      <Card className="bg-[#1a1625] border-gray-800 overflow-hidden animate-fadeIn">
        <AspectRatio ratio={16/9}>
          <Skeleton className="w-full h-full" />
        </AspectRatio>
        <div className="p-4 space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </Card>
    )
  }

  if (!videoId) {
    return null
  }

  return (
    <Card className="bg-[#1a1625] border-gray-800 overflow-hidden hover:bg-[#252131] transition-colors animate-fadeIn">
      <AspectRatio ratio={16/9}>
        <div className="relative w-full h-full">
          <img
            src={thumbnailUrl || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt={title}
            className="object-cover w-full h-full"
          />
          {duration && (
            <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 text-xs rounded">
              {duration}
            </div>
          )}
        </div>
      </AspectRatio>
      <div className="p-4">
        <h3 className="font-medium text-lg text-white line-clamp-2 mb-1">
          {title || 'Video Title'}
        </h3>
        {channelTitle && (
          <p className="text-sm text-gray-400 mb-2">
            {channelTitle}
          </p>
        )}
        <div className="flex items-center gap-2 mb-2">
          {viewCount && (
            <span className="text-xs text-gray-400">{viewCount}</span>
          )}
        </div>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 rounded-full bg-gray-800 text-xs text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
