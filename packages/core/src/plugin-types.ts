// Plugin manifest format
export interface PluginManifest {
  name: string;
  version: string;
  description?: string;
  author?: string;
  homepage?: string;
  repository?: string;
  license?: string;
  main?: string;
  module?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  apex?: {
    hooks?: PluginHooks;
    config?: Record<string, any>;
  };
}

// Plugin hooks
export interface PluginHooks {
  onDev?: (context: PluginContext) => Promise<void> | void;
  onBuild?: (context: PluginContext) => Promise<void> | void;
  transform?: (context: TransformContext) => Promise<TransformResult> | TransformResult;
  onRequest?: (context: RequestContext) => Promise<void> | void;
}

// Plugin context
export interface PluginContext {
  config: any;
  logger: Logger;
  // Add other context properties as needed
}

// Transform context
export interface TransformContext {
  code: string;
  id: string;
  // Add other transform context properties as needed
}

// Transform result
export interface TransformResult {
  code: string;
  map?: any;
  // Add other transform result properties as needed
}

// Request context
export interface RequestContext {
  request: any; // IncomingMessage or similar
  response: any; // ServerResponse or similar
  next: () => void;
  // Add other request context properties as needed
}

// Logger interface
export interface Logger {
  info: (message: string, ...args: any[]) => void;
  warn: (message: string, ...args: any[]) => void;
  error: (message: string, ...args: any[]) => void;
  debug: (message: string, ...args: any[]) => void;
}