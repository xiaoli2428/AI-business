const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

// Read the HTML file at build time
const indexHTML = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf-8');

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

    return new Response(JSON.stringify({ status: 'live', version: 'v1.0.0', domain: 'buildappsai.com' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
