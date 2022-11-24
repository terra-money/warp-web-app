import { UIElementProps } from 'shared/components';
import { warp_controller } from '../../../../types';
import { BlockHeightExpression } from './typed-expressions/BlockHeightExpression';
import { StringExpression } from './typed-expressions/StringExpression';
import { TimestampExpression } from './typed-expressions/TimestampExpression';
import { BoolExpression } from './typed-expressions/BoolExpression';
import { DecimalExpression } from './typed-expressions/DecimalExpression';
import { IntExpression } from './typed-expressions/IntExpression';
import { UIntExpression } from './typed-expressions/UIntExpression';

export type ExpressionProps = {
  expression: warp_controller.Expr;
} & UIElementProps;

export const Expression = (props: ExpressionProps) => {
  const { expression, className } = props;

  if ('string' in expression) {
    return <StringExpression className={className} expression={expression.string} />;
  }

  if ('block_height' in expression) {
    return <BlockHeightExpression className={className} expression={expression.block_height} />;
  }

  if ('timestamp' in expression) {
    return <TimestampExpression className={className} expression={expression.timestamp} />;
  }

  if ('bool' in expression) {
    return <BoolExpression className={className} expression={expression.bool} />;
  }

  if ('decimal' in expression) {
    return <DecimalExpression className={className} expression={expression.decimal} />;
  }

  if ('int' in expression) {
    return <IntExpression className={className} expression={expression.int} />;
  }

  if ('uint' in expression) {
    return <UIntExpression className={className} expression={expression.uint} />;
  }

  return <span className={className}>unknown expression</span>;
};
