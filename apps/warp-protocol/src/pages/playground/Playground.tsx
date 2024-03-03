import { useState, useRef } from 'react';
import styles from './Playground.module.sass';
import { Container, UIElementProps } from '@terra-money/apps/components';
import { Button, Text } from 'components/primitives';
import MonacoEditor from '@monaco-editor/react';
import { editor as Editor } from 'monaco-editor';

import featherjsTypes from './types/featherjs.txt';
import sdkTypes from './types/sdk.txt';
import { useExamples } from './useExamples';
import { compileAndRunTS } from './compile';
import { EditorInput } from 'forms/QueryExprForm/EditorInput';

// Define a type for the output state
type OutputState = string;

// Define a type for the editor instance reference
type EditorInstance = Editor.IStandaloneCodeEditor | null;

type PlaygroundProps = UIElementProps & {};

export const Playground = (props: PlaygroundProps) => {
  const [output, setOutput] = useState<OutputState>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const editorRef = useRef<EditorInstance>(null);

  const runCode = async () => {
    const model = editorRef.current?.getModel();
    const code = model?.getValue() || '';

    try {
      setIsRunning(true);

      const result: string = await compileAndRunTS(code);

      console.log({ result });

      setOutput(result);
    } catch (error: any) {
      setOutput(error.toString());
    } finally {
      setIsRunning(false);
    }
  };

  const examples = useExamples();

  return (
    <Container direction="column" className={styles.root}>
      <Text variant="heading1" className={styles.title}>
        Playground
      </Text>
      <Container className={styles.center} direction="row">
        <MonacoEditor
          className={styles.editor}
          defaultLanguage="typescript"
          defaultValue={examples.simulate}
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
              (libName, typeDefs) => `declare module "${libName}" { ${typeDefs} }`,
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
            roundedSelection: true,
            readOnly: false,
            cursorStyle: 'line',
            automaticLayout: true,
            minimap: { enabled: false },
            scrollbar: {
              vertical: 'hidden',
              horizontal: 'hidden',
              useShadows: false,
            },
            lineNumbers: 'on',
            folding: false,
            glyphMargin: false,
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
            renderLineHighlight: 'none',
          }}
        />
        <Container className={styles.right} direction="column">
          <Button onClick={runCode} variant="primary" className={styles.run} loading={isRunning}>
            Run code
          </Button>
          <EditorInput
            rootClassName={styles.msg}
            className={styles.msg_editor}
            value={output}
            placeholder="Output will be rendered here."
            readOnly={true}
            label="Console output"
          />
        </Container>
      </Container>
    </Container>
  );
};
