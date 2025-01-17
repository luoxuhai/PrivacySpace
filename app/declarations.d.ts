declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

declare module 'react-native-dynamic-app-icon' {
  interface IRNDynamicAppIcon {
    supportsDynamicAppIcon: () => Promise<boolean>;
    setAppIcon: (name: string | null) => void;
    getIconName: (callback: (result: { iconName: string }) => void) => void;
  }
  const reactNativeDynamicAppIcon: IRNDynamicAppIcon;
  export default reactNativeDynamicAppIcon;
}
