export async function generateStory(videoData: any, storyType: string) {
  const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY
  if (!apiKey) {
    throw new Error("GROQ API key is not set")
  }

  const prompt = `
    Based on the following YouTube video information, generate a ${storyType} story:
    Title: ${videoData.title}
    Description: ${videoData.description}
    Transcript: ${videoData.transcript}
    
    Please create an engaging and creative story that captures the essence of the video content.
  `

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      throw new Error(`GROQ API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error("Error generating story:", error)
    if (error instanceof Error) {
      throw new Error(`Failed to generate story: ${error.message}`)
    } else {
      throw new Error("An unknown error occurred while generating the story")
    }
  }
}

