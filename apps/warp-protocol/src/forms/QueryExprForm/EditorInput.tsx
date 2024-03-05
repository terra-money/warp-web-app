import classNames from 'classnames';
import styles from './EditorInput.module.sass';
import React, { ReactNode, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { Text, Button } from 'components/primitives';
import { ClickAwayListener, Portal } from '@mui/material';

import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-text';
import 'ace-builds/src-noconflict/theme-merbivore';
import { Container } from '@terra-money/apps/components';
import CustomTextSyntaxMode from './CustomTextSyntaxMode';
import { SuggestItemsMenu } from './SuggestItemsMenu';
import { variableName } from 'utils/variable';
import CustomJsonSyntaxMode from './CustomJsonSyntaxMode';
import { IAceEditor } from 'react-ace/lib/types';
import { base64encode, warp_resolver } from '@terra-money/warp-sdk';
import { useWarpSdk } from '@terra-money/apps/hooks';
import { useQueryExample } from 'pages/variables/details/query/QueryVariableForm';

export interface EditorInputProps {
  className?: string;
  rootClassName?: string;
  label?: string;
  error?: string;
  valid?: boolean;
  theme?: string;
  example?: any;
  mode?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value?: string) => void;
  endLabel?: ReactNode;
  readOnly?: boolean;
  suggestItems?: {
    suggestItemsStyles: React.CSSProperties;
    currentLineItemName?: string;
    showSuggestItems: boolean;
    onSuggestItemClick: (name: string, editor: IAceEditor) => void;
    variables: warp_resolver.Variable[];
  };
  onEditorCursorChange?: (editor: IAceEditor) => void;
}

export const defaultExample = (
  contractAddress: string,
  query: warp_resolver.QueryRequestFor_String
): warp_resolver.WarpMsg => ({
  generic: {
    wasm: {
      execute: {
        msg: base64encode({
          execute_simulate_query: {
            query,
          },
        }),
        funds: [],
        contract_addr: contractAddress,
      },
    },
  },
});

const EditorInput = (props: EditorInputProps) => {
  const sdk = useWarpSdk();

  const queryExample = useQueryExample();

  const {
    endLabel,
    className,
    rootClassName,
    label,
    error,
    placeholder,
    value,
    theme = 'merbivore',
    mode = 'json',
    onChange,
    readOnly,
    example = defaultExample(sdk.chain.contracts.resolver, queryExample),
    onEditorCursorChange,
    suggestItems,
  } = props;
  const inputContainerRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const editorId = useId();
  const formattedExample = useMemo(() => JSON.stringify(example, null, 2), [example]);

  const handleCopyExampleClick = useCallback(() => {
    onChange?.(formattedExample);
  }, [onChange, formattedExample]);

  const editorRef = useRef<AceEditor>(null);

  useEffect(() => {
    if (editorRef.current && mode === 'text') {
      const customMode = new CustomTextSyntaxMode();
      editorRef.current.editor.getSession().setMode(customMode as any);
    }

    if (editorRef.current && mode === 'json') {
      const customMode = new CustomJsonSyntaxMode();
      editorRef.current.editor.getSession().setMode(customMode as any);
    }
  }, [mode]);

  return (
    <ClickAwayListener onClickAway={() => setFocused(false)}>
      <div className={classNames(styles.root, rootClassName)}>
        <Container
          direction={'row'}
          style={{
            justifyContent: 'space-between',
          }}
        >
          {label && (
            <Text variant="text" className={styles.label}>
              {label ?? 'Message'}
            </Text>
          )}

          {endLabel}
        </Container>

        <div
          className={classNames(
            styles.editor_container,
            {
              [styles.editor_container_with_error]: !!error,
            },
            className
          )}
          ref={inputContainerRef}
        >
          {(!focused || readOnly) && !value && (
            <Text variant={'label'} className={styles.placeholder}>
              {placeholder ?? 'Type a message'}
            </Text>
          )}
          {suggestItems && (
            <SuggestItemsMenu
              style={suggestItems.suggestItemsStyles}
              options={suggestItems.variables.map((v) => variableName(v))}
              onChange={(name) => suggestItems.onSuggestItemClick(name, editorRef.current!.editor)}
              value={suggestItems.currentLineItemName ?? ''}
              open={suggestItems.showSuggestItems}
            />
          )}
          <AceEditor
            ref={editorRef}
            fontSize={14}
            onFocus={() => setFocused(true)}
            className={styles.editor}
            mode={mode}
            readOnly={readOnly}
            theme={theme}
            onChange={onChange}
            name={editorId}
            onCursorChange={() => onEditorCursorChange?.(editorRef.current!.editor)}
            wrapEnabled
            tabSize={2}
            showGutter={false}
            highlightActiveLine={false}
            showPrintMargin={false}
            editorProps={{ $renderValidationDecorations: true }}
            value={value}
          />
        </div>

        <Text variant={'text'} className={styles.warning}>
          {error}
        </Text>

        {focused && !value && !readOnly && example && (
          <Portal>
            <div
              className={styles.example_container}
              style={{
                top:
                  (inputContainerRef.current?.getBoundingClientRect().top ?? 0) +
                  (inputContainerRef.current?.getBoundingClientRect().height ?? 0) -
                  20,
                bottom: inputContainerRef.current?.getBoundingClientRect().bottom ?? 0,
                left: inputContainerRef.current?.getBoundingClientRect().left ?? 0,
                width: inputContainerRef.current?.getBoundingClientRect().width ?? 0,
              }}
            >
              <Text variant={'text'}>Example</Text>
              <pre className={styles.example_message}>{formattedExample}</pre>
              <div className={styles.shadow_mask} tabIndex={-1} />
              <Button className={styles.copy_button} onClick={handleCopyExampleClick}>
                {'Copy'}
              </Button>
            </div>
          </Portal>
        )}
      </div>
    </ClickAwayListener>
  );
};

export { EditorInput };
