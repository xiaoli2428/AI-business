require('dotenv').config();
const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const SYSTEM_PROMPT = `You are an elite autonomous AI business app builder. Generate complete, production-ready business applications.

REQUIREMENTS:
1. Complete working code - NO PLACEHOLDERS
2. ALL business functions integrated
3. Autonomous - NO user review needed
4. Production-ready with error handling
5. Security-first implementation
6. Scalable architecture
7. Database schemas included
8. API endpoints included
9. Deployment configuration
10. No presets - LOCKED and ready

OUTPUT: Complete source code only. No explanations.`;

async function buildApp(requirements) {
  console.log('🤖 Autonomous AI Builder');
  console.log('⚙️ Building: ' + requirements);
  console.log('Status: PRODUCTION READY\n');

  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 16000,
      system: SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: `Build complete business application: ${requirements}\n\nGenerate ENTIRE application with ALL business functions integrated. Production-ready code ONLY.`
      }]
    });

    const code = message.content[0].text;
    console.log('✅ Application generated successfully\n');
    return { status: 'success', code, autonomousMode: true };
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

module.exports = { buildApp };

if (require.main === module) {
  buildApp('Enterprise Dashboard with CRM, ERP, Analytics');
}
