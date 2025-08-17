import { renderToString } from 'react-dom/server';
import React from 'react';

export interface RenderResult {
  html: string;
}

/**
 * Minimal server renderer that inputs a React component and returns HTML string
 */
export async function renderPage(PageComponent: React.ComponentType<any>, props: any = {}): Promise<RenderResult> {
  try {
    // Create the React element
    const element = React.createElement(PageComponent, props);
    
    // Render to HTML string
    const html = renderToString(element);
    
    return {
      html
    };
  } catch (error) {
    console.error('Error rendering page:', error);
    throw error;
  }
}