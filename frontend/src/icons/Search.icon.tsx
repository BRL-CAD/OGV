import { IconProps } from './';

export const SearchIcon = (props: IconProps) => {
  return (
    <svg
      width={props.width || 25}
      height={props.height || 25}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M16.927 17.04L20.4001 20.4M19.2801 11.44C19.2801 15.7699 15.77 19.28 11.4401 19.28C7.11019 19.28 3.6001 15.7699 3.6001 11.44C3.6001 7.11009 7.11019 3.6 11.4401 3.6C15.77 3.6 19.2801 7.11009 19.2801 11.44Z"
        stroke={props.color || '#000'}
        stroke-linecap="round"
      />
    </svg>
  );
};
