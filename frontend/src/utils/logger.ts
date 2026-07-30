export const logger = {
  info: (message: string, ...args: any[]) => {
    if (import.meta.env.DEV) {
      console.info(`[Tardis Info] ${message}`, ...args);
    }
  },
  warn: (message: string, ...args: any[]) => {
    if (import.meta.env.DEV) {
      console.warn(`[Tardis Warn] ${message}`, ...args);
    }
  },
  error: (message: string, ...args: any[]) => {
    // We log errors even in production, but without sensitive args if specified
    console.error(`[Tardis Error] ${message}`, ...args);
  }
};
