import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Basic GET proxy: /proxy?url=https://example.com
app.get('/proxy', async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    const response = await fetch(targetUrl, {
      // Adjust method/headers if you want more advanced behavior
    });

    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.setHeader('content-type', contentType);
    }

    const body = await response.text();
    res.status(response.status).send(body);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch target URL' });
  }
});

app.get('/', (req, res) => {
  res.send('Simple proxy is running. Use /proxy?url=https://example.com');
});

app.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
});
