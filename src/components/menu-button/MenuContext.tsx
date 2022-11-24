import { UIElementProps } from 'shared/components';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

type MenuContextValue = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const MenuContext = createContext<MenuContextValue>({
  setOpen: () => false,
  open: false,
});

export const MenuProvider = ({ children }: UIElementProps) => {
  const [open, setOpen] = useState(false);

  const context = useContext(MenuContext);

  const bindedSetOpen: React.Dispatch<React.SetStateAction<boolean>> = useCallback(
    (action) => {
      // is submenu
      if (context.open && open) {
        context.setOpen(false);
      }

      setOpen(action);
    },
    [setOpen, context, open]
  );

  const value = useMemo(() => {
    return { open, setOpen: bindedSetOpen };
  }, [open, bindedSetOpen]);

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};
