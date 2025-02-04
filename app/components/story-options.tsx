import { useState } from 'react'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"

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

const OPTIONS_CONFIG = {
  genre: ["Fantasy", "Sci-Fi", "Thriller", "Romance", "Horror", "Comedy"],
  tone: ["Inspirational", "Dramatic", "Sarcastic", "Neutral", "Mysterious", "Humorous"],
  style: ["Narrative", "Descriptive", "Expository", "Persuasive", "Poetic", "Conversational"],
  voice: ["Natural", "Formal", "Casual", "Professional", "Friendly", "Authoritative"],
  refine: [] // Handled separately with sliders
} satisfies Record<CategoryType, readonly string[]>

interface StoryOptionsProps {
  options: StoryOptions
  onOptionsChange: (options: StoryOptions) => void
  activeTab: CategoryType
}

interface RefinementSlider {
  id: string
  label: string
  min: number
  max: number
  step: number
  defaultValue: number
}

const REFINEMENT_SLIDERS: RefinementSlider[] = [
  {
    id: "creativity",
    label: "Creativity Level",
    min: 0,
    max: 100,
    step: 5,
    defaultValue: 50
  },
  {
    id: "detail",
    label: "Detail Level",
    min: 0,
    max: 100,
    step: 5,
    defaultValue: 50
  },
  {
    id: "complexity",
    label: "Complexity",
    min: 0,
    max: 100,
    step: 5,
    defaultValue: 50
  }
]

export function StoryOptions({ options, onOptionsChange, activeTab }: StoryOptionsProps) {
  const handleOptionChange = (category: keyof StoryOptions, value: string) => {
    onOptionsChange({
      ...options,
      [category]: value.toLowerCase().replace(/\s+/g, '-')
    })
  }

  const handleSliderChange = (sliderId: string, value: number) => {
    onOptionsChange({
      ...options,
      [sliderId]: value.toString()
    })
  }

  const renderOptionContent = () => {
    if (activeTab === 'refine') {
      return (
        <div className="space-y-6">
          {REFINEMENT_SLIDERS.map((slider) => (
            <div key={slider.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium text-white">
                  {slider.label}
                </Label>
                <span className="text-xs text-gray-400">
                  {options[slider.id as keyof typeof options] || slider.defaultValue}%
                </span>
              </div>
              <Slider
                value={[parseInt(options[slider.id as keyof typeof options] || slider.defaultValue.toString())]}
                onValueChange={(value) => handleSliderChange(slider.id, value[0])}
                max={slider.max}
                min={slider.min}
                step={slider.step}
                className="[&_[role=slider]]:bg-purple-600"
              />
            </div>
          ))}
        </div>
      )
    }

    return (
      <RadioGroup
        value={options[activeTab]}
        onValueChange={(value) => handleOptionChange(activeTab, value)}
        className="grid grid-cols-2 gap-3"
      >
        {OPTIONS_CONFIG[activeTab].map((option) => {
          const optionId = `${activeTab}-${option.toLowerCase().replace(/\s+/g, '-')}`
          const isSelected = options[activeTab] === option.toLowerCase().replace(/\s+/g, '-')
          
          return (
            <div key={optionId} className="relative">
              <RadioGroupItem
                value={option}
                id={optionId}
                className="peer sr-only"
              />
              <Label
                htmlFor={optionId}
                className={`
                  flex items-center justify-center w-full px-4 py-3 
                  rounded-lg cursor-pointer select-none
                  transition-all duration-200
                  border border-[#2F2F2F]
                  hover:bg-[#2F2F2F] hover:border-[#3F3F3F]
                  active:scale-95
                  peer-focus-visible:ring-2 peer-focus-visible:ring-purple-500/50
                  ${isSelected ? 
                    'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent shadow-lg' : 
                    'bg-[#1A1A1A] text-gray-300'
                  }
                `}
              >
                <span className="text-sm font-medium">{option}</span>
              </Label>
            </div>
          )
        })}
      </RadioGroup>
    )
  }

  return (
    <div className="space-y-6">
      {renderOptionContent()}
      
      <div className="space-y-2 pt-4 border-t border-[#2F2F2F]">
        <div className="flex items-center justify-between">
          <Label 
            htmlFor="custom-prompt" 
            className="text-sm font-medium text-white"
          >
            Custom Prompt
            <span className="ml-2 text-xs text-gray-500">Optional, max 200 characters</span>
          </Label>
          <span className="text-xs text-gray-500">
            {options.customPrompt?.length || 0}/200
          </span>
        </div>
        <Input
          id="custom-prompt"
          value={options.customPrompt || ''}
          onChange={(e) => onOptionsChange({
            ...options,
            customPrompt: e.target.value
          })}
          placeholder="Enter additional instructions or keywords..."
          maxLength={200}
          className="w-full bg-[#1A1A1A] border-[#2F2F2F] text-white 
            placeholder:text-gray-500 rounded-lg
            transition-all duration-200
            focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500
            hover:border-[#3F3F3F]"
        />
      </div>
    </div>
  )
}
