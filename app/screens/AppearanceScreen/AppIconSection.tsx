import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  TouchableOpacity,
  ViewStyle,
  View,
  TextStyle,
  ImageStyle,
  LayoutRectangle,
  StyleSheet,
  StyleProp,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import AppIconManager from 'react-native-dynamic-app-icon';

import { ListSection, ListCell, ImageIcon, Text, ImageIconTypes } from '@/components';
import { radius, spacing, typography, useTheme } from '@/theme';
import { TextKeyPath } from '@/i18n';
import { appIconOptions } from './constants';
import { Application, HapticFeedback, Overlay } from '@/utils';
import { AppIcons } from './types';
import { canUsePremium } from '@/utils/canUsePremium';

const APP_ICON_ITEM_SIZE = 58;
const APP_ICON_LIST_PADDING = spacing[5];
const APP_ICON_ITEM_RADIUS = radius[5];

export const AppIconSection = observer(() => {
  const { appIcon, setAppIcon } = useTheme();
  const [layout, setLayout] = useState<LayoutRectangle>();

  const marginHorizontal = useMemo(() => {
    const listRealWidth = layout?.width - APP_ICON_LIST_PADDING * 2;
    const rowCount = Math.trunc(listRealWidth / APP_ICON_ITEM_SIZE - 1);
    const extraCount = Math.trunc((rowCount - appIconOptions.length) / 2 || 0);
    const rowRealCount = rowCount > appIconOptions.length ? rowCount - extraCount : rowCount;
    return (listRealWidth / rowRealCount - APP_ICON_ITEM_SIZE) / 2 || 0;
  }, [layout?.width]);

  const handleChangeAppIcon = useCallback(async (iconName: AppIcons) => {
    if (!canUsePremium()) {
      return;
    }

    const supports = await AppIconManager.supportsDynamicAppIcon();
    if (supports) {
      AppIconManager.setAppIcon(iconName === AppIcons.Default ? null : iconName);
      setAppIcon(iconName);
      HapticFeedback.selection();
    } else {
      Overlay.alert({ preset: 'error' });
      HapticFeedback.notification.error();
    }
  }, []);

  const filteredAppIconOptions =
    Application.env === 'AppStore'
      ? appIconOptions
      : appIconOptions.filter((appIcon) => appIcon.env === 'all');

  return (
    <ListSection
      titleTk="appearanceScreen.appIcon.title"
      descriptionTk="appearanceScreen.appIcon.tip"
    >
      <ListCell
        style={$appIconOptionContainer}
        bottomSeparator={false}
        onLayout={(e) => {
          setLayout(e.nativeEvent.layout);
        }}
      >
        {filteredAppIconOptions.map((option) => {
          return (
            <AppIconOption
              key={option.title}
              style={{
                marginHorizontal,
              }}
              icon={option.name}
              title={option.title}
              checked={appIcon === option.name}
              onPress={() => handleChangeAppIcon(option.name)}
            />
          );
        })}
      </ListCell>
    </ListSection>
  );
});

interface AppIconOptionProps {
  title: TextKeyPath;
  icon: ImageIconTypes;
  checked: boolean;
  style?: StyleProp<ViewStyle>;
  onPress(): void;
}

const AppIconOption = observer<AppIconOptionProps>((props) => {
  const { colors } = useTheme();
  const { checked } = props;
  const scale = useSharedValue(1);

  const $appIconWrapperCheckedStyle: ViewStyle = {
    borderWidth: 2.5,
    borderColor: colors.palette.primary6,
  };

  const $animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withSpring(scale.value, {
          mass: 0.1,
        }),
      },
    ],
  }));

  useEffect(() => {
    scale.value = checked ? 0.9 : 1;
  }, [checked]);

  return (
    <TouchableOpacity
      style={[$appIconOption, props.style]}
      activeOpacity={0.8}
      onPress={props.onPress}
    >
      <View
        style={[
          $appIconWrapper,
          {
            borderColor: colors.quaternaryLabel,
          },
          checked && $appIconWrapperCheckedStyle,
        ]}
      >
        <Animated.View
          style={[
            $animatedStyle,
            {
              width: '100%',
              aspectRatio: 1,
            },
          ]}
        >
          <ImageIcon style={$appIcon} icon={props.icon} />
        </Animated.View>
      </View>
      <Text
        style={$appIconName}
        tk={props.title}
        numberOfLines={1}
        color={checked ? colors.palette.primary6 : colors.label}
      />
    </TouchableOpacity>
  );
});

const $appIconOptionContainer: ViewStyle = {
  flexWrap: 'wrap',
  padding: APP_ICON_LIST_PADDING,
};

const $appIconOption: ViewStyle = {
  alignItems: 'center',
  marginVertical: spacing[3],
};

const $appIconWrapper: ViewStyle = {
  width: APP_ICON_ITEM_SIZE,
  aspectRatio: 1,
  borderRadius: APP_ICON_ITEM_RADIUS + 2,
  overflow: 'hidden',
  borderWidth: StyleSheet.hairlineWidth,
};

const $appIconName: TextStyle = {
  width: APP_ICON_ITEM_SIZE,
  textAlign: 'center',
  ...typography.caption1,
  marginTop: spacing[3],
};

const $appIcon: ImageStyle = {
  borderRadius: APP_ICON_ITEM_RADIUS,
  overflow: 'hidden',
};
