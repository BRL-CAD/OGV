import { IconProps } from './index';

export const HamburgerIcon = (props: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={34}
    height={29}
    fill="none"
    {...props}
  >
    <path
      stroke={props.color || '#000'}
      strokeLinecap="round"
      strokeWidth={2}
      d="M19.125 21.75H5.667m22.666-7.25H5.667m22.666-7.25H5.667"
    />
  </svg>
);
