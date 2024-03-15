import * as esbuild from 'esbuild-wasm';
import { dependencies } from './types/dependencies';

declare global {
  interface Window {
    [key: string]: any;
    require: NodeRequire;
    signalExecutionComplete: any;
    signalExecutionFailed: any;
  }
}

let initialized = false;
let modulesLoaded = false;

// Dynamically load dependencies and provide them globally
async function loadDependencies() {
  if (modulesLoaded) {
    return;
  }

  try {
    // Iterate over the dependencyImports keys to load each module dynamically
    const loadedModules = await Promise.all(
      dependencies.map(async (dep) => {
        const module = await dep.import;
        return { safeName: dep.safeName, module };
      })
    );

    // Attach the loaded modules to the window object
    loadedModules.forEach(({ safeName, module }) => {
      window[safeName] = module;
    });

    modulesLoaded = true;
  } catch (error) {
    console.error('Failed to load dependencies:', error);
    throw error;
  }
}

async function initializeEsbuild(): Promise<void> {
  if (!initialized) {
    await esbuild.initialize({
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.20.1/esbuild.wasm',
    });
    initialized = true;
  }
}

// Custom Resolver Plugin to handle in-memory compilation
function customResolverPlugin(tsCode: string): esbuild.Plugin {
  return {
    name: 'custom-resolver',
    setup(build: esbuild.PluginBuild) {
      // Handle the virtual entry point.
      build.onResolve({ filter: /^index\.ts$/ }, (args) => ({ path: args.path, namespace: 'ts-code' }));

      // Return the TypeScript code for the virtual entry point.
      build.onLoad({ filter: /.*/, namespace: 'ts-code' }, () => ({ contents: tsCode, loader: 'ts' }));

      // Mark all dependencies as external
      // Directly mark dependencies as external based on the dependencies array
      build.onResolve({ filter: /.*/ }, (args) => {
        // Check if the imported module matches any libName in dependencies
        const isExternalDependency = dependencies.some((dep) => dep.libName === args.path);
        if (isExternalDependency) {
          return { path: args.path, external: true };
        }
        // Return undefined for non-external modules, allowing normal resolution
      });
    },
  };
}

// Function to compile and execute the TypeScript code
export async function compileAndRunTS(tsCode: string): Promise<string> {
  await initializeEsbuild();
  await loadDependencies();

  const originalConsoleLog = console.log;
  const originalRequire = window.require;

  try {
    // @ts-ignore
    window.require = function (moduleName) {
      const module = dependencies.find((d) => d.libName === moduleName);

      if (module) {
        return window[module.safeName];
      }
      return originalRequire(moduleName);
    };

    // Define a promise that will be resolved when the eval code signals completion
    const executionCompletePromise = new Promise<string>((resolve, reject) => {
      // Signal function to indicate completion
      window.signalExecutionComplete = () => {
        resolve(capturedLogs.join('\n'));
      };

      window.signalExecutionFailed = (err: any) => {
        reject(err);
      };
    });

    const extendedCode = `
    ${tsCode}
  
    (async () => {      
      try {
        await main();
      } catch (err) {
        window.signalExecutionFailed(err);
      } finally {
        window.signalExecutionComplete();
      }
    })();
  `;

    const result = await esbuild.build({
      entryPoints: ['index.ts'],
      bundle: true,
      write: false,
      plugins: [customResolverPlugin(extendedCode)],
      define: { 'process.env.NODE_ENV': '"production"' },
      format: 'iife',
      globalName: 'sandboxedCode',
    });

    let capturedLogs: string[] = [];

    // Override console.log
    console.log = (...messages: any[]) => {
      capturedLogs.push(messages.join(' '));
    };

    try {
      // eslint-disable-next-line no-eval
      eval(result.outputFiles![0].text);

      // Wait for the signal that the execution is complete
      const res = await executionCompletePromise;
      return res;
    } catch (error: any) {
      console.error('Error executing script: ', error);
      capturedLogs.push(`Error executing script: ${error}`);

      if (error.name === 'AxiosError') {
        capturedLogs.push(error.response.data.message);
      }
    }

    return capturedLogs.join('\n');
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    console.log = originalConsoleLog;
    window.require = originalRequire;
    delete window.signalExecutionComplete;
    delete window.signalExecutionFailed;
  }
}
