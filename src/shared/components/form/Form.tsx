import { UIElementProps } from 'shared/components';

export const Form = (props: UIElementProps) => {
  const { children, className } = props;

  return (
    <div
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {children}
    </div>
  );
};
