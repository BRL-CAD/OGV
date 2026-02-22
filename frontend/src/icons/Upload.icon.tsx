import { IconProps } from './';

export const UploadIcon = (props: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={35}
    height={35}
    fill="none"
    viewBox="0 0 30 30"
    {...props}
  >
    <path
      stroke={props.color || '#000'}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.612 19.286c-2.064 0-3.737-1.25-3.737-3.082 0-1.833 1.673-3.318 3.737-3.318.14 0 .278.007.415.02v-.02h.051a5.298 5.298 0 0 1-.051-.737C8.027 8.89 11 6.25 14.67 6.25c2.484 0 4.65 1.211 5.79 3.005.278-.037.563-.056.852-.056 3.21 0 5.813 2.311 5.813 5.162 0 2.346-1.763 4.135-4.178 4.724m-7.63 4.665v-8.468m0 0-3.813 3.492m3.813-3.492 3.816 3.492"
    />
  </svg>
);
