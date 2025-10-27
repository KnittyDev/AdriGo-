declare module 'react-store-badges' {
  interface ReactStoreBadgesProps {
    url: string;
    platform: 'ios' | 'android';
    width?: number;
    height?: number;
    locale?: string;
    defaultLocale?: string;
    target?: string;
  }
  
  const ReactStoreBadges: React.FC<ReactStoreBadgesProps>;
  export = ReactStoreBadges;
}
