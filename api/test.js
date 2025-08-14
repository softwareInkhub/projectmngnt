// Simple test API to verify setup
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Test response
  return res.status(200).json({ 
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    env: {
      hasAwsKey: !!process.env.AWS_ACCESS_KEY_ID,
      hasAwsSecret: !!process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION
    }
  });
}
