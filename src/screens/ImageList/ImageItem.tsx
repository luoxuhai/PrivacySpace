import React, { useMemo } from 'react';
import { ViewStyle, StyleSheet, Pressable, View, Text } from 'react-native';
import { observer } from 'mobx-react-lite';
import FastImage from 'react-native-fast-image';
import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';

import { IListFileData } from '@/services/api/local/type.d';
import { useStore, stores } from '@/store';
import { formatFileSize } from '@/utils';

dayjs.extend(durationPlugin);

interface IImageItemProps {
  style?: ViewStyle;
  index: number;
  data: IListFileData;
  onPress?: (index: number) => void;
  onLongPress?: (data: IListFileData) => void;
}

interface IImageItemBlockProps {
  style?: ViewStyle;
  index: number;
  data: IListFileData;
  onPress?: (index: number) => void;
  onLongPress?: (data: IListFileData) => void;
}

export function ImageItemBlock(props: IImageItemBlockProps): JSX.Element {
  return (
    <Pressable
      style={[styles.blockContainer, props.style]}
      onPress={() => props.onPress?.(props.index)}
      onLongPress={() => props.onLongPress?.(props.data)}>
      <FastImage
        style={styles.blockImage}
        source={{
          uri: props.data.thumbnail,
        }}
      />
      {props.data.extra?.duration && (
        <Text style={styles.duration}>
          {dayjs.duration(props.data.extra?.duration).format('mm:ss')}
        </Text>
      )}
    </Pressable>
  );
}

export const ImageItemLine = observer<IImageItemProps>(props => {
  const { ui } = useStore();

  const infoStyle = useMemo(
    () => ({
      color: ui.colors.secondaryLabel,
    }),
    [ui.colors],
  );

  return (
    <Pressable
      onPress={() => props.onPress?.(props.index)}
      onLongPress={() => props.onLongPress?.(props.data)}>
      <View style={[styles.lineContainer, props.style]}>
        <View>
          <FastImage
            style={styles.lineImage}
            source={{
              uri: props.data.thumbnail,
              priority: FastImage.priority.high,
            }}
          />
          {props.data.extra?.duration && (
            <Text style={[styles.duration, styles.durationLine]}>
              {dayjs.duration(props.data.extra?.duration).format('mm:ss')}
            </Text>
          )}
        </View>

        <View
          style={[
            styles.body,
            {
              borderBottomColor: ui.colors.separator,
            },
          ]}>
          <Text
            style={[
              styles.name,
              {
                color: ui.colors.label,
              },
            ]}
            numberOfLines={1}
            ellipsizeMode="middle">
            {props.data.name}
          </Text>
          <View style={styles.info}>
            <Text style={[styles.date, infoStyle]}>
              {dayjs(props.data.ctime).format('MM月DD日 HH:mm')}
            </Text>
            <Text style={[styles.size, infoStyle]}>
              {formatFileSize(props.data.size)}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  blockContainer: {
    backgroundColor: stores.ui.colors.tertiaryFill,
  },
  blockImage: {
    flex: 1,
  },
  lineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lineImage: {
    width: 45,
    height: 45,
    borderRadius: 4,
    marginLeft: 16,
  },
  body: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingRight: 16,
    paddingVertical: 14,
  },
  name: {
    width: '70%',
    marginBottom: 6,
    fontSize: 15,
  },
  info: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    marginRight: 10,
    fontSize: 13,
  },
  size: {
    fontSize: 13,
  },
  duration: {
    position: 'absolute',
    bottom: 4,
    right: 6,
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
    textShadowColor: '#888',
    textShadowRadius: 1,
  },
  durationLine: {
    fontSize: 11,
    fontWeight: '500',
    bottom: 2,
    textShadowRadius: 2,
  },
});
