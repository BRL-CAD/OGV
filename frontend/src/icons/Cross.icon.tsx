import { IconProps } from '.';

export const CrossIcon = (props: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width || 20}
    height={props.height || 20}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path
      d="M18 6L6 18M18 18L6 6"
      stroke={props.color || '#000'}
      stroke-width="2"
      stroke-linecap="round"
    />
  </svg>
);
