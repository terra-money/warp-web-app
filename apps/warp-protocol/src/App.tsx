import { TransactionsProvider } from '@terra-money/apps/libs/transactions';
import { useTheme } from '@terra-money/apps/themes';
import { WalletProvider, useChainOptions } from '@terra-money/wallet-provider';
import { Layout } from 'components/layout/Layout';
import { NetworkGuard } from 'components/network-guard';
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
import { BalancesPage } from 'pages/balances';
import { Queries } from 'pages/queries/Queries';
import { useFaucetWarning } from 'components/dialog/faucet-dialog/FaucetDialog';
import { TemplateNew } from 'pages/template-new/TemplateNew';
import { Templates } from 'pages/templates/Templates';

const queryClient = new QueryClient();

const Main = () => {
  useTransactionSnackbars();
  useFaucetWarning();

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/balances" element={<BalancesPage />} />
        <Route path="/queries" element={<Queries />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/template-new" element={<TemplateNew />} />
        <Route path="/job-new/*" element={<JobNew />} />
        <Route path="/jobs/*" element={<Jobs />} />
        <Route path="/jobs/:jobId" element={<JobPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

const WalletConnectorOpts = { bridge: 'https://walletconnect.terra.dev/' };

const Inner = () => {
  const [theme] = useTheme();
  const chainOptions = useChainOptions();

  // TODO: check later if chainOptions would cause a flicker due to being null for first couple of calls
  return (
    chainOptions && (
      <WalletProvider {...chainOptions} connectorOpts={WalletConnectorOpts}>
        <main className={styles.root} data-theme={theme}>
          <NetworkGuard>
            <TransactionsProvider>
              <SnackbarProvider
                autoHideDuration={null}
                content={(key, message) => <SnackbarContainer id={key} message={message} />}
              >
                <Main />
                <DialogContainer />
              </SnackbarProvider>
            </TransactionsProvider>
          </NetworkGuard>
        </main>
      </WalletProvider>
    )
  );
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
