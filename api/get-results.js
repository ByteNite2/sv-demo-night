const BYTENITE_BASE_URL = 'https://api.bytenite.com/v1';
const JSZip = require('jszip');

// Helper function to download and extract images from zip
async function downloadAndExtractZip(zipUrl) {
  try {
    console.log('Downloading zip from:', zipUrl);
    
    // Download the zip file
    const zipResponse = await fetch(zipUrl);
    if (!zipResponse.ok) {
      throw new Error(`Failed to download zip: ${zipResponse.statusText}`);
    }
    
    const zipBuffer = await zipResponse.arrayBuffer();
    const zip = new JSZip();
    const loadedZip = await zip.loadAsync(zipBuffer);
    
    const imageDataUrls = [];
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    
    // Extract all image files
    for (const filename in loadedZip.files) {
      const file = loadedZip.files[filename];
      if (!file.dir) {
        const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
        if (imageExtensions.includes(ext)) {
          console.log('Extracting image:', filename);
          const imageBlob = await file.async('arraybuffer');
          const base64 = Buffer.from(imageBlob).toString('base64');
          const mimeType = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : `image/${ext.slice(1)}`;
          const dataUrl = `data:${mimeType};base64,${base64}`;
          imageDataUrls.push(dataUrl);
        }
      }
    }
    
    console.log(`Extracted ${imageDataUrls.length} images from zip`);
    return imageDataUrls;
    
  } catch (error) {
    console.error('Error downloading/extracting zip:', error);
    throw error;
  }
}

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { accessToken, jobId } = req.query;

    if (!accessToken || !jobId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Call ByteNite results endpoint
    const response = await fetch(`${BYTENITE_BASE_URL}/customer/jobs/${jobId}/results`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': accessToken,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      return res.status(response.status).json({ 
        error: `Get results failed: ${response.statusText}`,
        details: errorData 
      });
    }

    const data = await response.json();
    
    // If we have results with zip URLs, extract images from them
    if (data.results && data.results.length > 0) {
      console.log(`Processing ${data.results.length} zip file(s)`);
      
      const allImages = [];
      
      for (let i = 0; i < data.results.length; i++) {
        const result = data.results[i];
        const zipUrl = result.url || result.link;
        
        if (zipUrl) {
          try {
            console.log(`Processing zip ${i + 1}/${data.results.length}: ${zipUrl}`);
            const images = await downloadAndExtractZip(zipUrl);
            allImages.push(...images);
          } catch (zipError) {
            console.error(`Failed to process zip ${i + 1}:`, zipError);
            // Continue with other zips even if one fails
          }
        }
      }
      
      if (allImages.length > 0) {
        // Return the extracted images as fake "results" with direct image URLs
        const processedResults = allImages.map((imageUrl, index) => ({
          url: imageUrl,
          id: `extracted_image_${index}`,
          type: 'image'
        }));
        
        console.log(`Successfully extracted ${allImages.length} images total`);
        return res.status(200).json({
          results: processedResults
        });
      } else {
        console.log('No images could be extracted from zip files');
        return res.status(404).json({ 
          error: 'No images found in zip files'
        });
      }
    }
    
    // If no results yet, return the original response (for polling)
    res.status(200).json(data);

  } catch (error) {
    console.error('Get results API error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};
