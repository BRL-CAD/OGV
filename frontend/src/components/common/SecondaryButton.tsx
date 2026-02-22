import React from 'react';

interface Props {
  label: string;
  onClick: (e: React.MouseEvent) => void;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export const SecondaryButton = ({
  label,
  onClick,
  icon,
  style,
  className,
}: Props) => {
  return (
    <button
      className={`secondary-button ${className}`}
      onClick={onClick}
      style={style}
    >
      {icon && icon}
      {label}
    </button>
  );
};
