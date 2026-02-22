import React from 'react';

interface Props {
  title: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Heading = ({ title, className, style }: Props) => {
  return (
    <p className={`heading-default ${className}`} style={style}>
      {title}
    </p>
  );
};
