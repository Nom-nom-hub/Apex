import React from 'react';
export declare function Island({ component: Component, ...props }: {
    component: React.ComponentType<any>;
    [key: string]: any;
}): React.ReactElement<any, string | React.JSXElementConstructor<any>>;
export declare function getIslandRegistry(): Record<string, {
    component: React.ComponentType<any>;
    props: any;
}>;
export declare function clearIslandRegistry(): void;
