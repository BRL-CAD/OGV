import { IconProps } from '.';

export const FileIcon = (props: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={50}
    height={50}
    fill="none"
    viewBox="0 0 30 30"
    {...props}
  >
    <path
      stroke={props.color || '#000'}
      d="M15.91 3.375v5.063c0 .698.631 1.265 1.41 1.265h5.638m-6.806-6.328h-7.29c-1.558 0-2.82 1.133-2.82 2.531v15.188c0 1.398 1.262 2.531 2.82 2.531h11.277c1.557 0 2.82-1.133 2.82-2.531V9.486c0-.671-.298-1.315-.826-1.79l-3.988-3.58a2.99 2.99 0 0 0-1.993-.741Z"
    />
  </svg>
);
