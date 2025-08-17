export interface Route {
    path: string;
    filePath: string;
    isDynamic: boolean;
}
/**
 * Scans the routes directory and maps .page.tsx files to route paths
 * Supports nested directories and dynamic [param] syntax
 */
export declare function scanRoutes(routesDir: string): Route[];
/**
 * Matches a request path to a route
 */
export declare function matchRoute(routes: Route[], path: string): Route | null;
