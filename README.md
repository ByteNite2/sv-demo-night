# SV Demo Night

## Overview
SV Demo Night is a simple UI application that allows users to generate images based on a text prompt using the ByteNite API. Users can specify the number of image replicas to generate and provide their API key for authentication.

## Features
- Input field for text prompts
- Selection field for the number of replicas (1 to 10)
- API key input for authentication
- Generate button to initiate the image generation process
- Loading spinner to indicate progress
- Image gallery to display generated images

## Project Structure
```
sv-demo-night
├── src
│   ├── App.tsx                # Main application component
│   ├── components
│   │   ├── ImageGenerator.tsx  # Handles image generation logic
│   │   ├── LoadingSpinner.tsx   # Displays loading animation
│   │   └── ImageGallery.tsx     # Displays generated images
│   ├── services
│   │   └── api.ts              # API service functions
│   ├── types
│   │   └── index.ts            # TypeScript types and interfaces
│   ├── styles
│   │   └── App.css             # CSS styles for the application
│   └── index.tsx               # Entry point of the application
├── public
│   └── index.html              # Main HTML file
├── package.json                # npm configuration file
├── tsconfig.json               # TypeScript configuration file
└── README.md                   # Project documentation
```

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   cd sv-demo-night
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the application:
   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000` to view the application.

## Usage
- Enter a prompt in the text field.
- Select the number of replicas from the dropdown.
- Input your API key.
- Click the "Generate" button to start the image generation process.
- A loading spinner will appear while the images are being generated.
- Once the images are ready, they will be displayed in the gallery.

## API Endpoints
- **Get Access Token**: `POST https://api.bytenite.com/v1/auth/access_token`
- **Create Job**: `POST https://api.bytenite.com/v1/customer/jobs`
- **Run Job**: `POST https://api.bytenite.com/v1/customer/jobs/{jobId}/run`
- **Get Job Results**: `GET https://api.bytenite.com/v1/customer/jobs/{jobId}/results`

## License
This project is licensed under the MIT License. See the LICENSE file for more details.