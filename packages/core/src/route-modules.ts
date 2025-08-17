import { join, basename } from 'path';
import { existsSync } from 'fs';
import { Route } from './router';

export interface RouteModuleInfo {
  route: Route;
  loaderPath?: string;
  actionPath?: string;
}

/**
 * Scans for loader and action files associated with routes
 */
export function scanRouteModules(routes: Route[]): RouteModuleInfo[] {
  return routes.map(route => {
    const baseFilePath = route.filePath.replace(/\.page\.tsx$/, '');
    
    const loaderPath = `${baseFilePath}.loader.ts`;
    const actionPath = `${baseFilePath}.action.ts`;
    
    return {
      route,
      loaderPath: existsSync(loaderPath) ? loaderPath : undefined,
      actionPath: existsSync(actionPath) ? actionPath : undefined
    };
  });
}