import styles from './SuggestItemsMenu.module.sass';

import { TextInputProps } from 'components/primitives';
import { DropdownMenu } from 'components/dropdown-menu/DropdownMenu';
import { MenuAction } from 'components/menu-button/MenuAction';
import { useMemo } from 'react';

interface BaseProps extends Pick<TextInputProps, 'value'> {
  className?: string;
  style?: React.CSSProperties;
  onChange: (input: string) => void;
  value: string;
  open: boolean;
}

interface SuggestItemsMenuProps extends BaseProps {
  options: string[];
}

const SuggestItemsMenu = (props: SuggestItemsMenuProps) => {
  const { options, style, onChange, value, open } = props;

  const filtered = useMemo(() => options.filter((v) => v.startsWith(value)), [value, options]);

  return filtered.length > 0 ? (
    <DropdownMenu style={style} menuClass={styles.menu} open={open}>
      {filtered.map((v) => (
        <MenuAction key={v} onClick={() => onChange(v)}>
          {v}
        </MenuAction>
      ))}
    </DropdownMenu>
  ) : (
    <></>
  );
};

export { SuggestItemsMenu };
