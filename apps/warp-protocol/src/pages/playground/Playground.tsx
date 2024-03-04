import { useState, useRef, useMemo } from 'react';
import styles from './Playground.module.sass';
import { Container, UIElementProps } from '@terra-money/apps/components';
import { Button, Link, Text } from 'components/primitives';
import MonacoEditor from '@monaco-editor/react';
import { editor as Editor } from 'monaco-editor';

import { Example, useExamples } from './useExamples';
import { compileAndRunTS } from './compile';
import { EditorInput } from 'forms/QueryExprForm/EditorInput';
import classNames from 'classnames';
import { useCopy } from 'hooks';
import { dependencies } from './types/dependencies';

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

      setOutput(result);
    } catch (error: any) {
      setOutput(error.toString());
    } finally {
      setIsRunning(false);
    }
  };

  const examples = useExamples();

  const tabTypes = useMemo(() => Object.keys(examples), [examples]);

  const [selectedExample, setSelectedExample] = useState<Example>(examples['simulate']);

  const copy = useCopy('code', selectedExample.code);

  return (
    <Container direction="column" className={styles.root}>
      <Container className={styles.title_container}>
        <Text variant="heading1" className={styles.title}>
          Playground
        </Text>
        <Link className={styles.back} to={-1}>
          Back
        </Link>
        <Text className={styles.description} variant="label">
          Explore and interact with live code examples using the Warp-SDK in below sandbox, equipped with a TypeScript
          editor with code completion.
        </Text>
      </Container>
      <Container className={styles.center} direction="row">
        <Container className={styles.left} direction="column">
          <Container className={styles.tabs} direction="row">
            {tabTypes.map((tabType) => (
              <Button
                key={tabType}
                className={classNames(styles.tab, tabType === selectedExample.name && styles.selected_tab)}
                onClick={() => setSelectedExample(examples[tabType])}
                variant="secondary"
              >
                {tabType}
              </Button>
            ))}

            <Button className={styles.copy} onClick={copy} variant="secondary">
              Copy
            </Button>
          </Container>
          <MonacoEditor
            className={styles.editor}
            defaultLanguage="typescript"
            value={selectedExample.code}
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

              // Iterate over each dependency and add it to the Monaco editor
              dependencies.forEach(({ libName, typeDefs }) => {
                addLibraryToMonacoEditor(
                  libName,
                  typeDefs,
                  (libName, typeDefs) => `declare module "${libName}" { ${typeDefs} }`,
                  (libName) => `${libName}.d.ts`
                );
              });
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
        </Container>
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
