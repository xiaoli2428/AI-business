const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

// Read the HTML file at build time
const indexHTML = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf-8');

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Build Apps AI - Autonomous Business App Builder</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      max-width: 800px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
      border: 1px solid rgba(255, 255, 255, 0.18);
    }
    h1 { font-size: 2.5em; margin-bottom: 20px; }
    .emoji { font-size: 3em; margin-bottom: 20px; }
    p { font-size: 1.2em; margin-bottom: 15px; line-height: 1.6; }
    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin: 30px 0;
    }
    .feature {
      background: rgba(255, 255, 255, 0.1);
      padding: 15px;
      border-radius: 10px;
      text-align: center;
    }
    .api-section {
      background: rgba(0, 0, 0, 0.2);
      padding: 20px;
      border-radius: 10px;
      margin-top: 30px;
    }
    code {
      background: rgba(0, 0, 0, 0.3);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
    }
    .endpoint {
      background: rgba(0, 0, 0, 0.3);
      padding: 15px;
      border-radius: 8px;
      margin: 10px 0;
      font-family: 'Courier New', monospace;
      overflow-x: auto;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="emoji">🤖</div>
    <h1>Autonomous AI Business App Builder</h1>
    <p>Production-ready AI model that generates complete business applications without user input.</p>
    
    <div class="features">
      <div class="feature">✅ Autonomous Generation</div>
      <div class="feature">✅ Production Ready</div>
      <div class="feature">✅ Enterprise Functions</div>
      <div class="feature">✅ Auto-Scaling</div>
    </div>

    <div class="api-section">
      <h2 style="margin-bottom: 15px;">API Endpoint</h2>
      <p style="font-size: 1em;">POST to generate complete applications:</p>
      <div class="endpoint">POST /api/build</div>
      <p style="font-size: 0.9em; margin-top: 10px;">Request body:</p>
      <div class="endpoint">
{
  "requirements": "Your app description"
}
      </div>
    </div>

    <p style="margin-top: 30px; font-size: 1em; opacity: 0.8;">
      <strong>Status:</strong> Live worldwide | <strong>Version:</strong> v1.0.0
    </p>
  </div>

  <!-- Vercel Web Analytics -->
  <script>
    window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  </script>
  <script defer src="/_vercel/insights/script.js"></script>
</body>
</html>
`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const client = new Anthropic({
      apiKey: env.ANTHROPIC_API_KEY
    });

    // Serve the HTML landing page for root path
    if (url.pathname === '/' || url.pathname === '/index.html') {
      return new Response(indexHTML, {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    if (url.pathname === '/api/build') {
      const { requirements } = await request.json();
      try {
        const message = await client.messages.create({
          model: 'claude-opus-4-7',
          max_tokens: 16000,
          system: `You are autonomous AI business app builder. Generate complete production-ready business applications with all functions integrated. NO user review needed.`,
          messages: [{ role: 'user', content: `Build: ${requirements}` }]
        });
        return new Response(JSON.stringify({ status: 'success', code: message.content[0].text }), { 
          headers: { 'Content-Type': 'application/json' } 
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
      }
    }

    // Serve HTML landing page with Vercel Analytics
    return new Response(HTML_PAGE, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
};
