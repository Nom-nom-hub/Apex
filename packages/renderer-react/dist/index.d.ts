import React from 'react';
export interface RenderResult {
    html: string;
}
/**
 * Minimal server renderer that inputs a React component and returns HTML string
 */
export declare function renderPage(PageComponent: React.ComponentType<any>, props?: any): Promise<RenderResult>;
