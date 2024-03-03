import * as esbuild from 'esbuild-wasm';

declare global {
  interface Window {
    WarpSDK: any; // Specify more accurate types if available
    FeatherJS: any; // Specify more accurate types if available
    require: NodeRequire;
  }
}

// Ensure ESBuild is initialized
let initialized = false;

loadDependencies();

// Dynamically load dependencies and provide them globally
async function loadDependencies() {
  try {
    // Assuming these modules attach themselves to the window or a similar global object
    const [warpSDK, featherJS] = await Promise.all([
      import('@terra-money/warp-sdk'),
      import('@terra-money/feather.js'),
    ]);

    // Optionally attach to global scope if necessary
    window.WarpSDK = warpSDK;
    window.FeatherJS = featherJS;
  } catch (error) {
    console.error('Failed to load dependencies:', error);
    throw error;
  }
}

async function initializeEsbuild(): Promise<void> {
  if (!initialized) {
    await esbuild.initialize({
      wasmURL: 'https://unpkg.com/esbuild-wasm/esbuild.wasm',
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

      build.onResolve({ filter: /^@terra-money\// }, (args) => ({ path: args.path, external: true }));
    },
  };
}

// Function to compile and execute the TypeScript code
export async function compileAndRunTS(tsCode: string): Promise<string> {
  const originalConsoleLog = console.log;
  const originalRequire = window.require;

  try {
    await initializeEsbuild();
    await loadDependencies();

    // @ts-ignore
    window.require = function (moduleName) {
      if (moduleName === '@terra-money/warp-sdk') {
        return window.WarpSDK; // Assuming WarpSDK is loaded globally
      } else if (moduleName === '@terra-money/feather.js') {
        return window.FeatherJS; // Assuming FeatherJS is loaded globally
      }
      return originalRequire(moduleName);
    };

    const result = await esbuild.build({
      entryPoints: ['index.ts'],
      bundle: true,
      write: false,
      plugins: [customResolverPlugin(tsCode)],
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

      const res = (await new Promise((resolve) => setTimeout(() => resolve(capturedLogs.join('\n')), 3000))) as string;

      return res;
    } catch (error) {
      console.error('Error executing script: ', error);
      capturedLogs.push(`Error executing script: ${error}`);
    }

    return capturedLogs.join('\n');
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    console.log = originalConsoleLog;
    window.require = originalRequire;
  }
}
