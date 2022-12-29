import { InputAdornment } from '@mui/material';
import { UIElementProps } from '@terra-money/apps/components';
import { TextInput } from 'components/primitives/text-input';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { ReactComponent as LightningIcon } from 'components/assets/Lightning.svg';
import { ReactComponent as PuzzleIcon } from 'components/assets/Puzzle.svg';
// import { ReactComponent as PencilIcon } from 'components/assets/Pencil.svg';
import { warp_controller } from 'types';

import styles from './ValueInput.module.sass';
// import { useQueryExprDialog } from '../query-expr-dialog';
import { NumericInput } from 'components/primitives/numeric-input';
import classNames from 'classnames';
import { MenuAction } from 'components/menu-button/MenuAction';
import { DropdownMenu } from 'components/dropdown-menu/DropdownMenu';

type Value =
  | warp_controller.NumValueFor_Decimal256And_NumExprOpAnd_DecimalFnOp
  | warp_controller.ValueFor_String
  | warp_controller.NumValueFor_Uint256And_NumExprOpAnd_IntFnOp;

type ValueInputProps<T extends Value> = UIElementProps & {
  value: T;
  onChange: (value: T) => void;
  variant: 'number' | 'text';
};

export function ValueInput<T extends Value>(props: ValueInputProps<T>) {
  const { value, onChange, variant } = props;

  // const openQueryExprDialog = useQueryExprDialog();

  // const onQueryDialogClick = async (value: T, setValue: (queryExpr?: warp_controller.QueryExpr) => void) => {
  // const queryExpr = await openQueryExprDialog({
  //   query: 'query' in value ? value.query : undefined,
  //   includeNav: true,
  // });

  // setValue(queryExpr);
  // };

  const getText = (v: T) => {
    // if ('query' in v) {
    //   return v.query.name;
    // }

    if ('simple' in v) {
      return v.simple;
    }

    return undefined;
  };

  const inputProps = {
    startAdornment: (
      <>
        <DropdownMenu
          menuClass={styles.dropdown_menu}
          action={
            <InputAdornment position="start" className={styles.dropdown_toggle}>
              {'query' in value ? (
                <LightningIcon className={styles.lightning_icon} />
              ) : (
                <PuzzleIcon className={styles.puzzle_icon} />
              )}
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
          {/* <MenuAction
            className={classNames(styles.dropdown_item, 'query' in value && styles.dropdown_item_selected)}
            onClick={() => onQueryDialogClick(value, (q) => q && onChange({ query: q } as T))}
          >
            <span>Query</span>
            <LightningIcon className={styles.lightning_icon} />
          </MenuAction> */}
        </DropdownMenu>
      </>
    ),
    endAdornment: (
      <>
        <InputAdornment position="end">
          {/* {'query' in value ? (
            <PencilIcon
              className={styles.pencil_icon}
              onClick={() => onQueryDialogClick(value, (q) => q && onChange({ query: q } as T))}
            />
          ) : null} */}
        </InputAdornment>
      </>
    ),
  };

  if (variant === 'number') {
    return (
      <NumericInput
        className={styles.value_input}
        placeholder="Type here"
        margin="none"
        value={getText(value)}
        disabled={'query' in value}
        onChange={(event) => {
          // if ('query' in value && event.target.value === value.query.name) {
          //   return;
          // }

          onChange({ simple: event.target.value } as T);
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
      disabled={'query' in value}
      onChange={(event) => {
        // if ('query' in value && event.target.value === value.query.name) {
        //   return;
        // }

        onChange({ simple: event.target.value } as T);
      }}
      InputProps={inputProps}
    />
  );
}
