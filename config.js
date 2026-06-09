module.exports = {
  ai: {
    model: 'claude-opus-4-7',
    maxTokens: 16000,
    apiKey: process.env.ANTHROPIC_API_KEY
  },
  app: {
    name: 'Autonomous AI Business Builder',
    mode: 'production',
    autonomous: true,
    requiresUserReview: false,
    presets: 'locked'
  },
  security: {
    encryption: 'AES-256',
    https: true,
    csrfProtection: true
  }
};
