import { warp_resolver } from '@terra-money/warp-sdk';

type Operator = warp_resolver.NumOp | warp_resolver.StringOp | warp_resolver.NumExprOp;

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
