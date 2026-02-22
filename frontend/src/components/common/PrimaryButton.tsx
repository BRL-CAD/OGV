'use client';
import React from 'react';

interface Props {
  label: string;
  onClick: (e: React.MouseEvent) => void;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
}

export const PrimaryButton = ({
  label,
  onClick,
  icon,
  style,
  className,
  disabled,
}: Props) => {
  return (
    <button
      className={`primary-button ${className}`}
      onClick={onClick}
      style={style}
      disabled={disabled}
    >
      {icon && icon}
      <p className="primary-button-label">{label}</p>
    </button>
  );
};
