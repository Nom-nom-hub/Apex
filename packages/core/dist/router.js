"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanRoutes = scanRoutes;
exports.matchRoute = matchRoute;
const path_1 = require("path");
const fs_1 = require("fs");
/**
 * Scans the routes directory and maps .page.tsx files to route paths
 * Supports nested directories and dynamic [param] syntax
 */
function scanRoutes(routesDir) {
    const routes = [];
    try {
        // Check if the directory exists
        if (!(0, fs_1.statSync)(routesDir).isDirectory()) {
            return routes;
        }
    }
    catch (e) {
        // Directory doesn't exist, return empty array
        return routes;
    }
    function scanDirectory(dir, basePath = '') {
        const entries = (0, fs_1.readdirSync)(dir);
        for (const entry of entries) {
            const fullPath = (0, path_1.join)(dir, entry);
            let stats;
            try {
                stats = (0, fs_1.statSync)(fullPath);
            }
            catch (e) {
                // Skip files that can't be accessed
                continue;
            }
            if (stats.isDirectory()) {
                // Recursively scan subdirectories
                const routeSegment = entry.startsWith('[') && entry.endsWith(']')
                    ? entry
                    : entry;
                scanDirectory(fullPath, basePath ? (0, path_1.join)(basePath, routeSegment) : routeSegment);
            }
            else if (stats.isFile() && entry.endsWith('.page.tsx')) {
                // Process .page.tsx files
                const fileName = (0, path_1.basename)(entry, '.page.tsx');
                const routeSegment = fileName === 'index'
                    ? ''
                    : (fileName.startsWith('[') && fileName.endsWith(']')
                        ? fileName
                        : fileName);
                let routePath;
                if (routeSegment) {
                    routePath = basePath ? (0, path_1.join)(basePath, routeSegment) : routeSegment;
                }
                else {
                    routePath = basePath;
                }
                // Convert to URL path format
                const urlPath = routePath
                    .replace(/\\/g, '/') // Normalize path separators
                    .replace(/^\/+/, ''); // Remove leading slashes
                const finalPath = urlPath ? `/${urlPath}` : '/';
                routes.push({
                    path: finalPath,
                    filePath: fullPath,
                    isDynamic: entry.includes('[') || basePath.includes('[')
                });
            }
        }
    }
    scanDirectory(routesDir);
    // Sort routes to match the expected order in tests
    return routes.sort((a, b) => {
        // Static routes first
        if (a.isDynamic && !b.isDynamic)
            return 1;
        if (!a.isDynamic && b.isDynamic)
            return -1;
        // Special case for root path
        if (a.path === '/' && b.path !== '/')
            return -1;
        if (a.path !== '/' && b.path === '/')
            return 1;
        // For dynamic routes, sort by the first path segment to match test expectations
        if (a.isDynamic && b.isDynamic) {
            const aFirstSegment = a.path.split('/')[1];
            const bFirstSegment = b.path.split('/')[1];
            // If one starts with [ and the other doesn't, put the non-[ one first
            if (aFirstSegment.startsWith('[') && !bFirstSegment.startsWith('['))
                return 1;
            if (!aFirstSegment.startsWith('[') && bFirstSegment.startsWith('['))
                return -1;
        }
        // Sort alphabetically within the same type
        return a.path.localeCompare(b.path);
    });
}
/**
 * Matches a request path to a route
 */
function matchRoute(routes, path) {
    // Normalize path
    const normalizedPath = path === '/' ? '/' : path.replace(/\/$/, '');
    // First try exact match
    const exactMatch = routes.find(route => route.path === normalizedPath);
    if (exactMatch) {
        return exactMatch;
    }
    // Then try dynamic matching
    for (const route of routes) {
        if (route.isDynamic) {
            const routeParts = route.path.split('/').filter(Boolean);
            const pathParts = normalizedPath.split('/').filter(Boolean);
            if (routeParts.length === pathParts.length) {
                let matches = true;
                for (let i = 0; i < routeParts.length; i++) {
                    if (routeParts[i].startsWith('[') && routeParts[i].endsWith(']')) {
                        // Dynamic segment, always matches
                        continue;
                    }
                    else if (routeParts[i] !== pathParts[i]) {
                        // Static segment, must match exactly
                        matches = false;
                        break;
                    }
                }
                if (matches) {
                    return route;
                }
            }
        }
    }
    return null;
}
