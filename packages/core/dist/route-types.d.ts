import { IncomingMessage } from 'http';
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
export type Response = {
    status: number;
    headers: Record<string, string>;
    body: string | object;
};
export declare function json(data: any, init?: {
    status?: number;
    headers?: Record<string, string>;
}): Response;
export declare function redirect(url: string, init?: {
    status?: number;
    headers?: Record<string, string>;
}): Response;
