import { Router } from 'express';
import { generateComponent } from '../controllers/aiController';
import { rateLimiter } from '../middleware/rateLimiter';

const router = Router();

// AI component generation endpoint
router.post('/generate-component', rateLimiter, generateComponent);

// Get available AI models
router.get('/models', (req, res) => {
  res.json({
    success: true,
    data: {
      models: [
        {
          id: 'mistralai/mistral-7b-instruct',
          name: 'Mistral 7B',
          tier: 'free',
          description: 'Fast and efficient model for basic component generation'
        },
        {
          id: 'deepseek/deepseek-chat-v3-0324',
          name: 'Deepseek v3',
          tier: 'free',
          description: 'Fast and efficient model for basic component generation'
        },
        {
          id: 'anthropic/claude-3.5-sonnet',
          name: 'Claude 3.5 Sonnet',
          tier: 'pro',
          description: 'High-quality component generation with advanced reasoning'
        },
        {
          id: 'openai/gpt-4-turbo',
          name: 'GPT-4 Turbo',
          tier: 'pro',
          description: 'Premium model for complex component generation'
        }
      ]
    }
  });
});

export default router; 