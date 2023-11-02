import { InputAdornment } from '@mui/material';
import { UIElementProps } from '@terra-money/apps/components';
import { TextInput } from 'components/primitives/text-input';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { ReactComponent as LightningIcon } from 'components/assets/Lightning.svg';
import { ReactComponent as TerminalIcon } from 'components/assets/Terminal.svg';
import { ReactComponent as PuzzleIcon } from 'components/assets/Puzzle.svg';
import { ReactComponent as PencilIcon } from 'components/assets/Pencil.svg';
import { warp_resolver } from '@terra-money/warp-sdk';

import styles from './ValueInput.module.sass';
import { NumericInput } from 'components/primitives/numeric-input';
import classNames from 'classnames';
import { MenuAction } from 'components/menu-button/MenuAction';
import { DropdownMenu } from 'components/dropdown-menu/DropdownMenu';
import { useCachedVariables } from 'pages/job-new/useCachedVariables';
import { resolveVariableRef, variableName, variableRef } from 'utils/variable';
import { useSelectVariableDialog } from '../select-variable/SelectVariableDialog';
import { useEnvValueDialog } from './EnvValueDialog';

type Value =
  | warp_resolver.NumValueFor_Decimal256And_NumExprOpAnd_DecimalFnOp
  | warp_resolver.StringValueFor_String
  | warp_resolver.NumValueForInt128And_NumExprOpAnd_IntFnOp
  | warp_resolver.NumValueFor_Uint256And_NumExprOpAnd_IntFnOp;

type ValueInputProps<T extends Value> = UIElementProps & {
  value: T;
  onChange: (value: T) => void;
  kind: warp_resolver.VariableKind;
};

export function ValueInput<T extends Value>(props: ValueInputProps<T>) {
  const { value, onChange, kind } = props;

  const openSelectVariableDialog = useSelectVariableDialog();
  const openEnvValueDialog = useEnvValueDialog();

  const onSelectVariable = async (value: T, setValue: (variable: warp_resolver.Variable) => void) => {
    const resp = await openSelectVariableDialog({
      selectedVariable: 'ref' in value ? resolveVariableRef(value.ref, variables) : undefined,
    });

    if (resp) {
      setValue(resp);
    }
  };

  const onSelectEnv = async () => {
    const envValue = await openEnvValueDialog({});

    if (envValue) {
      onChange({ env: envValue } as T);
    }
  };

  const { variables } = useCachedVariables();

  const getText = (v: T) => {
    if ('ref' in v) {
      return variableName(resolveVariableRef(v.ref, variables));
    }

    if ('simple' in v) {
      return v.simple;
    }

    if ('env' in v) {
      return v.env;
    }

    return undefined;
  };

  const isNumKind = ['decimal', 'uint', 'int'].includes(kind);

  const inputProps = {
    startAdornment: (
      <>
        <DropdownMenu
          menuClass={styles.dropdown_menu}
          action={
            <InputAdornment position="start" className={styles.dropdown_toggle}>
              {'ref' in value && <LightningIcon className={styles.lightning_icon} />}
              {'simple' in value && <PuzzleIcon className={styles.puzzle_icon} />}
              {'env' in value && <TerminalIcon className={styles.terminal_icon} />}
              <KeyboardArrowDownIcon className={styles.chevron} />
            </InputAdornment>
          }
        >
          <MenuAction
            className={classNames(styles.dropdown_item, 'simple' in value && styles.dropdown_item_selected)}
            onClick={() => onChange({ simple: '' } as T)}
          >
            <span>Simple</span>
            <PuzzleIcon className={styles.puzzle_icon} />
          </MenuAction>
          <MenuAction
            className={classNames(styles.dropdown_item, 'ref' in value && styles.dropdown_item_selected)}
            onClick={() => onSelectVariable(value, (v) => onChange({ ref: variableRef(v) } as T))}
          >
            <span>Variable</span>
            <LightningIcon className={styles.lightning_icon} />
          </MenuAction>
          {isNumKind && (
            <MenuAction
              className={classNames(styles.dropdown_item, 'env' in value && styles.dropdown_item_selected)}
              onClick={onSelectEnv}
            >
              <span>Environment</span>
              <TerminalIcon className={styles.terminal_icon} />
            </MenuAction>
          )}
        </DropdownMenu>
      </>
    ),
    endAdornment: (
      <>
        <InputAdornment position="end">
          {'ref' in value ? (
            <PencilIcon
              className={styles.pencil_icon}
              onClick={() => onSelectVariable(value, (v) => onChange({ ref: variableRef(v) } as T))}
            />
          ) : null}
        </InputAdornment>
      </>
    ),
  };

  const variant = isNumKind ? 'number' : 'text';

  if (variant === 'number') {
    return (
      <NumericInput
        className={styles.value_input}
        placeholder="Type here"
        margin="none"
        value={getText(value)}
        disabled={'ref' in value || 'env' in value}
        onChange={(event) => {
          if (
            'env' in value ||
            ('ref' in value && event.target.value === variableName(resolveVariableRef(value.ref, variables)))
          ) {
            return;
          }

          onChange({ simple: castValue(kind, event.target.value) } as T);
        }}
        InputProps={inputProps}
      />
    );
  }

  return (
    <TextInput
      className={styles.value_input}
      placeholder="Type here"
      margin="none"
      value={getText(value)}
      disabled={'ref' in value || 'env' in value}
      onChange={(event) => {
        if (
          'env' in value ||
          ('ref' in value && event.target.value === variableName(resolveVariableRef(value.ref, variables)))
        ) {
          return;
        }

        onChange({ simple: castValue(kind, event.target.value) } as T);
      }}
      InputProps={inputProps}
    />
  );
}

const castValue = (kind: warp_resolver.VariableKind, value: string) => {
  if (kind === 'int') {
    return Number(value);
  }

  return value;
};
