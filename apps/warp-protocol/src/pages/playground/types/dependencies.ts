import _terra_money_warp_sdk from './_terra_money_warp_sdk.txt';
import _terra_money_feather_js from './_terra_money_feather_js.txt';

export const dependencies = [
  {
    libName: '@terra-money/warp-sdk',
    import: import('@terra-money/warp-sdk'),
    typeDefs: _terra_money_warp_sdk as string,
    safeName: '_terra_money_warp_sdk',
  },
  {
    libName: '@terra-money/feather.js',
    import: import('@terra-money/feather.js'),
    typeDefs: _terra_money_feather_js as string,
    safeName: '_terra_money_feather_js',
  },
];
