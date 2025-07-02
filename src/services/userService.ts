// User Service for managing user tiers and settings
export interface UserSettings {
  tier: 'free' | 'pro';
  apiKey?: string; // BYOK for pro users
  preferredModel?: string;
  dailyUsage: number;
  lastResetDate: string;
}

export interface UsageLimits {
  free: {
    dailyGenerations: number;
    modelsAvailable: string[];
  };
  pro: {
    dailyGenerations: number;
    modelsAvailable: string[];
  };
}

class UserService {
  private storageKey = 'magicpath_user_settings';
  
  private defaultSettings: UserSettings = {
    tier: 'free',
    dailyUsage: 0,
    lastResetDate: new Date().toDateString()
  };

  private usageLimits: UsageLimits = {
    free: {
      dailyGenerations: 10,
      modelsAvailable: [
        'meta-llama/llama-3.1-8b-instruct:free',
        'microsoft/wizardlm-2-8x22b:free',
        'google/gemma-2-9b-it:free'
      ]
    },
    pro: {
      dailyGenerations: -1, // Unlimited
      modelsAvailable: [
        'anthropic/claude-3.5-sonnet',
        'openai/gpt-4-turbo',
        'google/gemini-pro-1.5'
      ]
    }
  };

  getUserSettings(): UserSettings {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const settings = JSON.parse(stored);
        // Reset daily usage if it's a new day
        if (settings.lastResetDate !== new Date().toDateString()) {
          settings.dailyUsage = 0;
          settings.lastResetDate = new Date().toDateString();
          this.saveUserSettings(settings);
        }
        return settings;
      }
    } catch (error) {
      console.error('Error loading user settings:', error);
    }
    return { ...this.defaultSettings };
  }

  saveUserSettings(settings: UserSettings): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving user settings:', error);
    }
  }

  canGenerateComponent(): { allowed: boolean; reason?: string } {
    const settings = this.getUserSettings();
    const limits = this.usageLimits[settings.tier];

    if (limits.dailyGenerations === -1) {
      return { allowed: true }; // Unlimited for pro
    }

    if (settings.dailyUsage >= limits.dailyGenerations) {
      return { 
        allowed: false, 
        reason: `Daily limit reached (${limits.dailyGenerations} generations). Upgrade to Pro for unlimited access.` 
      };
    }

    return { allowed: true };
  }

  incrementUsage(): void {
    const settings = this.getUserSettings();
    settings.dailyUsage += 1;
    this.saveUserSettings(settings);
  }

  upgradeToPro(apiKey?: string): void {
    const settings = this.getUserSettings();
    settings.tier = 'pro';
    if (apiKey) {
      settings.apiKey = apiKey;
    }
    this.saveUserSettings(settings);
  }

  updateApiKey(apiKey: string): void {
    const settings = this.getUserSettings();
    settings.apiKey = apiKey;
    this.saveUserSettings(settings);
  }

  getUsageStats(): { current: number; limit: number; percentage: number } {
    const settings = this.getUserSettings();
    const limits = this.usageLimits[settings.tier];
    
    if (limits.dailyGenerations === -1) {
      return { current: settings.dailyUsage, limit: -1, percentage: 0 };
    }

    const percentage = (settings.dailyUsage / limits.dailyGenerations) * 100;
    return { 
      current: settings.dailyUsage, 
      limit: limits.dailyGenerations, 
      percentage: Math.min(percentage, 100) 
    };
  }

  getAvailableModels(): string[] {
    const settings = this.getUserSettings();
    return this.usageLimits[settings.tier].modelsAvailable;
  }

  resetSettings(): void {
    localStorage.removeItem(this.storageKey);
  }
}

export const userService = new UserService(); 