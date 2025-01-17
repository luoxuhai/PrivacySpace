import React, { FC, useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { observer } from 'mobx-react-lite';
import { StackScreenProps } from '@react-navigation/stack';
import { useQuery } from '@tanstack/react-query';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { AlbumsNavigatorParamList } from '@/navigators';
import { ImageBrowser, ImageBrowserInstance, ImageSource, LoadStatus, Screen } from '@/components';
import { useTheme } from '@/theme';
import { BottomToolbar } from './components/BottomToolbar';
import { Header } from './components/Header';
import { VideoPlayButton } from './components/VideoPlayButton';
import { FetchPhotosResult } from '@/services/local';
import { PhotoTypes } from '@/database/entities/types';
import { HapticFeedback, showActionSheet, useUpdateEffect } from '@/utils';
import { t } from '@/i18n';
import { exportPhotos } from '../PhotosScreen/helpers/exportPhotos';
import { QueryKeyContextProvider } from '../PhotosScreen/context';

export interface PhotoViewerScreenParams {
  item: FetchPhotosResult;
  queryKey: any;
}

export const PhotoViewerScreen: FC<StackScreenProps<AlbumsNavigatorParamList, 'PhotoViewer'>> =
  observer((props) => {
    const { item: initialItem, queryKey } = props.route.params;
    const { colors, isDark } = useTheme();
    const [toolbarVisible, setToolbarVisible] = useState(true);
    const imageBrowserRef = useRef<ImageBrowserInstance>(null);

    const { data: photos } = useQuery<FetchPhotosResult[]>({
      queryKey,
      select(data) {
        return data.filter((item) => item.type !== PhotoTypes.Folder);
      },
      placeholderData: [],
      enabled: false,
    });

    const images = useMemo<ImageSource[]>(
      () =>
        photos.map((item) => {
          const isVideo = item.type === PhotoTypes.Video;
          const dimensions = isVideo ? item.video_details : item.image_details;

          return {
            id: item.id,
            uri: item.uri,
            thumbnail: item.thumbnail,
            poster: item.poster,
            width: dimensions.width,
            height: dimensions.height,
            type: item.type === PhotoTypes.Video ? 'video' : 'image',
          };
        }),
      [photos],
    );

    const isTransitionStart = useRef(false);
    useEffect(() => {
      props.navigation.addListener('beforeRemove', () => {
        StatusBar.setHidden(false, 'none');
      });
    }, []);

    useUpdateEffect(() => {
      if (!images.length) {
        props.navigation.goBack();
      }
    }, [images.length]);

    const initialIndex = photos.findIndex((photo) => photo.id === initialItem.id);
    const [currentIdx, setCurrentIdx] = useState(initialIndex ?? 0);
    const currentItem = photos[currentIdx];

    const iconPlayOpacity = useSharedValue(1);
    const iconPlayStyle = useAnimatedStyle(() => {
      return {
        opacity: withTiming(iconPlayOpacity.value, {
          duration: 150,
        }),
      };
    }, []);

    const handleVisibleToolbar = useCallback(() => {
      if (isTransitionStart.current) {
        return;
      }
      setToolbarVisible((visible) => {
        StatusBar.setHidden(visible, 'none');
        return !visible;
      });
    }, []);

    const renderExtraElements = useCallback(
      ({ index, loadStatus }) => {
        const visible = images[index].type === 'video' && loadStatus === LoadStatus.Succeeded;

        return (
          <VideoPlayButton
            visible={visible}
            disabled={false}
            animatedStyle={iconPlayStyle}
            item={currentItem}
          />
        );
      },
      [currentItem, images],
    );

    const handleLongPress = useCallback(() => {
      HapticFeedback.impact.heavy();
      showActionSheet(
        {
          options: [t('filesScreen.saveToLocal'), t('common.cancel')],
          cancelButtonIndex: 1,
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            exportPhotos([currentItem.uri]);
          }
        },
      );
    }, []);

    const onScrollBeginDrag = useCallback(() => {
      iconPlayOpacity.value = 0;
    }, []);

    const onScrollEndDrag = useCallback((event: any) => {
      iconPlayOpacity.value = 1;
      if (event.nativeEvent.zoomScale > 1) {
        setToolbarVisible(false);
        StatusBar.setHidden(true, 'none');
      }
    }, []);

    const keyExtractor = useCallback((item) => item.id, []);

    return (
      <QueryKeyContextProvider value={queryKey}>
        <Screen>
          <Header
            visible={toolbarVisible}
            name={currentItem?.name}
            ctime={currentItem?.created_date}
            onBack={props.navigation.goBack}
          />
          <ImageBrowser
            style={{
              backgroundColor:
                !toolbarVisible || isDark ? colors.palette.black : colors.palette.white,
            }}
            ref={imageBrowserRef}
            images={images}
            initialIndex={initialIndex}
            renderExtraElements={renderExtraElements}
            keyExtractor={keyExtractor}
            onPress={handleVisibleToolbar}
            onLongPress={handleLongPress}
            onPageChanged={setCurrentIdx}
            onScrollBeginDrag={onScrollBeginDrag}
            onScrollEndDrag={onScrollEndDrag}
          />
          <BottomToolbar
            visible={toolbarVisible}
            disabled={false}
            item={currentItem}
            onDelete={() => {
              const pageIndex = currentIdx === images.length - 1 ? currentIdx - 1 : currentIdx;
              imageBrowserRef.current.setPage(pageIndex, false);
            }}
          />
        </Screen>
      </QueryKeyContextProvider>
    );
  });
