"use client"

import { useState } from "react"
import { YoutubeUrlForm } from "./components/youtube-url-form"
import { StoryEditor } from "./components/story-editor"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { type YouTubeVideo } from "./lib/youtube"
import { Search } from "lucide-react"

export default function Page() {
  const [videoData, setVideoData] = useState<YouTubeVideo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  const genres = [
    { name: 'Comedy', icon: '😄' },
    { name: 'Gaming', icon: '🎮' },
    { name: 'Tech', icon: '💻' },
    { name: 'Music', icon: '🎵' },
    { name: 'Education', icon: '📚' },
    { name: 'Science', icon: '🔬' },
    { name: 'Sports', icon: '⚽' },
    { name: 'Movies', icon: '🎬' },
  ]

  const handleGenreClick = async (genre: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/youtube-suggestions?type=genre&q=${encodeURIComponent(genre)}`)
      if (!response.ok) {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.error || "Failed to fetch videos for this genre",
          variant: "destructive"
        })
        return
      }
      const videos = await response.json()
      setVideoData(videos)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to the server",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/youtube-search?query=${encodeURIComponent(searchQuery)}`)
      if (!response.ok) {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.error || "Failed to fetch search results",
          variant: "destructive"
        })
        return
      }
      const videos = await response.json()
      setVideoData(videos)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to the server",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--youtube-dark)]">
      <header className="h-16 p-4 border-b border-[#2A2A2A] bg-[var(--youtube-dark)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-[var(--youtube-accent)] to-[var(--youtube-secondary)] rounded-lg motion-safe hover:scale-105 transition-all" />
            <span className="text-[var(--youtube-text-primary)] font-semibold text-lg">YT StoryCraft</span>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="split-screen">
          {/* Left Side - Video Feed */}
          <div className="overflow-y-auto custom-scrollbar h-full p-6">
            {isLoading ? (
              <div className="flex flex-col justify-center items-center h-48 text-[var(--youtube-text-secondary)]">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--youtube-accent)] border-t-transparent mb-4"></div>
                <p>Fetching videos...</p>
              </div>
            ) : videoData.length > 0 ? (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                {videoData.map((video) => (
                  <div key={video.id} className="thumbnail-container">
                    <div className="thumbnail-hover">
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-48 object-cover"
                      />
                      <button className="generate-button">Story It!</button>
                    </div>
                    <div className="thumbnail-content">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="text-[var(--youtube-text-primary)] font-medium line-clamp-2">
                            {video.title}
                          </h3>
                          <p className="text-[var(--youtube-text-secondary)] text-sm mt-1">
                            {video.channelTitle}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-[var(--youtube-text-secondary)] mt-8">
                Search for videos or select a genre to get started
              </div>
            )}
          </div>

          {/* Right Side - Search and Genres */}
          <div className="p-8 bg-[#0F0F0F] border-l border-[#2A2A2A]">
            <div className="search-container">
              <form onSubmit={handleSearch} className="search-bar-wrapper relative">
                <input
                  type="text"
                  placeholder="Search YouTube or paste a link"
                  className="search-bar pr-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--youtube-text-secondary)] hover:text-[var(--youtube-text-primary)] transition-colors"
                  disabled={isLoading}
                >
                  <Search className="h-5 w-5" />
                </button>
              </form>
            </div>

            <div className="genre-grid">
              {genres.map((genre, index) => (
                <button
                  key={genre.name}
                  onClick={() => handleGenreClick(genre.name)}
                  className={`genre-icon ${isLoading ? 'opacity-50' : 'pulse hover:scale-105'}`}
                  style={{ '--animation-delay': `${index * 0.1}s` } as any}
                  disabled={isLoading}
                >
                  <span className="text-3xl">{genre.icon}</span>
                  <span className="text-[var(--youtube-text-primary)] text-sm font-medium">
                    {genre.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  )
}
