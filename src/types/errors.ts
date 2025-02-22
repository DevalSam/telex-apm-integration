export class APMError extends Error {
    constructor(message: string, public code: string) {
      super(message);
      this.name = 'APMError';
      // Needed for proper instanceof checks in compiled JavaScript
      Object.setPrototypeOf(this, new.target.prototype);
    }
  }
  
  export class ConfigurationError extends APMError {
    constructor(message: string) {
      super(message, 'CONFIGURATION_ERROR');
      this.name = 'ConfigurationError';
      Object.setPrototypeOf(this, new.target.prototype);
    }
  }
  
  export class ValidationError extends APMError {
    constructor(message: string) {
      super(message, 'VALIDATION_ERROR');
      this.name = 'ValidationError';
      Object.setPrototypeOf(this, new.target.prototype);
    }
  }