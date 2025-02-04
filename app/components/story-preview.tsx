'use client'

import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface StoryPreviewProps {
  content: string
  format: string
  className?: string
}

export function StoryPreview({ content, format, className }: StoryPreviewProps) {
  // Parse content into paragraphs
  const paragraphs = content.split('\n\n').filter(Boolean)

  // Apply format-specific styling
  const getFormatStyles = () => {
    switch (format.toLowerCase()) {
      case 'script':
        return 'font-mono text-sm leading-6'
      case 'poem':
        return 'font-serif text-center italic'
      case 'news-article':
        return 'font-sans text-base leading-7'
      case 'blog-post':
        return 'font-sans text-lg leading-8'
      default: // short-story
        return 'font-serif text-lg leading-8'
    }
  }

  return (
    <Card className={cn(
      "bg-[#1a1625] border-gray-800 overflow-hidden",
      className
    )}>
      <ScrollArea className="h-full">
        <div className="p-8">
          <div className={cn(
            "prose prose-invert max-w-none",
            "prose-p:text-gray-300",
            "prose-headings:text-white prose-headings:font-semibold",
            "prose-strong:text-white prose-strong:font-semibold",
            "prose-em:text-gray-300",
            "prose-code:text-purple-300",
            "prose-blockquote:border-l-purple-500 prose-blockquote:text-gray-300",
            getFormatStyles()
          )}>
            {/* Render paragraphs with proper spacing */}
            {paragraphs.map((paragraph, index) => {
              // Handle special formats
              if (format.toLowerCase() === 'script') {
                // Basic screenplay format detection
                if (paragraph.includes(':')) {
                  const [character, dialogue] = paragraph.split(':')
                  return (
                    <div key={index} className="mb-6">
                      <p className="uppercase mb-1">{character.trim()}</p>
                      <p className="ml-8">{dialogue.trim()}</p>
                    </div>
                  )
                }
                return <p key={index} className="mb-4 uppercase">{paragraph}</p>
              }

              if (format.toLowerCase() === 'poem') {
                return (
                  <p key={index} className="mb-6 whitespace-pre-line">
                    {paragraph}
                  </p>
                )
              }

              // Default paragraph rendering
              return <p key={index} className="mb-6">{paragraph}</p>
            })}
          </div>
        </div>
      </ScrollArea>
    </Card>
  )
}
