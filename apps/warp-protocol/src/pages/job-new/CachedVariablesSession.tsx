import { useVariableStorage } from 'pages/variables/useVariableStorage';
import { ReactNode, useEffect, useRef } from 'react';
import { uniqBy } from 'lodash';
import { useCachedVariables } from './useCachedVariables';
import { variableName } from 'utils/variable';
import { useEventListener } from 'usehooks-ts';
import { warp_controller } from 'types';

interface CachedVariablesSessionProps {
  children: ReactNode;
  input?: warp_controller.Variable[];
}

export const CachedVariablesSession = (props: CachedVariablesSessionProps) => {
  const { children, input } = props;

  const { variables: storageVars } = useVariableStorage();
  const { setVariables: setCachedVariables, variables: cachedVariables, clearAll } = useCachedVariables();

  const refreshingPageRef = useRef<boolean>(false);
  const clearAllRef = useRef<() => void>();

  useEventListener('beforeunload', () => {
    refreshingPageRef.current = true;
  });

  useEffect(() => {
    return () => {
      if (clearAllRef.current && !refreshingPageRef.current) {
        clearAllRef.current();
      }
    };
  }, []);

  useEffect(() => {
    clearAllRef.current = clearAll;
  }, [clearAll]);

  useEffect(() => {
    // TODO: check order
    const newVars = uniqBy([...cachedVariables, ...(input ?? []), ...storageVars], (v) => variableName(v));
    setCachedVariables(newVars);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  return <>{children}</>;
};
