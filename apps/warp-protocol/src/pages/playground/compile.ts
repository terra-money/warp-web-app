import * as esbuild from 'esbuild-wasm';

declare global {
  interface Window {
    WarpSDK: any;
    FeatherJS: any;
    require: NodeRequire;
    signalExecutionComplete: any;
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

    // Define a promise that will be resolved when the eval code signals completion
    const executionCompletePromise = new Promise<string>((resolve) => {
      // Signal function to indicate completion
      window.signalExecutionComplete = () => {
        resolve(capturedLogs.join('\n'));
      };
    });

    const extendedCode = `
    ${tsCode}
  
    (async () => {      
      try {
        await main();
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
    delete window.signalExecutionComplete;
  }
}
