"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderPage = renderPage;
const server_1 = require("react-dom/server");
const react_1 = __importDefault(require("react"));
/**
 * Minimal server renderer that inputs a React component and returns HTML string
 */
async function renderPage(PageComponent, props = {}) {
    try {
        // Create the React element
        const element = react_1.default.createElement(PageComponent, props);
        // Render to HTML string
        const html = (0, server_1.renderToString)(element);
        return {
            html
        };
    }
    catch (error) {
        console.error('Error rendering page:', error);
        throw error;
    }
}
