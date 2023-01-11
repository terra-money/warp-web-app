import { useVariableStorage, Variable } from 'pages/variables/useVariableStorage';
import { ReactNode, useEffect } from 'react';
import { uniqBy } from 'lodash';
import { useCachedVariables } from './useCachedVariables';
import { variableName } from 'utils/variable';

interface CachedVariablesSessionProps {
  children: ReactNode;
  input?: Variable[];
}

export const CachedVariablesSession = (props: CachedVariablesSessionProps) => {
  const { children, input } = props;

  const { variables: storageVars } = useVariableStorage();
  const { setVariables: setCachedVariables, variables: cachedVariables, clearAll } = useCachedVariables();

  useEffect(() => {
    // TODO: check order
    const newVars = uniqBy([...cachedVariables, ...(input ?? []), ...storageVars], (v) => variableName(v));
    setCachedVariables(newVars);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  useEffect(() => {
    return () => {
      clearAll();
    };
  }, [clearAll]);

  return <>{children}</>;
};
