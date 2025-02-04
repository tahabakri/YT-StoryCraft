'use client'

import { useEffect, useState } from "react"
import { Progress } from "../../components/ui/progress"

interface ProgressBarProps {
  status: "idle" | "processing" | "complete" | "error"
  steps?: string[]
  currentStep?: number
}

export function ProgressBar({ 
  status, 
  steps = [
    "Analyzing video content",
    "Generating story outline",
    "Crafting narrative",
    "Adding details",
    "Finalizing story"
  ],
  currentStep = 0 
}: ProgressBarProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (status === "processing") {
      const stepSize = 100 / steps.length
      setProgress(Math.min((currentStep + 1) * stepSize, 95))
    } else if (status === "complete") {
      setProgress(100)
    } else if (status === "error") {
      setProgress(0)
    }
  }, [status, currentStep, steps.length])

  return (
    <div className="space-y-3">
      <div className="relative h-2 w-full rounded-full bg-[#252131] overflow-hidden">
        <Progress 
          value={progress}
          className="h-full w-full bg-gradient-to-r from-[#FF0000] to-[#6d6aff] transition-all"
        />
      </div>
      {status === "processing" && currentStep < steps.length && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">{steps[currentStep]}</span>
          <span className="text-gray-500">{Math.round(progress)}%</span>
        </div>
      )}
    </div>
  )
}
