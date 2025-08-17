import { PluginManifest, PluginHooks } from './plugin-types';

export class PluginLoader {
  private plugins: Plugin[] = [];
  private hooks: PluginHooks[] = [];

  async loadPlugin(pluginPath: string): Promise<void> {
    try {
      // Dynamically import the plugin
      const pluginModule = await import(pluginPath);
      const pluginManifest: PluginManifest = pluginModule.default || pluginModule;
      
      // Create plugin instance
      const plugin: Plugin = {
        manifest: pluginManifest,
        module: pluginModule
      };
      
      // Add to plugins list
      this.plugins.push(plugin);
      
      // Register hooks if they exist
      if (pluginManifest.apex?.hooks) {
        this.hooks.push(pluginManifest.apex.hooks);
      }
      
      console.log(`Loaded plugin: ${pluginManifest.name}@${pluginManifest.version}`);
    } catch (error) {
      console.error(`Failed to load plugin from ${pluginPath}:`, error);
      throw error;
    }
  }

  async loadPlugins(pluginPaths: string[]): Promise<void> {
    for (const pluginPath of pluginPaths) {
      await this.loadPlugin(pluginPath);
    }
  }

  async runOnDevHooks(context: any): Promise<void> {
    for (const hook of this.hooks) {
      if (hook.onDev) {
        try {
          await hook.onDev(context);
        } catch (error) {
          console.error('Error running onDev hook:', error);
        }
      }
    }
  }

  async runOnBuildHooks(context: any): Promise<void> {
    for (const hook of this.hooks) {
      if (hook.onBuild) {
        try {
          await hook.onBuild(context);
        } catch (error) {
          console.error('Error running onBuild hook:', error);
        }
      }
    }
  }

  async runTransformHooks(context: any): Promise<any> {
    let result = context;
    for (const hook of this.hooks) {
      if (hook.transform) {
        try {
          result = await hook.transform(result);
        } catch (error) {
          console.error('Error running transform hook:', error);
        }
      }
    }
    return result;
  }

  async runOnRequestHooks(context: any): Promise<void> {
    for (const hook of this.hooks) {
      if (hook.onRequest) {
        try {
          await hook.onRequest(context);
        } catch (error) {
          console.error('Error running onRequest hook:', error);
        }
      }
    }
  }

  getPlugins(): Plugin[] {
    return this.plugins;
  }
}

interface Plugin {
  manifest: PluginManifest;
  module: any;
}