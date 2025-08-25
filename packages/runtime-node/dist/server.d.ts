export interface DevServerOptions {
    port?: number;
    routesDir: string;
}
export declare class DevServer {
    private server;
    private options;
    constructor(options: DevServerOptions);
    start(): Promise<void>;
    stop(): Promise<void>;
    private serveStaticAsset;
    private getContentType;
    private serveMetrics;
    private serveHydrationScript;
    private handleRequest;
}
