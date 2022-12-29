/* eslint-disable */

import { UIElementProps } from '@terra-money/apps/components';
import { forwardRef } from 'react';
import { warp_controller } from 'types';
// import { QueryInput } from './query-input/QueryInput';

type BoolExprNodeProps = UIElementProps & {
  expr: warp_controller.QueryExpr;
  setExpr: (expr: warp_controller.QueryExpr) => void;
};

export const BoolExprNode = forwardRef((props: BoolExprNodeProps, ref: React.Ref<HTMLDivElement>) => {
  const { expr, setExpr } = props;

  return null;
  // return <QueryInput value={expr} onChange={setExpr} />;
});
