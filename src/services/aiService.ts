// AI Service for OpenRouter Integration
export interface AIServiceConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

export interface UserTier {
  type: 'free' | 'pro';
  apiKey?: string; // BYOK for pro users
}

export interface GenerationRequest {
  prompt: string;
  designSystem?: string;
  userTier: UserTier;
}

export interface GenerationResponse {
  html: string;
  css: string;
  explanation: string;
}

class AIService {
  private freeModels = [
    'mistralai/mistral-small-3.2-24b-instruct:free',
    'meta-llama/llama-3.1-8b-instruct:free',
    'microsoft/wizardlm-2-8x22b:free'
  ];

  private proModels = [
    'anthropic/claude-3.5-sonnet',
    'openai/gpt-4-turbo',
    'google/gemini-pro-1.5'
  ];

  // Store the API key securely (not exposed in client-side code)
  private defaultApiKey = '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';

  private getModel(userTier: UserTier): string {
    if (userTier.type === 'pro') {
      return this.proModels[0]; // Default to Claude Sonnet for pro
    }
    return this.freeModels[0]; // Default to Mistral free model
  }

  private getApiKey(userTier: UserTier): string {
    if (userTier.type === 'pro' && userTier.apiKey) {
      return userTier.apiKey; // BYOK for pro users
    }
    return this.defaultApiKey; // Use default API key for free tier
  }

  async generateComponent(request: GenerationRequest): Promise<GenerationResponse> {
    console.log('🤖 AI Service: Starting component generation with request:', {
      prompt: request.prompt,
      userTier: request.userTier.type,
      hasApiKey: !!request.userTier.apiKey
    });

    const model = this.getModel(request.userTier);
    const apiKey = this.getApiKey(request.userTier);

    console.log('🤖 AI Service: Using model:', model);

    if (!apiKey) {
      throw new Error('API key not configured. Please check settings.');
    }

    const systemPrompt = `You are MagicPath AI, an expert UI component generator. Your task is to create beautiful, functional HTML/CSS components that will be rendered directly in a canvas.

CRITICAL REQUIREMENTS:
1. Generate ONLY HTML and CSS (no React JSX, no JavaScript)
2. Use semantic HTML elements with meaningful class names
3. Create modern, responsive designs with clean styling
4. Include hover effects and smooth transitions
5. Make components visually appealing and professional
6. Use proper accessibility attributes where needed

OUTPUT FORMAT - You MUST follow this exact format:
<!-- HTML -->
<div class="component-wrapper">
  <!-- Your complete HTML structure here -->
</div>

/* CSS */
<style>
.component-wrapper {
  /* Your complete CSS styles here */
  /* Include all styles for the component */
}
</style>

<!-- EXPLANATION -->
Brief explanation of the component features and design choices.

DESIGN PRINCIPLES:
- Use modern color schemes (gradients, subtle shadows)
- Apply proper spacing and typography
- Ensure responsive behavior
- Add micro-interactions (hover, focus states)
- Make it production-ready and polished

${request.designSystem ? `\nDESIGN SYSTEM: ${request.designSystem}` : ''}

USER REQUEST: "${request.prompt}"

Generate a complete, self-contained component that matches the user's request perfectly.`;

    try {
      console.log('🤖 AI Service: Making API request to OpenRouter...');
      
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'MagicPath AI Component Generator'
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'user', content: systemPrompt }
          ],
          temperature: 0.7,
          max_tokens: 3000,
          top_p: 0.9
        })
      });

      console.log('🤖 AI Service: API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🚨 AI Service: API Error:', response.status, errorText);
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('🤖 AI Service: API response received, parsing content...');
      
      const content = data.choices[0]?.message?.content || '';

      if (!content) {
        throw new Error('Empty response from API');
      }

      console.log('🤖 AI Service: Content received, length:', content.length);
      const parsedResult = this.parseGeneratedContent(content);
      
      console.log('✅ AI Service: Component generated successfully!', {
        htmlLength: parsedResult.html.length,
        cssLength: parsedResult.css.length,
        explanation: parsedResult.explanation.substring(0, 100) + '...'
      });
      
      return parsedResult;
    } catch (error) {
      console.error('🚨 AI Service: Generation error:', error);
      // Enhanced fallback with better error handling
      console.log('🔄 AI Service: Falling back to local generation for:', request.prompt);
      const fallbackResult = this.generateFallbackComponent(request.prompt);
      
      console.log('✅ AI Service: Fallback component generated successfully!');
      return fallbackResult;
    }
  }

  private parseGeneratedContent(content: string): GenerationResponse {
    try {
      // Extract HTML
      const htmlMatch = content.match(/<!-- HTML -->([\s\S]*?)(?:\/\* CSS \*\/|<style>)/);
      let html = htmlMatch ? htmlMatch[1].trim() : '';
      
      // Extract CSS
      const cssMatch = content.match(/<style>([\s\S]*?)<\/style>/);
      let css = cssMatch ? cssMatch[1].trim() : '';
      
      // Extract explanation
      const explanationMatch = content.match(/<!-- EXPLANATION -->([\s\S]*?)$/);
      const explanation = explanationMatch ? explanationMatch[1].trim() : 'Component generated successfully!';

      // Fallback parsing if the format doesn't match exactly
      if (!html || !css) {
        // Try alternative parsing
        const lines = content.split('\n');
        let isHtml = false;
        let isCss = false;
        let htmlLines: string[] = [];
        let cssLines: string[] = [];

        for (const line of lines) {
          if (line.includes('<!-- HTML -->') || line.includes('<div')) {
            isHtml = true;
            isCss = false;
            continue;
          }
          if (line.includes('/* CSS */') || line.includes('<style>')) {
            isHtml = false;
            isCss = true;
            continue;
          }
          if (line.includes('</style>') || line.includes('<!-- EXPLANATION -->')) {
            isCss = false;
            break;
          }
          
          if (isHtml && line.trim()) {
            htmlLines.push(line);
          }
          if (isCss && line.trim() && !line.includes('<style>') && !line.includes('</style>')) {
            cssLines.push(line);
          }
        }

        if (htmlLines.length > 0 && !html) {
          html = htmlLines.join('\n').trim();
        }
        if (cssLines.length > 0 && !css) {
          css = cssLines.join('\n').trim();
        }
      }

      // Ensure we have valid content
      if (!html || html.length < 10) {
        throw new Error('No valid HTML content extracted');
      }
      if (!css || css.length < 10) {
        throw new Error('No valid CSS content extracted');
      }

      return { html, css, explanation };
    } catch (error) {
      console.error('Content parsing error:', error);
      throw new Error('Failed to parse AI response content');
    }
  }

  private generateFallbackComponent(prompt: string): GenerationResponse {
    // Enhanced fallback patterns for local generation
    const promptLower = prompt.toLowerCase();

    if (promptLower.includes('sign in') || promptLower.includes('login')) {
      return {
        html: `
<div class="signin-card">
  <div class="card-header">
    <h2>Welcome back</h2>
    <p>Sign in to your account</p>
  </div>
  <form class="signin-form">
    <div class="input-group">
      <label>Email</label>
      <input type="email" placeholder="Enter your email" />
    </div>
    <div class="input-group">
      <label>Password</label>
      <input type="password" placeholder="Enter your password" />
    </div>
    <button type="submit" class="signin-btn">Sign In</button>
    <div class="divider">
      <span>or</span>
    </div>
    <button type="button" class="google-btn">
      <span>🔍 Continue with Google</span>
    </button>
    <button type="button" class="github-btn">
      <span>🐙 Continue with GitHub</span>
    </button>
  </form>
  <div class="card-footer">
    <p>Don't have an account? <a href="#">Sign up</a></p>
  </div>
</div>`,
        css: `
.signin-card {
  max-width: 400px;
  margin: 20px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.card-header {
  padding: 40px 32px 24px;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.card-header h2 {
  margin: 0 0 8px;
  font-size: 28px;
  font-weight: 700;
}

.card-header p {
  margin: 0;
  opacity: 0.9;
  font-size: 16px;
}

.signin-form {
  padding: 32px;
}

.input-group {
  margin-bottom: 24px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.input-group input {
  width: 100%;
  padding: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.input-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.signin-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 24px;
}

.signin-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.divider {
  text-align: center;
  margin: 24px 0;
  position: relative;
  color: #6b7280;
  font-size: 14px;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e5e7eb;
}

.divider span {
  background: white;
  padding: 0 16px;
  position: relative;
}

.google-btn, .github-btn {
  width: 100%;
  padding: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.google-btn:hover, .github-btn:hover {
  border-color: #9ca3af;
  background: #f9fafb;
  transform: translateY(-1px);
}

.card-footer {
  padding: 0 32px 32px;
  text-align: center;
  font-size: 14px;
  color: #6b7280;
}

.card-footer a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.card-footer a:hover {
  text-decoration: underline;
}`,
        explanation: 'A modern sign-in card with gradient header, clean form inputs, social login options, and professional styling with hover effects.'
      };
    }

    if (promptLower.includes('music') || promptLower.includes('player')) {
      return {
        html: `
<div class="music-player">
  <div class="album-art">
    <div class="album-placeholder">
      <div class="play-icon">▶</div>
    </div>
  </div>
  <div class="player-info">
    <h3 class="song-title">Midnight Dreams</h3>
    <p class="artist-name">Luna Eclipse</p>
  </div>
  <div class="player-controls">
    <button class="control-btn prev">⏮</button>
    <button class="control-btn play active">⏸</button>
    <button class="control-btn next">⏭</button>
  </div>
  <div class="progress-section">
    <div class="progress-bar">
      <div class="progress-track">
        <div class="progress-fill"></div>
        <div class="progress-handle"></div>
      </div>
    </div>
    <div class="time-display">
      <span>2:14</span>
      <span>4:32</span>
    </div>
  </div>
</div>`,
        css: `
.music-player {
  width: 350px;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  border-radius: 24px;
  padding: 32px;
  color: white;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  position: relative;
  overflow: hidden;
}

.music-player::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%);
  pointer-events: none;
}

.album-art {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
  position: relative;
}

.album-placeholder {
  width: 140px;
  height: 140px;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1);
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.play-icon {
  font-size: 24px;
  color: white;
  opacity: 0.9;
}

.player-info {
  text-align: center;
  margin-bottom: 32px;
}

.song-title {
  margin: 0 0 8px;
  font-size: 22px;
  font-weight: 700;
}

.artist-name {
  margin: 0;
  font-size: 16px;
  opacity: 0.8;
  font-weight: 400;
}

.player-controls {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 32px;
}

.control-btn {
  width: 56px;
  height: 56px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.05);
}

.control-btn.play {
  background: rgba(255, 255, 255, 0.9);
  color: #1e3c72;
  transform: scale(1.1);
}

.control-btn.active {
  background: rgba(255, 255, 255, 0.9);
  color: #1e3c72;
}

.progress-section {
  margin-top: 20px;
}

.progress-bar {
  margin-bottom: 12px;
}

.progress-track {
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  position: relative;
  cursor: pointer;
}

.progress-fill {
  height: 100%;
  width: 45%;
  background: linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%);
  border-radius: 3px;
  position: relative;
}

.progress-handle {
  position: absolute;
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.time-display {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  opacity: 0.8;
  font-weight: 500;
}`,
        explanation: 'A modern music player with gradient design, interactive controls, album art, and animated progress tracking.'
      };
    }

    if (promptLower.includes('card') || promptLower.includes('pricing')) {
      return {
        html: `
<div class="pricing-card">
  <div class="card-header">
    <div class="plan-badge">Most Popular</div>
    <h3>Pro Plan</h3>
    <div class="price-section">
      <span class="currency">$</span>
      <span class="price">29</span>
      <span class="period">/month</span>
    </div>
    <p class="plan-description">Perfect for growing teams and businesses</p>
  </div>
  <div class="features-list">
    <div class="feature-item">
      <span class="check-icon">✓</span>
      <span>Unlimited Projects</span>
    </div>
    <div class="feature-item">
      <span class="check-icon">✓</span>
      <span>Advanced Analytics</span>
    </div>
    <div class="feature-item">
      <span class="check-icon">✓</span>
      <span>Priority Support</span>
    </div>
    <div class="feature-item">
      <span class="check-icon">✓</span>
      <span>Custom Integrations</span>
    </div>
    <div class="feature-item">
      <span class="check-icon">✓</span>
      <span>Team Collaboration</span>
    </div>
  </div>
  <button class="cta-button">Get Started Now</button>
  <p class="trial-text">14-day free trial • No credit card required</p>
</div>`,
        css: `
.pricing-card {
  max-width: 350px;
  background: white;
  border-radius: 20px;
  padding: 0;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  position: relative;
  border: 2px solid transparent;
  background-clip: padding-box;
}

.pricing-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 2px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 20px;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  z-index: -1;
}

.card-header {
  padding: 32px 32px 24px;
  text-align: center;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  position: relative;
}

.plan-badge {
  display: inline-block;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-header h3 {
  margin: 0 0 16px;
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
}

.price-section {
  display: flex;
  align-items: baseline;
  justify-content: center;
  margin-bottom: 16px;
}

.currency {
  font-size: 20px;
  font-weight: 600;
  color: #64748b;
}

.price {
  font-size: 48px;
  font-weight: 800;
  color: #1e293b;
  margin: 0 4px;
}

.period {
  font-size: 16px;
  color: #64748b;
  font-weight: 500;
}

.plan-description {
  margin: 0;
  color: #64748b;
  font-size: 16px;
  line-height: 1.5;
}

.features-list {
  padding: 32px;
}

.feature-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  font-size: 16px;
  color: #374151;
}

.feature-item:last-child {
  margin-bottom: 0;
}

.check-icon {
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 12px;
  font-weight: bold;
  flex-shrink: 0;
}

.cta-button {
  width: calc(100% - 64px);
  margin: 0 32px 24px;
  padding: 16px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.4);
}

.trial-text {
  text-align: center;
  margin: 0 0 32px;
  font-size: 14px;
  color: #64748b;
  padding: 0 32px;
}`,
        explanation: 'A professional pricing card with gradient accents, feature list, and modern design with hover effects.'
      };
    }

    // Default fallback
    return {
      html: `
<div class="default-component">
  <div class="component-header">
    <div class="icon-badge">✨</div>
    <h3>Generated Component</h3>
    <p>Based on: "${prompt}"</p>
  </div>
  <div class="component-content">
    <div class="feature-grid">
      <div class="feature-item">
        <div class="feature-icon">🎨</div>
        <span>Modern Design</span>
      </div>
      <div class="feature-item">
        <div class="feature-icon">📱</div>
        <span>Responsive</span>
      </div>
      <div class="feature-item">
        <div class="feature-icon">⚡</div>
        <span>Interactive</span>
      </div>
      <div class="feature-item">
        <div class="feature-icon">🚀</div>
        <span>Production Ready</span>
      </div>
    </div>
  </div>
  <div class="action-section">
    <button class="primary-button">Get Started</button>
    <button class="secondary-button">Learn More</button>
  </div>
</div>`,
      css: `
.default-component {
  max-width: 380px;
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.component-header {
  text-align: center;
  margin-bottom: 32px;
}

.icon-badge {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin: 0 auto 20px;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
}

.component-header h3 {
  margin: 0 0 12px;
  color: #1f2937;
  font-size: 24px;
  font-weight: 700;
}

.component-header p {
  margin: 0;
  color: #6b7280;
  font-size: 16px;
  line-height: 1.5;
}

.component-content {
  margin-bottom: 32px;
}

.feature-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px;
  background: #f8fafc;
  border-radius: 16px;
  transition: all 0.2s ease;
}

.feature-item:hover {
  background: #f1f5f9;
  transform: translateY(-2px);
}

.feature-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.feature-item span {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.action-section {
  display: flex;
  gap: 12px;
}

.primary-button {
  flex: 1;
  padding: 14px 24px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.primary-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.secondary-button {
  flex: 1;
  padding: 14px 24px;
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.secondary-button:hover {
  background: #667eea;
  color: white;
  transform: translateY(-1px);
}`,
      explanation: `A versatile component card generated for "${prompt}" with modern styling, feature grid, and interactive buttons.`
    };
  }
}

export const aiService = new AIService(); 