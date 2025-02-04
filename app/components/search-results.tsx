'use client'

import { VideoPreview } from "./video-preview"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { type YouTubeVideo } from "@/app/lib/youtube"

const GENRES = [
  { label: 'All', value: '' },
  { label: 'Music', value: 'music' },
  { label: 'Gaming', value: 'gaming' },
  { label: 'Sports', value: 'sports' },
  { label: 'Entertainment', value: 'entertainment' },
  { label: 'Education', value: 'education' },
  { label: 'Science & Tech', value: 'tech' },
  { label: 'News', value: 'news' },
  { label: 'Movies', value: 'movies' },
  { label: 'Animation', value: 'animation' },
  { label: 'Comedy', value: 'comedy' }
]

interface SearchResultsProps {
  results: YouTubeVideo[]
  isLoading: boolean
  onVideoSelect: (videoId: string) => void
  onGenreSelect?: (genre: string) => void
  onTypeChange?: (type: 'search' | 'trending' | 'genre') => void
}

export function SearchResults({
  results,
  isLoading,
  onVideoSelect,
  onGenreSelect,
  onTypeChange
}: SearchResultsProps) {
  const [activeType, setActiveType] = useState<'search' | 'trending' | 'genre'>('search')
  const [selectedGenre, setSelectedGenre] = useState('')

  const handleTypeChange = (value: string) => {
    setActiveType(value as 'search' | 'trending' | 'genre')
    onTypeChange?.(value as 'search' | 'trending' | 'genre')
  }

  const handleGenreChange = (value: string) => {
    setSelectedGenre(value)
    onGenreSelect?.(value)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Tabs defaultValue="search" className="w-full" onValueChange={handleTypeChange}>
          <TabsList className="mb-4">
            <TabsTrigger value="search">Search Results</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="genre">By Genre</TabsTrigger>
          </TabsList>

          {activeType === 'genre' && (
            <div className="w-48">
              <Select value={selectedGenre} onValueChange={handleGenreChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Genre" />
                </SelectTrigger>
                <SelectContent>
                  {GENRES.map((genre) => (
                    <SelectItem key={genre.value} value={genre.value}>
                      {genre.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </Tabs>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeIn">
          {[...Array(6)].map((_, i) => (
            <VideoPreview key={i} isLoading={true} />
          ))}
        </div>
      ) : !results.length ? (
        <div className="text-center py-8 text-gray-400">
          No videos found. Try a different search term or category.
        </div>
      ) : (
        <ScrollArea className="h-[600px] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeIn">
            {results.map((video) => (
              <button
                key={video.id}
                onClick={() => onVideoSelect(video.id)}
                className="w-full text-left focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-lg"
              >
                <VideoPreview
                  videoId={video.id}
                  title={video.title}
                  duration={video.duration}
                  thumbnailUrl={video.thumbnailUrl}
                  channelTitle={video.channelTitle}
                  viewCount={video.viewCount?.toString()}
                  tags={video.tags}
                />
              </button>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
