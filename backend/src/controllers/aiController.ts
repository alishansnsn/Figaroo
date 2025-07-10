import { Request, Response, NextFunction } from 'express';
import { OpenRouterService } from '../services/openRouterService';
import { ApiError } from '../middleware/errorHandler';

// Initialize OpenRouter service
const openRouterService = new OpenRouterService();

// Generate component using AI
export const generateComponent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { prompt, model = 'mistralai/mistral-7b-instruct', designSystem } = req.body;

    // Validate required fields
    if (!prompt) {
      throw new ApiError('Prompt is required', 400);
    }

    // Validate prompt length
    if (prompt.length > 1000) {
      throw new ApiError('Prompt too long. Maximum 1000 characters allowed.', 400);
    }

    // Generate component using AI service
    const result = await openRouterService.generateComponent({
      prompt,
      model,
      designSystem
    });

    res.status(200).json({
      success: true,
      data: {
        component: result,
        model,
        prompt,
        timestamp: new Date().toISOString(),
        isFallback: result.isFallback,
        error: result.error,
        retryable: result.retryable
      }
    });

  } catch (error) {
    next(error);
  }
};

// Optimize existing component
export const optimizeComponent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { component, optimizationType, model = 'mistralai/mistral-7b-instruct' } = req.body;

    // Validate required fields
    if (!component || !optimizationType) {
      throw new ApiError('Component and optimization type are required', 400);
    }

    // Optimize component using AI service
    const result = await openRouterService.optimizeComponent({
      component,
      optimizationType,
      model
    });

    res.status(200).json({
      success: true,
      data: {
        optimizedComponent: result,
        optimizationType,
        model,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    next(error);
  }
}; 