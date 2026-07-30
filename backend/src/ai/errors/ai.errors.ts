export class AIError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = 'AIError';
    this.statusCode = statusCode;
  }
}

export class AIValidationError extends AIError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'AIValidationError';
  }
}

export class AIRateLimitError extends AIError {
  constructor(message: string = 'Rate limit exceeded. Please try again later.') {
    super(message, 429);
    this.name = 'AIRateLimitError';
  }
}

export class AITimeoutError extends AIError {
  constructor(message: string = 'AI service timed out.') {
    super(message, 504);
    this.name = 'AITimeoutError';
  }
}

export class AIProviderError extends AIError {
  constructor(message: string = 'AI provider error occurred.', statusCode: number = 502) {
    super(message, statusCode);
    this.name = 'AIProviderError';
  }
}
