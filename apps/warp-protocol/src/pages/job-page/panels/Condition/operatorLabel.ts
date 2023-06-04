import { warp_controller } from 'types';

type Operator = warp_controller.NumOp | warp_controller.StringOp | warp_controller.NumExprOp;

export const operatorLabel = (operator: Operator) => {
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
    case 'add':
      return '+';
    case 'sub':
      return '-';
    case 'div':
      return '/';
    case 'mul':
      return '*';
    case 'mod':
      return '%';
    default:
      return 'unknown operator';
  }
};
