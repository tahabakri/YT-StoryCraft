"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function StoryTypeSelector({ onStoryTypeChange }: { onStoryTypeChange: (type: string) => void }) {
  const [selectedType, setSelectedType] = useState("fantasy")

  const handleTypeChange = (value: string) => {
    setSelectedType(value)
    onStoryTypeChange(value)
  }

  return (
    <div className="space-y-6 bg-[#2a2635] p-6 rounded-xl">
      <Tabs defaultValue="genre" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-[#1a1625]">
          <TabsTrigger value="genre">Genre</TabsTrigger>
          <TabsTrigger value="tone">Tone</TabsTrigger>
          <TabsTrigger value="format">Format</TabsTrigger>
        </TabsList>
        <TabsContent value="genre">
          <RadioGroup value={selectedType} onValueChange={handleTypeChange} className="grid grid-cols-2 gap-4">
            {["Fantasy", "Sci-Fi", "Thriller", "Romance", "Horror", "Comedy"].map((genre) => (
              <div key={genre} className="flex items-center space-x-2">
                <RadioGroupItem value={genre.toLowerCase()} id={genre.toLowerCase()} />
                <Label htmlFor={genre.toLowerCase()} className="text-white">
                  {genre}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </TabsContent>
        <TabsContent value="tone">
          <RadioGroup value={selectedType} onValueChange={handleTypeChange} className="grid grid-cols-2 gap-4">
            {["Inspirational", "Dramatic", "Sarcastic", "Neutral"].map((tone) => (
              <div key={tone} className="flex items-center space-x-2">
                <RadioGroupItem value={tone.toLowerCase()} id={tone.toLowerCase()} />
                <Label htmlFor={tone.toLowerCase()} className="text-white">
                  {tone}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </TabsContent>
        <TabsContent value="format">
          <RadioGroup value={selectedType} onValueChange={handleTypeChange} className="grid grid-cols-2 gap-4">
            {["Blog Post", "Poem", "Script", "Narrative", "Short Story"].map((format) => (
              <div key={format} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={format.toLowerCase().replace(" ", "-")}
                  id={format.toLowerCase().replace(" ", "-")}
                />
                <Label htmlFor={format.toLowerCase().replace(" ", "-")} className="text-white">
                  {format}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </TabsContent>
      </Tabs>
    </div>
  )
}

