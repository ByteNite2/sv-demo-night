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
    const { apiKey } = req.body;

    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }

    console.log('Calling ByteNite auth with API key length:', apiKey.length);

    // Call ByteNite auth endpoint
    const response = await fetch(`${BYTENITE_BASE_URL}/auth/access_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ apiKey: apiKey.trim() }),
    });

    console.log('ByteNite response status:', response.status);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }
      
      console.error('ByteNite auth failed:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      
      return res.status(response.status).json({ 
        error: `Authentication failed: ${response.statusText}`,
        details: errorData,
        status: response.status
      });
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('Auth API error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      details: error.toString()
    });
  }
};
