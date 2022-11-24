import { warp_controller } from 'types';

type Operator = warp_controller.NumOp | warp_controller.StringOp;

export const useOperatorLabel = (operator: Operator) => {
  switch (operator) {
    case 'eq':
      return '==';
    case 'neq':
      return '!=';
    case 'gt':
      return '>';
    case 'lt':
      return '<';
    case 'gte':
      return '>=';
    case 'lte':
      return '<=';
    case 'contains':
      return 'contains';
    case 'starts_with':
      return 'starts with';
    case 'ends_with':
      return 'ends with';
    default:
      return 'unknown operator';
  }
};
