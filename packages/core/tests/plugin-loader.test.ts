import { describe, it, expect } from 'vitest';
import { PluginLoader } from '../src/plugin-loader';

describe('PluginLoader', () => {
  it('should create a plugin loader instance', () => {
    const loader = new PluginLoader();
    expect(loader).toBeDefined();
    expect(loader.getPlugins()).toEqual([]);
  });
});