import { ExploreIcon, UploadIcon } from '@/icons';

interface SIDE_BAR_DATA_ITEM {
  title: string;
  icon: React.ComponentType;
  link: string;
}

export const SIDE_BAR_DATA: SIDE_BAR_DATA_ITEM[] = [
  { title: 'Explore', icon: ExploreIcon, link: '/dashboard/explore' },
  { title: 'Upload', icon: UploadIcon, link: '/dashboard/upload' },
];
