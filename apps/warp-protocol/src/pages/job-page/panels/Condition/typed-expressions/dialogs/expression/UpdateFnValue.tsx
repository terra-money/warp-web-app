import { UIElementProps } from '@terra-money/apps/components';
import { warp_resolver } from '@terra-money/warp-sdk';
import { ExpressionValue } from './ExpressionValue';

export type UpdateFnValueProps = {
  value: warp_resolver.FnValue;
  variables: warp_resolver.Variable[];
} & UIElementProps;

export const UpdateFnValue = (props: UpdateFnValueProps) => {
  const { value, variables } = props;

  if ('uint' in value) {
    return (
      <span>
        UInt: <ExpressionValue value={value.uint} variables={variables} />
      </span>
    );
  }

  if ('int' in value) {
    return (
      <span>
        Int: <ExpressionValue value={value.int} variables={variables} />
      </span>
    );
  }

  if ('decimal' in value) {
    return (
      <span>
        Decimal: <ExpressionValue value={value.decimal} variables={variables} />
      </span>
    );
  }

  if ('timestamp' in value) {
    return (
      <span>
        Timestamp: <ExpressionValue value={value.timestamp} variables={variables} />
      </span>
    );
  }

  if ('block_height' in value) {
    return (
      <span>
        Blockheight: <ExpressionValue value={value.block_height} variables={variables} />
      </span>
    );
  }

  return null;
};
