const BYTENITE_BASE_URL = 'https://api.bytenite.com/v1';

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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { accessToken, prompt, numReplicas } = req.body;

    if (!accessToken || !prompt || !numReplicas) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Call ByteNite jobs endpoint
    const response = await fetch(`${BYTENITE_BASE_URL}/customer/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': accessToken,
      },
      body: JSON.stringify({
        templateId: "img-gen-diffusers-flux-gpu-template",
        description: "This job generates variations of images out of the same prompt using Flux Schnell.",
        name: "Job with img-gen-diffusers-flux-gpu-template",
        params: {
          partitioner: {
            num_replicas: numReplicas
          },
          assembler: {},
          app: {
            prompt: prompt
          }
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      return res.status(response.status).json({ 
        error: `Job creation failed: ${response.statusText}`,
        details: errorData 
      });
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('Create job API error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};
