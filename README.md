# YouTube Story Generator

A web application that lets you discover YouTube videos and generate stories from them. Built with Next.js and the YouTube Data API.

## Features

- Search YouTube videos
- Browse by genres
- View trending videos
- Fetch video metadata including thumbnails and captions
- Generate stories from video content

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-story-generator.git
cd ai-story-generator
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with your YouTube API key:
```
NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key_here
```

To get a YouTube API key:
1. Go to the [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the YouTube Data API v3
4. Create credentials (API key)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Technology Stack

- [Next.js](https://nextjs.org/) - React framework
- [YouTube Data API v3](https://developers.google.com/youtube/v3) - YouTube integration
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## Environment Variables

- `NEXT_PUBLIC_YOUTUBE_API_KEY` - YouTube Data API key

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this code for your own projects.