import { ApiError } from '../middleware/errorHandler';

// Types for AI service
interface OpenRouterMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  max_tokens?: number;
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface GenerateComponentRequest {
  prompt: string;
  model: string;
  designSystem?: any;
}

interface OptimizeComponentRequest {
  component: any;
  optimizationType: string;
  model: string;
}

// OpenRouter API service
export class OpenRouterService {
  private apiKey: string;
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || '';
    this.baseUrl = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
    this.defaultHeaders = {
      'Authorization': `Bearer ${this.apiKey}`,
      'HTTP-Referer': 'https://figaroo.app',
      'X-Title': 'Figaroo AI',
      'Content-Type': 'application/json'
    };

    if (!this.apiKey) {
      console.warn('⚠️  OpenRouter API key not found. Using fallback components.');
    }
  }

  /**
   * Makes a chat completion request to OpenRouter API
   */
  private async chatCompletion(request: OpenRouterRequest): Promise<OpenRouterResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: this.defaultHeaders,
        body: JSON.stringify({
          ...request,
          temperature: request.temperature ?? 0.7,
          max_tokens: request.max_tokens ?? 1000
        })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new ApiError(
          `OpenRouter API error: ${response.status} - ${JSON.stringify(error)}`,
          response.status
        );
      }

      return await response.json() as OpenRouterResponse;
    } catch (error) {
      console.error('OpenRouter API call failed:', error);
      throw error;
    }
  }

  // Generate component using AI
  async generateComponent(request: GenerateComponentRequest): Promise<any> {
    try {
      // If no API key, return fallback component
      if (!this.apiKey) {
        const fallback = this.getFallbackComponent(request.prompt);
        return {
          ...fallback,
          isFallback: true,
          error: 'API key not configured. Using fallback component.',
          retryable: false
        };
      }

      const systemPrompt = this.buildSystemPrompt(request.designSystem);
      
      const response = await this.chatCompletion({
        model: request.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: request.prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const content = response.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No content received from AI service');
      }

      // Parse the AI response to extract HTML and CSS
      const result = this.parseAIResponse(content);
      return {
        ...result,
        isFallback: false
      };

    } catch (error) {
      console.error('AI generation error:', error);
      const errorObj = error as Error;
      
      // Determine if error is retryable
      const isRetryable = this.isRetryableError(errorObj);
      
      // Generate fallback component on error
      const fallbackResult = this.getFallbackComponent(request.prompt);
      return {
        ...fallbackResult,
        isFallback: true,
        error: this.getUserFriendlyError(errorObj),
        retryable: isRetryable
      };
    }
  }

  // Optimize existing component
  async optimizeComponent(request: OptimizeComponentRequest): Promise<any> {
    try {
      if (!this.apiKey) {
        return request.component; // Return original if no API key
      }

      const optimizationPrompt = this.buildOptimizationPrompt(
        request.component,
        request.optimizationType
      );

      const response = await this.chatCompletion({
        model: request.model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert at optimizing UI components. Provide only the optimized code.'
          },
          {
            role: 'user',
            content: optimizationPrompt
          }
        ],
        temperature: 0.5,
        max_tokens: 2000
      });

      const content = response.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No content received from AI service');
      }

      return this.parseAIResponse(content);

    } catch (error) {
      console.error('AI optimization error:', error);
      return request.component; // Return original on error
    }
  }

  // Build system prompt for component generation
  private buildSystemPrompt(designSystem?: any): string {
    let prompt = `You are an expert UI component generator. Create modern, accessible React components with Tailwind CSS.

Requirements:
- Generate clean, semantic HTML
- Use Tailwind CSS classes for styling
- Ensure accessibility (ARIA labels, semantic elements)
- Make components responsive
- Follow modern design principles
- Return only the HTML code, no explanations

Format your response as:
\`\`\`html
<component-html-here>
\`\`\`

\`\`\`css
<component-css-here>
\`\`\``;

    if (designSystem) {
      prompt += `\n\nDesign System Tokens:\n${JSON.stringify(designSystem, null, 2)}`;
    }

    return prompt;
  }

  // Build optimization prompt
  private buildOptimizationPrompt(component: any, optimizationType: string): string {
    return `Optimize this component for: ${optimizationType}

Component:
${JSON.stringify(component, null, 2)}

Return the optimized component in the same format.`;
  }

  // Parse AI response to extract HTML and CSS
  private parseAIResponse(content: string): any {
    try {
      // Extract HTML and CSS from markdown code blocks
      const htmlMatch = content.match(/```html\s*([\s\S]*?)\s*```/);
      const cssMatch = content.match(/```css\s*([\s\S]*?)\s*```/);

      const html = htmlMatch ? htmlMatch[1].trim() : '';
      const css = cssMatch ? cssMatch[1].trim() : '';

      return {
        html,
        css,
        raw: content
      };
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return {
        html: '<div>Error parsing component</div>',
        css: '',
        raw: content
      };
    }
  }

  // Determine if error is retryable
  private isRetryableError(error: Error): boolean {
    const message = error.message.toLowerCase();
    
    // Non-retryable errors
    const nonRetryablePatterns = [
      'api key not configured',
      'invalid api key',
      'unauthorized',
      'forbidden',
      'rate limit exceeded',
      'quota exceeded'
    ];
    
    return !nonRetryablePatterns.some(pattern => message.includes(pattern));
  }

  // Get user-friendly error message
  private getUserFriendlyError(error: Error): string {
    const message = error.message.toLowerCase();
    
    if (message.includes('network') || message.includes('fetch') || message.includes('timeout')) {
      return 'Connection issue. Please check your internet and try again.';
    }
    
    if (message.includes('api key') || message.includes('unauthorized') || message.includes('forbidden')) {
      return 'API configuration issue. Please check your settings.';
    }
    
    if (message.includes('rate limit') || message.includes('quota')) {
      return 'Rate limit reached. Please wait a moment and try again.';
    }
    
    if (message.includes('500') || message.includes('502') || message.includes('503')) {
      return 'Service temporarily unavailable. Please try again.';
    }
    
    return 'Something went wrong. Please try again.';
  }

  // Fallback component when API is unavailable
  private getFallbackComponent(prompt: string): any {
    return {
      html: `<div class="p-4 bg-white rounded-lg shadow-md border border-gray-200">
  <h3 class="text-lg font-semibold text-gray-800 mb-2">Generated Component</h3>
  <p class="text-gray-600">${prompt}</p>
  <div class="mt-4 flex gap-2">
    <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
      Primary Action
    </button>
    <button class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors">
      Secondary Action
    </button>
  </div>
</div>`,
      css: '',
      raw: 'Fallback component generated'
    };
  }
} 