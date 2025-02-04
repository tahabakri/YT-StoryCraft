import axios from "axios"

async function fetchTranscriptWithAxios(videoId: string) {
  try {
    const response = await axios.get(`https://www.youtube.com/watch?v=${videoId}`)
    const html = response.data
    // Extract and parse the transcript data from the HTML
    // This is a simplified example and may need to be adjusted based on YouTube's actual HTML structure
    const transcriptData = extractTranscriptFromHtml(html)
    return transcriptData
  } catch (error) {
    console.error("Error fetching transcript with Axios:", error)
    return null
  }
}

function extractTranscriptFromHtml(html: string) {
  // This function would parse the HTML and extract the transcript data
  // The actual implementation would depend on the structure of YouTube's HTML
  // This is a placeholder implementation
  const transcriptMatch = html.match(/"captions":\s*({.*?})/)
  if (transcriptMatch && transcriptMatch[1]) {
    const transcriptData = JSON.parse(transcriptMatch[1])
    // Process and return the transcript data
    return transcriptData
  }
  return null
}

async function testYoutubeTranscriptFetch(videoId: string) {
  console.log("Testing YouTube transcript fetch")
  console.log("Video ID:", videoId)

  // Test with Axios
  console.log("Fetching with Axios:")
  const axiosResult = await fetchTranscriptWithAxios(videoId)
  console.log("Axios result type:", typeof axiosResult)
  console.log("Axios result:", axiosResult)

  // Test with native fetch
  console.log("Fetching with native fetch:")
  try {
    const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`)
    const html = await response.text()
    const fetchResult = extractTranscriptFromHtml(html)
    console.log("Fetch result type:", typeof fetchResult)
    console.log("Fetch result:", fetchResult)
  } catch (error) {
    console.error("Error fetching with native fetch:", error)
  }
}

export { testYoutubeTranscriptFetch }

