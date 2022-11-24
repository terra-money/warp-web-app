import classNames from 'classnames';
import styles from './WasmMsgInput.module.sass';
import { ReactNode, useCallback, useId, useMemo, useRef, useState } from 'react';
import { Text, Button } from 'components/primitives';
import { ClickAwayListener } from '@mui/material';

import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-merbivore';
import { useContractAddress } from 'shared/hooks';
import { Container } from 'shared/components';

interface WasmMsgInputProps {
  className?: string;
  label: string;
  error?: string;
  valid?: boolean;
  example?: object;
  placeholder?: string;
  value?: string;
  onChange: (value?: string) => void;
  endLabel?: ReactNode;
  readOnly?: boolean;
}

const defaultExample = (contractAddr: string) => ({
  wasm: {
    execute: {
      contract_addr: contractAddr,
      msg: {
        test_msg: {
          id: '123',
        },
      },
      funds: [],
    },
  },
});

const WasmMsgInput = (props: WasmMsgInputProps) => {
  const contractAddr = useContractAddress('warp-controller');
  const {
    endLabel,
    className,
    label,
    error,
    placeholder,
    value,
    onChange,
    readOnly,
    example = defaultExample(contractAddr),
  } = props;
  const inputContainerRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const editorId = useId();
  const formattedExample = useMemo(() => JSON.stringify(example, null, 2), [example]);

  const handleCopyExampleClick = useCallback(() => {
    onChange(formattedExample);
  }, [onChange, formattedExample]);

  return (
    <ClickAwayListener onClickAway={() => setFocused(false)}>
      <div className={styles.root}>
        <Container
          direction={'row'}
          style={{
            justifyContent: 'space-between',
          }}
        >
          <Text variant="text" className={styles.label}>
            {label ?? 'Message'}
          </Text>

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
          {!focused && !value && (
            <Text variant={'label'} className={styles.placeholder}>
              {placeholder ?? 'Type a message'}
            </Text>
          )}
          <AceEditor
            fontSize={14}
            onFocus={() => setFocused(true)}
            className={styles.editor}
            mode="json"
            readOnly={readOnly}
            theme="merbivore"
            onChange={onChange}
            name={editorId}
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

        {focused && !value && (
          <div className={styles.example_container}>
            <Text variant={'text'}>Example</Text>
            <pre className={styles.example_message}>{formattedExample}</pre>
            <div className={styles.shadow_mask} tabIndex={-1} />
            <Button className={styles.copy_button} onClick={handleCopyExampleClick}>
              {'Copy'}
            </Button>
          </div>
        )}
      </div>
    </ClickAwayListener>
  );
};

export { WasmMsgInput };
