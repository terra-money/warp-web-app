import { ConnectedWallet, useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback, useMemo } from 'react';
import { useLocalStorage } from 'usehooks-ts';

export type Template = {
  name: string;
  type: 'job' | 'query';
  vars: TemplateVar[];
  formattedStr: string;
  msg: string;
};

export type TemplateVar = {
  path: string;
  name: string;
};

type TemplatesStorage = {
  [key: string]: Template[];
};

const storageKey = (connectedWallet: ConnectedWallet) =>
  `${connectedWallet.network.name}--${connectedWallet.walletAddress}`;

export const useTemplateStorage = () => {
  const connectedWallet = useConnectedWallet();

  const [storedTemplates, setStoredTemplates] = useLocalStorage<TemplatesStorage>('__warp_stored_templates', {});

  const setTemplates = useCallback(
    (templates: Template[]) => {
      if (!connectedWallet) {
        return;
      }

      setStoredTemplates((storedTemplates) => {
        return {
          ...storedTemplates,
          [storageKey(connectedWallet)]: templates,
        };
      });
    },
    [connectedWallet, setStoredTemplates]
  );

  const templates = useMemo(() => {
    if (!connectedWallet) {
      return [];
    }

    return storedTemplates[storageKey(connectedWallet)] ?? [];
  }, [storedTemplates, connectedWallet]);

  const saveAll = useCallback(
    (templates: Template[]) => {
      setTemplates(templates);
    },
    [setTemplates]
  );

  const saveTemplate = useCallback(
    (template: Template) => {
      const templateExists = Boolean(templates.find((q) => q.name === template.name));

      if (!templateExists) {
        return setTemplates([...templates, template]);
      } else {
        const newTemplates = [...templates];
        newTemplates[templates.findIndex((q) => q.name === template.name)] = template;
        return setTemplates(newTemplates);
      }
    },
    [setTemplates, templates]
  );

  const removeTemplate = useCallback(
    (template: Template) => {
      return setTemplates(templates.filter((q) => q.name !== template.name));
    },
    [setTemplates, templates]
  );

  return useMemo(
    () => ({
      templates,
      saveTemplate,
      removeTemplate,
      saveAll,
    }),
    [templates, saveTemplate, removeTemplate, saveAll]
  );
};
