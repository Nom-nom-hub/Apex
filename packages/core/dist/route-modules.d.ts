import { Route } from './router';
export interface RouteModuleInfo {
    route: Route;
    loaderPath?: string;
    actionPath?: string;
}
/**
 * Scans for loader and action files associated with routes
 */
export declare function scanRouteModules(routes: Route[]): RouteModuleInfo[];
