# SV Demo Night

A React-based image generation app powered by ByteNite's AI infrastructure, featuring the FLUX.1-schnell model running on NVIDIA A100 GPUs.

## 🚀 Live Demo

Visit: [https://sv-demo-night-7sd2xyq3a-fabio-caironis-projects.vercel.app](https://sv-demo-night-7sd2xyq3a-fabio-caironis-projects.vercel.app)

## ✨ Features

- **AI-Powered Image Generation**: Uses ByteNite's FLUX.1-schnell model
- **Batch Generation**: Create 1-10 image variations from a single prompt
- **Real-time Progress**: Live status updates during generation
- **Serverless Architecture**: CORS-free API calls via Vercel functions
- **Server-side Processing**: Zip extraction and image processing on the backend
- **Responsive Design**: Works on desktop and mobile devices
- **Secure API Integration**: Protected API key handling

## 🛠️ Technology Stack

- **Frontend**: React 17 with TypeScript
- **Backend**: Vercel Serverless Functions (Node.js)
- **Deployment**: Vercel Platform
- **Styling**: Custom CSS with modern animations
- **HTTP Client**: Axios for API communication
- **Image Processing**: JSZip for server-side zip extraction
- **AI Model**: black-forest-labs/FLUX.1-schnell
- **Infrastructure**: ByteNite platform on NVIDIA A100 40GB

## 🏗️ Project Structure

```
sv-demo-night/
├── public/
│   ├── index.html
│   ├── manifest.json
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── App.tsx              # Main application component
│   ├── index.tsx            # Application entry point
│   ├── components/
│   │   ├── ImageGenerator.tsx  # Core generation logic
│   │   ├── LoadingSpinner.tsx  # Loading animation
│   │   └── ImageGallery.tsx    # Image display grid
│   ├── services/
│   │   └── api.ts           # Vercel API integration
│   ├── styles/
│   │   └── App.css          # Application styling
│   └── types/
│       └── index.ts         # TypeScript definitions
├── api/
│   ├── auth.js              # Authentication endpoint
│   ├── create-job.js        # Job creation endpoint
│   ├── run-job.js           # Job execution endpoint
│   └── get-results.js       # Results & zip extraction endpoint
├── package.json
├── tsconfig.json
├── vercel.json              # Vercel configuration
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 14+ and npm
- ByteNite API key ([Get yours here](https://bytenite.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ByteNite2/sv-demo-night.git
   cd sv-demo-night
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📱 How to Use

1. **Enter your prompt**: Describe the image you want to generate
2. **Select quantity**: Choose 1-10 image variations
3. **Add API key**: Enter your ByteNite API key
4. **Generate**: Click the generate button and wait for results

### Example Prompts

- "A beautiful sunset over mountains with clouds"
- "A futuristic city with flying cars"
- "A peaceful forest with a waterfall"
- "An astronaut riding a horse on Mars"

## 🌐 Deployment

This app is deployed on **Vercel** with serverless functions handling ByteNite API integration.

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Local Development

```bash
# Start development server
npm start

# Build for production
npm run build
```

### Environment Requirements

- Node.js 16+ 
- Vercel account for deployment
- ByteNite API key

# Upload contents of 'build' folder to your web server
```

## 🔧 API Integration

The app integrates with ByteNite's API using this workflow:

1. **Authentication**: Convert API key to access token
2. **Job Creation**: Submit generation job with parameters
3. **Job Execution**: Start the image generation process
4. **Result Polling**: Monitor job status until completion
5. **Result Display**: Show generated images in the gallery

### Model Configuration

- **Model**: black-forest-labs/FLUX.1-schnell
- **Resolution**: 1024x1024 pixels
- **Hardware**: NVIDIA A100 40GB GPU
- **Inference Steps**: 4 (optimized for speed)
- **Guidance Scale**: 0.0 (classifier-free guidance disabled)

## 🎨 Customization

### Styling

Modify `src/styles/App.css` to customize the appearance:

- Colors and gradients
- Component layouts
- Animation effects
- Responsive breakpoints

### API Configuration

Update `src/services/api.ts` to:

- Change API endpoints
- Modify request parameters
- Add error handling
- Implement caching

## 🔒 Security Notes

- API keys are handled client-side only
- No server-side storage of credentials
- HTTPS required for production deployment
- CORS must be configured on ByteNite API

## 🐛 Troubleshooting

### Common Issues

1. **"Command not found" errors**
   ```bash
   # Install Node.js first
   brew install node  # macOS
   # or download from nodejs.org
   ```

2. **Build failures**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **API errors**
   - Verify your API key is correct
   - Check ByteNite service status
   - Monitor Vercel function logs for debugging

4. **Deployment issues**
   ```bash
   # Redeploy to Vercel
   vercel --prod
   
   # Check Vercel logs
   vercel logs [deployment-url]
   ```

## 📞 Support

- **ByteNite Documentation**: [docs.bytenite.com](https://docs.bytenite.com)
- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **GitHub Issues**: [Create an issue](https://github.com/ByteNite2/sv-demo-night/issues)
- **ByteNite Support**: [support@bytenite.com](mailto:support@bytenite.com)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [ByteNite](https://bytenite.com) AI infrastructure
- Powered by [FLUX.1-schnell](https://github.com/black-forest-labs/flux) model
- Created for SV Demo Night presentation

---

**Made with ❤️ using ByteNite AI Platform**
