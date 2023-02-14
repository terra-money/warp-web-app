import { Text } from 'components/primitives';
import { ListChildComponentProps } from 'react-window';
import { ReactComponent as CheckIcon } from 'components/assets/Check.svg';
import { ListData } from './ListData';
import styles from './ListItem.module.sass';
import { VariablePill } from 'pages/variables/variable-pill/VariablePill';
import { variableName } from 'utils/variable';
import classNames from 'classnames';

export const ListItem = (props: ListChildComponentProps<ListData>) => {
  const {
    index,
    style,
    data: { variables, onSelectionChanged, selectedVariable },
  } = props;

  const variable = variables[index];

  const selected = selectedVariable && variableName(selectedVariable) === variableName(variable);

  return (
    <div
      key={variableName(variable)}
      className={classNames(styles.listItem, selected && styles.selected)}
      style={style}
      onClick={() => onSelectionChanged(variable)}
    >
      <Text variant="text" className={styles.name}>
        {variableName(variable)}
      </Text>
      <VariablePill className={styles.pill} variable={variable} />
      {selected && <CheckIcon className={styles.check} />}
    </div>
  );
};
