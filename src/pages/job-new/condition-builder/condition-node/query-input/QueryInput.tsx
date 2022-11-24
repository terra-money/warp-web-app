import { Container, UIElementProps } from 'shared/components';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { warp_controller } from 'types';
import { isEmpty } from 'lodash';

import styles from './QueryInput.module.sass';
import { useQueryExprDialog } from '../query-expr-dialog';

type Value = warp_controller.QueryExpr;

type QueryInputProps = UIElementProps & {
  value: Value;
  onChange: (value: Value) => void;
};

export function QueryInput(props: QueryInputProps) {
  const { value, onChange } = props;

  const openQueryExprDialog = useQueryExprDialog();

  const onQueryDialogClick = async () => {
    const queryExpr = await openQueryExprDialog({ queryExpr: value, includeNav: true });
    onChange(queryExpr ?? ({} as warp_controller.QueryExpr));
  };

  const component = isEmpty(value.name) ? (
    <span className={styles.placeholder}>New query</span>
  ) : (
    <span className={styles.text}>{value.name}</span>
  );

  return (
    <Container className={styles.query_input} direction="row" onClick={() => onQueryDialogClick()}>
      {component}
      <KeyboardArrowDownIcon className={styles.chevron} />
    </Container>
  );
}
