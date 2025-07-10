import { ApiError } from '../middleware/errorHandler';

// Types for AI service
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

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

// OpenRouter API service
export class OpenRouterService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || '';
    this.baseUrl = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';

    if (!this.apiKey) {
      console.warn('⚠️  OpenRouter API key not found. Using fallback components.');
    }
  }

  // Generate component using AI
  async generateComponent(request: GenerateComponentRequest): Promise<any> {
    try {
      // If no API key, return fallback component
      if (!this.apiKey) {
        return this.getFallbackComponent(request.prompt);
      }

      const systemPrompt = this.buildSystemPrompt(request.designSystem);
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://figaroo.app',
          'X-Title': 'Figaroo AI Component Generator'
        },
        body: JSON.stringify({
          model: request.model,
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: request.prompt
            }
          ],
          max_tokens: 2000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as OpenRouterResponse;
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No content received from AI service');
      }

      // Parse the AI response to extract HTML and CSS
      return this.parseAIResponse(content);

    } catch (error) {
      console.error('AI generation error:', error);
      
      // Return fallback component on error
      return this.getFallbackComponent(request.prompt);
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

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://figaroo.app',
          'X-Title': 'Figaroo AI Component Optimizer'
        },
        body: JSON.stringify({
          model: request.model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert UI component optimizer. Improve the given component based on the optimization type requested.'
            },
            {
              role: 'user',
              content: optimizationPrompt
            }
          ],
          max_tokens: 2000,
          temperature: 0.5
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as OpenRouterResponse;
      const content = data.choices[0]?.message?.content;

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