export async function generateVoiceover(text: string, voiceId: string) {
  const apiKey = process.env.NEXT_PUBLIC_VITE_ELEVEN_LABS_API_KEY
  if (!apiKey) {
    throw new Error("Eleven Labs API key is not set")
  }

  const apiUrl = "https://api.elevenlabs.io/v1"

  try {
    const response = await fetch(`${apiUrl}/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        Accept: "audio/mpeg",
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Eleven Labs API error: ${response.status} ${response.statusText}`)
    }

    const audioBlob = await response.blob()
    return URL.createObjectURL(audioBlob)
  } catch (error) {
    console.error("Error generating voiceover:", error)
    if (error instanceof Error) {
      throw new Error(`Failed to generate voiceover: ${error.message}`)
    } else {
      throw new Error("An unknown error occurred while generating the voiceover")
    }
  }
}

