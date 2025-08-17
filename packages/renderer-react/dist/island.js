"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Island = Island;
exports.getIslandRegistry = getIslandRegistry;
exports.clearIslandRegistry = clearIslandRegistry;
const react_1 = __importDefault(require("react"));
// Keep track of islands for hydration
let islandId = 0;
const islandRegistry = {};
// Island component that renders a marker on the server and hydrates on the client
function Island({ component: Component, ...props }) {
    // Generate a unique ID for this island
    const id = `island-${islandId++}`;
    // Register the island for client-side hydration
    if (typeof window === 'undefined') {
        // Server-side: register the island
        islandRegistry[id] = { component: Component, props };
    }
    // Server-side rendering
    if (typeof window === 'undefined') {
        return react_1.default.createElement('div', {
            id,
            'data-island': Component.name || 'Island',
            'data-props': JSON.stringify(props),
            children: react_1.default.createElement(Component, props)
        });
    }
    // Client-side rendering (during hydration)
    return react_1.default.createElement(Component, props);
}
// Function to get island registry for client-side hydration
function getIslandRegistry() {
    return islandRegistry;
}
// Function to clear island registry (for testing)
function clearIslandRegistry() {
    Object.keys(islandRegistry).forEach(key => delete islandRegistry[key]);
    islandId = 0;
}
