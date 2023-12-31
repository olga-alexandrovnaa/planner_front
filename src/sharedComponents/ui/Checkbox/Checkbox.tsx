import { FC, ReactElement } from "react";

import styles from "./Checkbox.module.scss";
import { classNames } from "@/sharedComponents/lib/classNames/classNames";

interface Props {
  className?: string;
  checked: boolean;
  inline?: boolean;
  label?: string | ReactElement;
  onChange: (checked: boolean) => void;
}

export const Checkbox: FC<Props> = ({
  className,
  checked,
  inline,
  label,
  onChange,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    onChange(!checked);
    e.stopPropagation();
  };

  return (
    <div
      className={classNames(
        styles.root,
        {
          [styles.rootInline]: inline,
        },
        [className]
      )}
    >
      <div
        className={classNames(styles.checkbox, {
          [styles.checkboxChecked]: checked,
        })}
        onClick={handleClick}
      />
      {!!label && (
        <div className={styles.label} onClick={handleClick}>
          {label}
        </div>
      )}
    </div>
  );
};
