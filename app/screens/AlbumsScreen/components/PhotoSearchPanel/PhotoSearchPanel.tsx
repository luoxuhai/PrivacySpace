/* eslint-disable react/display-name */
import React, {
  useImperativeHandle,
  useState,
  useMemo,
  useEffect,
  useCallback,
  forwardRef,
} from 'react';
import { StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import Animated, {
  FadeOut,
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { isEmpty, debounce } from 'lodash';

import { PhotoTypes } from '@/database/entities/types';
import { SectionGrid } from '@/components/Grid/SectionGrid/SectionGrid';
import { PhotoItem } from '@/screens/PhotosScreen/components/PhotoItem';
import { AlbumItem } from '../AlbumItem';
import { HapticFeedback, useUpdateEffect } from '@/utils';
import { t } from '@/i18n';
import { spacing, useTheme } from '@/theme';
import { RootNavigation } from '@/navigators';
import { FilterTypes, photoSearchKeys } from '../../constants';
import { useStores } from '@/models';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { searchPhotos, SearchPhotosParams } from '@/services/local';
import { filterOptions } from './constants';

export interface PhotoSearchPanelInstance {
  show: () => void;
  search: (v: string) => void;
  hide: () => void;
}
export const PhotoSearchPanel = observer<any, PhotoSearchPanelInstance>(
  forwardRef((_, ref) => {
    const {
      appLockStore: { inFakeEnvironment },
      globalStore,
    } = useStores();
    const { colors } = useTheme();
    const { top: statusBarHeight } = useSafeAreaInsets();
    const segmentedControlTop = statusBarHeight + 60;

    const [visible, setVisible] = useState(false);
    const [keywords, setKeywords] = useState<string>('');
    const [filterType, setFilterType] = useState<FilterTypes>(FilterTypes.All);

    const queryKey = useMemo(
      () =>
        photoSearchKeys.list({
          inFakeEnvironment,
          keywords,
          type: filterType,
        }),
      [inFakeEnvironment, keywords, filterType],
    );

    const queryClient = useQueryClient();

    const containerOpacity = useSharedValue(0.5);
    const containerStyle = useAnimatedStyle(() => {
      return {
        opacity: withTiming(containerOpacity.value, {
          duration: 100,
        }),
        display: visible ? 'flex' : 'none',
        backgroundColor: colors.background,
      };
    }, [visible, colors.background]);

    useImperativeHandle(ref, () => ({
      show() {
        globalStore.setBottomTabVisible(false);
        setTimeout(() => {
          setVisible(true);
        }, 100);
      },
      hide() {
        setVisible(false);
        globalStore.setBottomTabVisible(true);
      },
      search: debounce(setKeywords, 250),
    }));

    useEffect(() => {
      if (visible) {
        containerOpacity.value = 1;
      } else {
        containerOpacity.value = 0.5;
        reset();
      }
    }, [visible]);

    const reset = useCallback(() => {
      setFilterType(FilterTypes.All);
      setKeywords(undefined);
    }, []);

    const { data: photos } = useQuery({
      queryKey,
      async queryFn({ queryKey }) {
        const [_k1, _k2, { filter }] = queryKey;
        const { inFakeEnvironment, keywords, type } = filter;

        if (!keywords) {
          return [];
        }

        const params: SearchPhotosParams = {
          is_fake: inFakeEnvironment,
          keywords,
        };

        if (type !== FilterTypes.All) {
          params.type = type as unknown as PhotoTypes;
        }

        return await searchPhotos(params);
      },
      placeholderData: [],
      enabled: visible,
    });

    useUpdateEffect(() => {
      if (!visible) {
        queryClient.setQueryData(queryKey, () => []);
      }
    }, [visible]);

    const renderAlbumItem = useCallback(
      ({ item }) => (
        <AlbumItem
          style={styles.album}
          operationStyle={styles.operationStyle}
          item={item}
          bottomOperationVisible={false}
          onPress={() => handlePress(item)}
        />
      ),
      [],
    );

    const renderPhotoItem = useCallback(
      ({ item }) => <PhotoItem item={item} onPress={() => handlePress(item)} />,
      [handlePress],
    );

    const sections = useMemo(
      () =>
        [
          {
            key: 'album',
            title: t('photoSearchPanel.album'),
            data: photos?.filter((item) => item.type === PhotoTypes.Folder),
            itemHeight: styles.album.height,
            externalGutter: true,
            gutter: 4,
            itemWidth: 120,
            renderItem: renderAlbumItem,
          },
          {
            key: 'photo',
            title: '图片/视频',
            data: photos?.filter((item) => item.type !== PhotoTypes.Folder),
            renderItem: renderPhotoItem,
          },
        ] ?? [],
      [photos, renderAlbumItem, renderPhotoItem],
    );

    function handlePress(item: any) {
      switch (item.type) {
        case PhotoTypes.Folder:
          RootNavigation.navigate('Photos', {
            albumId: item.id,
            title: item.name,
          });
          break;
        default:
          RootNavigation.navigate('PhotoViewer', {
            queryKey,
            item,
          });
      }
    }

    const renderSectionHeader = useCallback(
      ({ section }) => {
        return section.key === 'photo' &&
          filterType === FilterTypes.All &&
          !isEmpty(sections[0].data) &&
          !isEmpty(section.data) ? (
          <View
            style={[
              styles.sectionHeader,
              {
                backgroundColor: colors.background,
              },
            ]}
          ></View>
        ) : null;
      },
      [filterType, sections],
    );

    if (!visible) {
      return null;
    }

    return (
      <Animated.View style={[styles.container, containerStyle]} entering={FadeIn} exiting={FadeOut}>
        <SegmentedControl
          style={[
            styles.segment,
            {
              top: segmentedControlTop,
            },
          ]}
          values={filterOptions.map((item) => item.label)}
          selectedIndex={filterOptions.findIndex((o) => o.key === filterType)}
          onChange={(event) => {
            const idx = event.nativeEvent.selectedSegmentIndex;
            setFilterType(filterOptions[idx].key);
            HapticFeedback.selection();
          }}
        />

        <View
          style={[
            styles.result,
            {
              marginTop: statusBarHeight + 105,
            },
          ]}
        >
          <SectionGrid
            sections={sections}
            itemWidth={100}
            gutter={2}
            externalGutter={false}
            stickySectionHeadersEnabled={false}
            gridEnabled
            renderSectionHeader={renderSectionHeader}
          />
        </View>
      </Animated.View>
    );
  }),
);

const styles = StyleSheet.create({
  album: {
    height: 160,
    minWidth: 0,
  },
  albumFooter: {
    height: 40,
  },
  container: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 999,
  },
  operationStyle: {
    height: 50,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  result: {
    flex: 1,
  },
  sectionHeader: {
    height: 20,
    justifyContent: 'center',
    paddingLeft: 5,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  segment: {
    ...StyleSheet.absoluteFillObject,
    marginHorizontal: 16,
  },
});
