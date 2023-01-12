import React, { ReactNode, useState } from 'react';
import { isEmpty } from 'lodash';
import { EditorInput } from './EditorInput';
import { IAceEditor } from 'react-ace/lib/types';
import { useCachedVariables } from 'pages/job-new/useCachedVariables';

interface MsgInputProps {
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
}

const MsgInput = (props: MsgInputProps) => {
  const [suggestVariablesStyles, setSuggestVariablesStyles] = useState<React.CSSProperties>({});
  const [currentLineVariableName, setCurrentLineVariableName] = useState<string>();
  const [showSuggestVariables, setShowSuggestVariables] = useState<boolean>(false);

  const { variables } = useCachedVariables();

  return (
    <EditorInput
      {...props}
      suggestItems={{
        variables,
        suggestItemsStyles: suggestVariablesStyles,
        showSuggestItems: showSuggestVariables,
        currentLineItemName: currentLineVariableName,
        onSuggestItemClick: (name: string, editor: IAceEditor) => {
          const cursorPosition = editor.getCursorPosition();
          const currentLine = editor.session.getLine(cursorPosition.row);

          const regex = /\$warp\.variable\.([^"]*)/;
          const result = currentLine.replace(regex, `$warp.variable.${name}`);

          // get the lines from the editor value as an array
          const lines = editor.session.getValue().split('\n');

          // replace the current line with the modified result
          lines[cursorPosition.row] = result;

          // join the lines back together into a single string
          const newValue = lines.join('\n');

          // set the new value to the editor
          editor.session.setValue(newValue);
        },
      }}
      onEditorCursorChange={(editor) => {
        const cursor = editor.selection.getCursor();
        const line = editor.session.getLine(cursor.row);
        const pos = editor.getCursorPosition();
        const prefix = line.slice(0, pos.column);

        if (prefix.includes('$warp.variable.')) {
          const cursorPosition = editor.getCursorPosition();
          const left = cursorPosition.column * editor.renderer.characterWidth;
          const top = cursorPosition.row * editor.renderer.lineHeight;

          const regex = /\$warp\.variable\.([^"]*)/;
          const match = line.slice(0, cursorPosition.column).match(regex);

          if (!match) {
            return;
          }

          const [, variableName] = match;

          setSuggestVariablesStyles((styles) => {
            if (!isEmpty(styles)) {
              return styles;
            }

            return { left, top };
          });
          setCurrentLineVariableName(variableName);
          setShowSuggestVariables(true);
        } else {
          setSuggestVariablesStyles({});
          setCurrentLineVariableName(undefined);
          setShowSuggestVariables(false);
        }
      }}
    />
  );
};

export { MsgInput };
