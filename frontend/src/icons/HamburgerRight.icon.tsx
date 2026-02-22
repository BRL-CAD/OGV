import React from 'react';
import { IconProps } from './';

export const HamburgerRightIcon = ({ ...props }: IconProps) => {
  return (
    <svg
      width={props.width || '24'}
      height={props.height || '24'}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10.5 18H20M4 12H20M4 6H20"
        stroke={props.stroke || 'black'}
        strokeWidth={props.strokeWidth || '2'}
        stroke-linecap="round"
      />
    </svg>
  );
};
