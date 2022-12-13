import styles from './TemplateMessageInput.module.sass';
import { useState } from 'react';
import { Button } from 'components/primitives';
import { Container } from '@terra-money/apps/components';
import classNames from 'classnames';
import { WasmMsgInput } from 'forms/QueryExprForm/WasmMsgInput';

interface TemplateMessageInputProps {
  className?: string;
  example?: any;
  message?: string;
  setMessage: (msg?: string) => void;
  setTemplateStr: (templateStr?: string) => void;
  templateStr?: string;
  tabType?: TabType;
}

type TabType = 'template' | 'message';

const tabTypes = ['template', 'message'] as TabType[];

const TemplateMessageInput = (props: TemplateMessageInputProps) => {
  const { className, message, setMessage, templateStr, setTemplateStr } = props;

  const [selectedTabType, setSelectedTabType] = useState<TabType>('template');

  return (
    <Container className={classNames(styles.root, className)} direction="column">
      <Container className={styles.top} direction="row">
        {tabTypes.map((tabType) => (
          <Button
            className={styles.btn}
            onClick={() => setSelectedTabType(tabType)}
            variant="secondary"
            fill={tabType === selectedTabType ? undefined : 'none'}
          >
            {tabType}
          </Button>
        ))}
      </Container>
      <Container className={styles.bottom} direction="column">
        {selectedTabType === 'message' && (
          <WasmMsgInput
            className={styles.wasm_msg}
            mode="json"
            placeholder="Type message here"
            value={message}
            onChange={(value) => setMessage(value)}
          />
        )}
        {selectedTabType === 'template' && (
          <WasmMsgInput
            className={styles.wasm_msg}
            example={null}
            mode="text"
            placeholder="Type template here"
            value={templateStr}
            onChange={(value) => setTemplateStr(value)}
          />
        )}
      </Container>
    </Container>
  );
};

export { TemplateMessageInput };
