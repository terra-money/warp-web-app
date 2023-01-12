import React, { ReactNode, useState } from 'react';
import { isEmpty } from 'lodash';
import { EditorInput } from './EditorInput';
import { useCachedVariables } from 'pages/job-new/useCachedVariables';

interface TemplateStrInputProps {
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

const TemplateStrInput = (props: TemplateStrInputProps) => {
  const [suggestVariablesStyles, setSuggestVariablesStyles] = useState<React.CSSProperties>({});
  const [currentLineVariableName, setCurrentLineVariableName] = useState<string>();
  const [showSuggestVariables, setShowSuggestVariables] = useState<boolean>(false);

  const { variables } = useCachedVariables();

  return (
    <EditorInput
      {...props}
      suggestItems={{
        variables: variables.filter((v) => 'static' in v),
        suggestItemsStyles: suggestVariablesStyles,
        showSuggestItems: showSuggestVariables,
        currentLineItemName: currentLineVariableName,
        onSuggestItemClick: (name, editor) => {
          const cursorPosition = editor.getCursorPosition();
          const currentLine = editor.session.getLine(cursorPosition.row);

          const prefix = currentLine.slice(0, cursorPosition.column);

          const regex = /\{([^{}]*)$/;
          const result = prefix.replace(regex, `{${name}}`);

          // get the lines from the editor value as an array
          const lines = editor.session.getValue().split('\n');

          // replace the current line with the modified result
          let lineContent = result + currentLine.slice(prefix.length);
          // Replace double consecutive {{ with single {
          lineContent = lineContent.replace(/{{/g, '{');
          // Replace double consecutive }} with single }
          lineContent = lineContent.replace(/}}/g, '}');

          lines[cursorPosition.row] = lineContent;

          // join the lines back together into a single string
          const newValue = lines.join('\n');

          // set the new value to the editor
          editor.session.setValue(newValue);
          editor.moveCursorTo(cursorPosition.row, result.length);
          editor.focus();
        },
      }}
      onEditorCursorChange={(editor) => {
        const cursor = editor.getCursorPosition();
        const line = editor.session.getLine(cursor.row);
        const pos = editor.getCursorPosition();
        const prefix = line.slice(0, pos.column);

        const left = cursor.column * editor.renderer.characterWidth;
        const top = cursor.row * editor.renderer.lineHeight;

        const regex = /\{([^}]*)$/;
        const match = prefix.match(regex);

        if (!match) {
          setSuggestVariablesStyles({});
          setShowSuggestVariables(false);
          setCurrentLineVariableName(undefined);
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
      }}
    />
  );
};

export { TemplateStrInput };
