import React from 'react';
import {
  TouchableOpacityProps,
  StyleProp,
  TextStyle,
  ViewStyle,
  TouchableOpacity,
  ColorValue,
} from 'react-native';
import { radius, spacing, typography, useTheme, lightPalette } from '@/theme';
import { Text, TextProps } from '../Text';

export interface ButtonProps extends TouchableOpacityProps {
  /**
   * Text which is looked up via i18n.
   */
  tk?: TextProps['tk'];
  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: TextProps['text'];
  /**
   * Optional options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  tkOptions?: TextProps['tkOptions'];
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * An optional style override for the button text.
   */
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  isLoading?: boolean;
  color?: ColorValue;
}

/**
 * A component that allows users to take actions and make choices.
 * Wraps the Text component with a Pressable component.
 *
 * - [Documentation and Examples](https://github.com/infinitered/ignite/blob/master/docs/Components-Button.md)
 */
export function Button(props: ButtonProps) {
  const { tk, text, tkOptions, style, textStyle, color, ...rest } = props;
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      disabled={rest.disabled}
      activeOpacity={0.5}
      style={[
        $buttonStyle,
        style,
        {
          backgroundColor: color || colors.palette.primary6,
        },
      ]}
      accessibilityRole="button"
      {...rest}
    >
      <Text style={[$textStyle, textStyle]} tk={tk} tkOptions={tkOptions} text={text} />
    </TouchableOpacity>
  );
}

const $buttonStyle: ViewStyle = {
  height: 44,
  borderRadius: radius[4],
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
  paddingVertical: spacing[2],
  paddingHorizontal: spacing[2],
  overflow: 'hidden',
};

const $textStyle: TextStyle = {
  ...typography.headline,
  flexShrink: 0,
  color: lightPalette.white,
};
