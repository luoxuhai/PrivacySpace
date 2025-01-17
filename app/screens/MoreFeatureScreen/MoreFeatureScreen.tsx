import React from 'react';
import { ViewStyle, Dimensions } from 'react-native';
import { colord } from 'colord';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';
import { observer } from 'mobx-react-lite';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import { FlatGrid, Screen } from '@/components';
import { colors } from '@/theme';
import { useSafeAreaDimensions } from '@/utils';
import { MoreFeatureNavigatorParamList } from '@/navigators';
import { FeatureItemView, FeatureItem } from './FeatureItemView';
import { canUsePremium } from '@/utils/canUsePremium';
import { MIN_SCREEN_WIDTH } from '../../constants';

function luminance(color: string, l = 0.1) {
  return colord(color).lighten(l).toRgbString();
}

const windowWidth = Dimensions.get('window').width;

const list: FeatureItem[] = [
  // {
  //   title: 'icloudScreen.title',
  //   subtitle: 'icloudScreen.subtitle',
  //   icon: 'arrow.clockwise.icloud.fill',
  //   color: luminance(colors.light.palette.blue),
  //   needPremium: true,
  //   routeName: 'ICloudSync',
  // },
  {
    title: 'transferScreen.title',
    subtitle: 'transferScreen.subtitle',
    icon: 'wifi.circle.fill',
    color: luminance(colors.light.palette.orange),
    needPremium: true,
    routeName: 'Transfer',
  },
  {
    title: 'wastebasketScreen.title',
    icon: 'basket.fill',
    color: luminance(colors.light.palette.green),
    routeName: 'RecycleBin',
  },
];

export const MoreFeatureScreen = observer<
  StackScreenProps<MoreFeatureNavigatorParamList, 'MoreFeature'>
>((props) => {
  const bottomTabBarHeight = useBottomTabBarHeight();
  const safeAreaDimensions = useSafeAreaDimensions();

  const handleToScreen = (routeName: keyof MoreFeatureNavigatorParamList, needPremium: boolean) => {
    if (needPremium && !canUsePremium()) {
      return;
    }

    props.navigation.navigate(routeName);
  };

  const itemWidth = windowWidth <= MIN_SCREEN_WIDTH ? 150 : 160;
  const spacing = windowWidth <= MIN_SCREEN_WIDTH ? 14 : 16;

  return (
    <Screen>
      <SafeAreaView style={$safeAreaView} edges={['left', 'right']}>
        <FlatGrid
          contentContainerStyle={{
            paddingBottom: bottomTabBarHeight,
          }}
          data={list}
          renderItem={({ item }) => (
            <FeatureItemView
              {...item}
              onPress={() => handleToScreen(item.routeName, item.needPremium)}
            />
          )}
          estimatedItemSize={100}
          contentInsetAdjustmentBehavior="automatic"
          itemWidth={itemWidth}
          width={safeAreaDimensions.width}
          itemWidthFixed={false}
          spacing={spacing}
        />
      </SafeAreaView>
    </Screen>
  );
});

const $safeAreaView: ViewStyle = {
  flex: 1,
};
