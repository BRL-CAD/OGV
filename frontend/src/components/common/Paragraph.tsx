import React from 'react';

interface Props {
  paragraph: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Paragraph = ({ paragraph, className, style }: Props) => {
  return (
    <p className={`${className} paragraph-default`} style={style}>
      {paragraph}
    </p>
  );
};
