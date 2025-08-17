import { IncomingMessage, ServerResponse } from 'http';

// Loader and Action types
export type LoaderFunction = (args: LoaderArgs) => Promise<Response> | Response;
export type ActionFunction = (args: ActionArgs) => Promise<Response> | Response;

export interface LoaderArgs {
  request: IncomingMessage;
  params: Record<string, string>;
  context: Record<string, any>;
}

export interface ActionArgs {
  request: IncomingMessage;
  params: Record<string, string>;
  context: Record<string, any>;
}

// Response helpers
export type Response = {
  status: number;
  headers: Record<string, string>;
  body: string | object;
};

export function json(data: any, init: { status?: number; headers?: Record<string, string> } = {}): Response {
  return {
    status: init.status || 200,
    headers: {
      'Content-Type': 'application/json',
      ...init.headers
    },
    body: JSON.stringify(data)
  };
}

export function redirect(url: string, init: { status?: number; headers?: Record<string, string> } = {}): Response {
  return {
    status: init.status || 302,
    headers: {
      Location: url,
      ...init.headers
    },
    body: ''
  };
}