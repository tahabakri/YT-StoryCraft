'use client'

import { useState } from "react"
import { Card } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Sparkles, Wand2, Zap, Layers, MessagesSquare } from "lucide-react"
import { useToast } from "../../components/ui/use-toast"
import { Progress } from "../../components/ui/progress"

interface EnhancementOption {
  id: string
  label: string
  description: string
  icon: React.ReactNode
}

const ENHANCEMENT_OPTIONS: EnhancementOption[] = [
  {
    id: "clarity",
    label: "Improve Clarity",
    description: "Make the story more clear and easy to understand",
    icon: <Sparkles className="w-4 h-4" />
  },
  {
    id: "engaging",
    label: "Make More Engaging",
    description: "Add more descriptive and vivid language",
    icon: <Wand2 className="w-4 h-4" />
  },
  {
    id: "pacing",
    label: "Improve Pacing",
    description: "Better flow and rhythm throughout the story",
    icon: <Zap className="w-4 h-4" />
  },
  {
    id: "structure",
    label: "Enhance Structure",
    description: "Better organization and story progression",
    icon: <Layers className="w-4 h-4" />
  },
  {
    id: "dialogue",
    label: "Polish Dialogue",
    description: "More natural and engaging conversations",
    icon: <MessagesSquare className="w-4 h-4" />
  }
]

interface EnhanceStoryProps {
  content: string
  onEnhance: (enhancedContent: string) => void
}

export function EnhanceStory({ content, onEnhance }: EnhanceStoryProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()

  const handleEnhance = async (optionId: string) => {
    setSelectedOption(optionId)
    setIsEnhancing(true)
    setProgress(0)

    try {
      // Simulated enhancement process with progress updates
      for (let i = 0; i <= 100; i += 20) {
        setProgress(i)
        await new Promise(resolve => setTimeout(resolve, 500))
      }

      // Replace with actual API call to enhance story
      const enhancedContent = `${content}\n\nEnhanced with ${optionId}...`
      onEnhance(enhancedContent)

      toast({
        title: "Story Enhanced",
        description: `Successfully applied ${
          ENHANCEMENT_OPTIONS.find(opt => opt.id === optionId)?.label
        }`
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Enhancement Failed",
        description: error instanceof Error ? error.message : "Failed to enhance story"
      })
    } finally {
      setIsEnhancing(false)
      setSelectedOption(null)
      setProgress(0)
    }
  }

  return (
    <Card className="bg-[#1a1625] border-gray-800 p-6 space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-white">Enhance Your Story</h3>
        <p className="text-sm text-gray-400">Select an enhancement to improve your story</p>
      </div>

      <div className="grid gap-3">
        {ENHANCEMENT_OPTIONS.map((option) => (
          <Button
            key={option.id}
            variant="outline"
            className={`w-full justify-start space-x-4 h-auto py-3 text-left
              bg-[#252131] border-gray-700 hover:bg-[#2a2635]
              ${isEnhancing && selectedOption === option.id ? 'relative overflow-hidden' : ''}
            `}
            onClick={() => handleEnhance(option.id)}
            disabled={isEnhancing}
          >
            <span className="text-purple-400">{option.icon}</span>
            <div className="flex-1">
              <p className="font-medium text-white">{option.label}</p>
              <p className="text-sm text-gray-400">{option.description}</p>
            </div>
            {isEnhancing && selectedOption === option.id && (
              <Progress 
                value={progress} 
                className="absolute bottom-0 left-0 h-1 w-full bg-[#1a1625]"
              />
            )}
          </Button>
        ))}
      </div>
    </Card>
  )
}
