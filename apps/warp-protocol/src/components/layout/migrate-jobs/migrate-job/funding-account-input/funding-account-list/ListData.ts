import { warp_account_tracker } from '@terra-money/warp-sdk-v2';

export interface ListData {
  fundingAccounts: warp_account_tracker.FundingAccount[];
  onSelectionChanged: (fundingAccount: warp_account_tracker.FundingAccount) => void;
}
