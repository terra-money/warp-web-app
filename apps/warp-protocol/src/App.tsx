import { TransactionsProvider } from '@terra-money/apps/libs/transactions';
import { useTheme } from '@terra-money/apps/themes';
import { WalletProvider } from '@terra-money/wallet-kit';
import { Layout } from 'components/layout/Layout';
// import { NetworkGuard } from 'components/network-guard';
import { SnackbarContainer } from 'components/snackbar';
import { SnackbarProvider } from 'notistack';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Navigate, Route, Routes } from 'react-router';
import { useTransactionSnackbars } from 'hooks';
import { DialogContainer, DialogProvider } from '@terra-money/apps/dialog';
import styles from './App.module.sass';
import { Dashboard } from 'pages/dashboard/Dashboard';
import { Jobs } from 'pages/jobs/Jobs';
import { JobPage } from 'pages/job-page/JobPage';
import { JobNew } from 'pages/job-new/JobNew';
import { Variables } from 'pages/variables/Variables';
import { TemplateNew } from 'pages/template-new/TemplateNew';
import { TemplatesPage } from 'pages/templates';
import { useWalletDefaultNetworks } from 'hooks/useWalletDefaultNetworks';
import { ChainSelectorProvider } from '@terra-money/apps/hooks';
import { BalancesPage } from 'pages/balances';
import { FundingAccounts } from 'pages/funding-accounts';
import { useTermsOfUseDialog } from 'components/dialog/terms-of-use/TermsOfUseDialog';
import TerraStationMobileWallet from '@terra-money/terra-station-mobile';
import { useEffect, useMemo } from 'react';
import { Playground } from 'pages/playground/Playground';

const queryClient = new QueryClient();

const Main = () => {
  useTransactionSnackbars();

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/funding-accounts/*" element={<FundingAccounts />} />
        <Route path="/funding-accounts/:fundingAccountAddress" element={<BalancesPage />} />
        <Route path="/variables" element={<Variables />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/template-new/*" element={<TemplateNew />} />
        <Route path="/job-new/*" element={<JobNew />} />
        <Route path="/jobs/*" element={<Jobs />} />
        <Route path="/jobs/:jobId" element={<JobPage />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

const Inner = () => {
  const openTermsOfUseDialog = useTermsOfUseDialog();
  const [theme] = useTheme();
  const walletDefaultNetworks = useWalletDefaultNetworks();

  const extraWallets = useMemo(() => {
    return [new TerraStationMobileWallet()];
  }, []);

  useEffect(() => {
    const accepted = localStorage.getItem('TermsOfUseAccepted_Oct-3-2023');
    if (!accepted) {
      openTermsOfUseDialog({ noBackgroundClick: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // TODO: check later if chainOptions would cause a flicker due to being null for first couple of calls
  return walletDefaultNetworks ? (
    <WalletProvider defaultNetworks={walletDefaultNetworks} extraWallets={extraWallets}>
      <main className={styles.root} data-theme={theme}>
        {/* <NetworkGuard> */}
        <ChainSelectorProvider>
          <TransactionsProvider>
            <SnackbarProvider
              autoHideDuration={null}
              content={(key, message) => <SnackbarContainer id={key} message={message} />}
            >
              <Main />
              <DialogContainer />
            </SnackbarProvider>
          </TransactionsProvider>
        </ChainSelectorProvider>
        {/* </NetworkGuard> */}
      </main>
    </WalletProvider>
  ) : null;
};

const App = () => {
  return (
    <DialogProvider>
      <QueryClientProvider client={queryClient}>
        <Inner />
      </QueryClientProvider>
    </DialogProvider>
  );
};

export default App;
