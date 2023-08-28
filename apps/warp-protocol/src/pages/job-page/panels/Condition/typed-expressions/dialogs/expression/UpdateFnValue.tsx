import { UIElementProps } from '@terra-money/apps/components';
import { warp_resolver } from '@terra-money/warp-sdk';
import { Job } from 'types/job';
import { ExpressionValue } from './ExpressionValue';

export type UpdateFnValueProps = {
  value: warp_resolver.UpdateFnValue;
  job: Job;
} & UIElementProps;

export const UpdateFnValue = (props: UpdateFnValueProps) => {
  const { value, job } = props;

  if ('uint' in value) {
    return (
      <span>
        UInt: <ExpressionValue value={value.uint} job={job} />
      </span>
    );
  }

  if ('int' in value) {
    return (
      <span>
        Int: <ExpressionValue value={value.int} job={job} />
      </span>
    );
  }

  if ('decimal' in value) {
    return (
      <span>
        Decimal: <ExpressionValue value={value.decimal} job={job} />
      </span>
    );
  }

  if ('timestamp' in value) {
    return (
      <span>
        Timestamp: <ExpressionValue value={value.timestamp} job={job} />
      </span>
    );
  }

  if ('block_height' in value) {
    return (
      <span>
        Blockheight: <ExpressionValue value={value.block_height} job={job} />
      </span>
    );
  }

  return null;
};
