'use client'

import { useEffect, useRef } from 'react'

interface WaveformVisualizerProps {
  audioUrl: string | null
  isPlaying: boolean
  className?: string
}

export function WaveformVisualizer({ audioUrl, isPlaying, className = '' }: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const animationFrameRef = useRef<number>(0)

  useEffect(() => {
    if (!audioUrl) return

    // Initialize audio context and analyzer
    const initializeAudio = async () => {
      if (!canvasRef.current) return

      // Create audio context if it doesn't exist
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext()
      }

      // Create analyzer if it doesn't exist
      if (!analyserRef.current) {
        analyserRef.current = audioContextRef.current.createAnalyser()
        analyserRef.current.fftSize = 256
      }

      // Create or update audio element
      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl)
        audioRef.current.crossOrigin = 'anonymous'
      } else {
        audioRef.current.src = audioUrl
      }

      // Connect audio to analyzer
      if (!sourceRef.current) {
        sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current)
        sourceRef.current.connect(analyserRef.current)
        analyserRef.current.connect(audioContextRef.current.destination)
      }
    }

    initializeAudio()

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [audioUrl])

  useEffect(() => {
    if (!audioRef.current || !analyserRef.current || !canvasRef.current) return

    if (isPlaying) {
      audioRef.current.play()
      drawWaveform()
    } else {
      audioRef.current.pause()
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isPlaying])

  const drawWaveform = () => {
    if (!canvasRef.current || !analyserRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      if (!ctx || !analyserRef.current) return

      animationFrameRef.current = requestAnimationFrame(draw)
      analyserRef.current.getByteFrequencyData(dataArray)

      ctx.fillStyle = '#1F1F1F'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const barWidth = (canvas.width / bufferLength) * 2.5
      let barHeight
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height

        // Create gradient for each bar
        const gradient = ctx.createLinearGradient(x, canvas.height - barHeight, x, canvas.height)
        gradient.addColorStop(0, '#9333ea') // purple-600
        gradient.addColorStop(1, '#db2777') // pink-600

        ctx.fillStyle = gradient
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight)

        x += barWidth + 1
      }
    }

    draw()
  }

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-24 rounded-lg ${className}`}
      width={1000}
      height={100}
    />
  )
}
