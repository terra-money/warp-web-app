import { useState, useRef } from 'react';
import styles from './Playground.module.sass';
import { Container, UIElementProps } from '@terra-money/apps/components';
import { Text } from 'components/primitives';
import MonacoEditor from '@monaco-editor/react';
import { editor as Editor } from 'monaco-editor';

import featherjsTypes from './types/featherjs.txt';
import sdkTypes from './types/sdk.txt';
import { useExamples } from './useExamples';

// Define a type for the output state
type OutputState = string;

// Define a type for the editor instance reference
type EditorInstance = Editor.IStandaloneCodeEditor | null;

type PlaygroundProps = UIElementProps & {};

declare const ts: any; // Assuming the TypeScript compiler is loaded globally

function transpileTypeScript(code: string): string {
  const result = ts.transpileModule(code, {
    compilerOptions: {
      module: ts.ModuleKind.None, // No module system, you could simulate it if necessary
      strict: true,
      esModuleInterop: true,
      target: ts.ScriptTarget.ES2015, // Target ES5 for browser compatibility
    },
  });
  return result.outputText;
}

function executeJavaScript(jsCode: string): string {
  const originalConsoleLog = console.log;
  let capturedLogs: string[] = [];

  // Override console.log
  console.log = (...messages: any[]) => {
    capturedLogs.push(messages.join(' '));
  };

  try {
    // eslint-disable-next-line no-new-func
    new Function(jsCode)();
  } catch (error) {
    console.error('Error executing script: ', error);
    capturedLogs.push(`Error executing script: ${error}`);
  }

  // Restore original console.log
  console.log = originalConsoleLog;

  return capturedLogs.join('\n');
}

function executeTypeScriptCode(tsCode: string): string {
  const jsCode = transpileTypeScript(tsCode);
  return executeJavaScript(jsCode);
}

export const Playground = (props: PlaygroundProps) => {
  const [output, setOutput] = useState<OutputState>('');
  const editorRef = useRef<EditorInstance>(null);

  const runCode = (): void => {
    const model = editorRef.current?.getModel();
    const code = model?.getValue() || '';

    try {
      const result: string = executeTypeScriptCode(code);
      setOutput(result);
    } catch (error: any) {
      setOutput(error.toString());
    }
  };

  const examples = useExamples();

  return (
    <Container direction="column" className={styles.root}>
      <Text variant="heading1" className={styles.title}>
        Playground
      </Text>
      <div className={styles.editorContainer}>
        <MonacoEditor
          height="400px"
          defaultLanguage="typescript"
          defaultValue={examples.eris}
          theme="vs-dark"
          onMount={async (editor, monaco) => {
            editorRef.current = editor;

            async function addLibraryToMonacoEditor(
              libName: string,
              typeDefs: string,
              composeModule: (libName: string, typeDefs: string) => string,
              composeLibPath: (libName: string) => string
            ) {
              try {
                monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
                  target: monaco.languages.typescript.ScriptTarget.ES2015,
                  allowNonTsExtensions: true,
                  module: monaco.languages.typescript.ModuleKind.ES2015,
                  noEmit: true,
                  esModuleInterop: true,
                });

                monaco.languages.typescript.typescriptDefaults.addExtraLib(
                  composeModule(libName, typeDefs),
                  composeLibPath(libName)
                );
              } catch (error) {
                console.error('Failed to load type definitions:', error);
              }
            }

            addLibraryToMonacoEditor(
              '@terra-money/warp-sdk',
              sdkTypes as any,
              (libName, typeDefs) => `declare module "${libName}" { 
              export * from "index";
            }
            
            ${typeDefs}`,
              (libName) => `${libName}.d.ts`
            );

            addLibraryToMonacoEditor(
              '@terra-money/feather.js',
              featherjsTypes as any,
              (libName, typeDefs) => `declare module "${libName}" { ${typeDefs} }`,
              (libName) => `${libName}.d.ts`
            );
          }}
          options={{
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnly: false,
            cursorStyle: 'line',
            automaticLayout: true,
          }}
        />
      </div>
      <button onClick={runCode} className={styles.runButton}>
        Run
      </button>
      <div className={styles.outputContainer}>
        <Text variant="text">Console Output:</Text>
        <div>{output}</div>
      </div>
    </Container>
  );
};
