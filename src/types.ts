export type NavigationTab = 'HUB' | 'CONFIG' | 'SETUP' | 'PARTNERS' | 'ARMORY' | 'RIG' | 'BOARDROOM';

export interface SocialLink {
  id: string;
  name: string;
  handle: string;
  url: string;
  badge?: string;
  color?: string;
}

export interface HardwareItem {
  id: string;
  category: 'CORE RIG' | 'PERIPHERALS';
  type: string;
  name: string;
  specs: string;
  highlight: string;
  badge?: string;
  image?: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
}
