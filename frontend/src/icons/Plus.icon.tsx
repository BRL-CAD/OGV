import { IconProps } from '.';

export const PlusIcon = (props: IconProps) => (
  <svg
    width={props.width || 20}
    height={props.height || 20}
    viewBox="0 0 45 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M22.5779 7.53027V28.0813M9.86914 17.8058H35.2867"
      stroke={props.color || '#000'}
      stroke-width="4"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
