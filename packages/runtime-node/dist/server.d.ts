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
    private handleRequest;
    private executeLoader;
    private executeAction;
    private extractParams;
    private sendResponse;
}
