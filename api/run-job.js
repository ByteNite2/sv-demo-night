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
    const { accessToken, jobId } = req.body;

    if (!accessToken || !jobId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Call ByteNite run job endpoint
    const response = await fetch(`${BYTENITE_BASE_URL}/customer/jobs/${jobId}/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': accessToken,
      },
      body: JSON.stringify({
        config: {
          taskTimeout: "3600",
          jobTimeout: "84200",
          isTestJob: false
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      return res.status(response.status).json({ 
        error: `Job run failed: ${response.statusText}`,
        details: errorData 
      });
    }

    res.status(200).json({ success: true });

  } catch (error) {
    console.error('Run job API error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};
