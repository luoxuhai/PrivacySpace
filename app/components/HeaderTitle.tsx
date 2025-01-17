import { spacing, typography, useTheme } from '@/theme';
import React from 'react';
import { View, ViewStyle, Text, TextProps, TextStyle, StyleProp } from 'react-native';
import { useSafeAreaFrame } from 'react-native-safe-area-context';

interface HeaderTitleProps {
  title: string;
  subtitle: string;
  titleStyle?: StyleProp<TextStyle>;
  subtitleStyle?: StyleProp<TextStyle>;
}
const commonTextProps: TextProps = {
  numberOfLines: 1,
  ellipsizeMode: 'middle',
};

export function HeaderTitle(props: HeaderTitleProps) {
  const { title, subtitle } = props;
  const { width } = useSafeAreaFrame();
  const { colors } = useTheme();

  return (
    <View
      style={[
        $container,
        {
          maxWidth: width - 150,
        },
      ]}
    >
      {title ? (
        <Text
          style={[
            $title,
            {
              color: colors.label,
            },
            props.titleStyle,
          ]}
          {...commonTextProps}
        >
          {title}
        </Text>
      ) : null}
      {subtitle ? (
        <Text
          style={[
            $subtitle,
            {
              color: colors.label,
            },
            props.subtitleStyle,
          ]}
          {...commonTextProps}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const $container: ViewStyle = {
  alignItems: 'center',
  justifyContent: 'space-around',
  paddingHorizontal: spacing[2],
};

const $title: TextStyle = {
  ...typography.subhead,
  fontWeight: '500',
};
const $subtitle: TextStyle = {
  ...typography.caption2,
};
