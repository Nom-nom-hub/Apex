"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanRouteModules = scanRouteModules;
const fs_1 = require("fs");
/**
 * Scans for loader and action files associated with routes
 */
function scanRouteModules(routes) {
    return routes.map(route => {
        const baseFilePath = route.filePath.replace(/\.page\.tsx$/, '');
        const loaderPath = `${baseFilePath}.loader.ts`;
        const actionPath = `${baseFilePath}.action.ts`;
        return {
            route,
            loaderPath: (0, fs_1.existsSync)(loaderPath) ? loaderPath : undefined,
            actionPath: (0, fs_1.existsSync)(actionPath) ? actionPath : undefined
        };
    });
}
