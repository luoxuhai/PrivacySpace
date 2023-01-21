import React, { FC, useCallback, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { StackScreenProps } from '@react-navigation/stack';

import { AppStackParamList } from '@/navigators';
import { Screen, VideoPlayer, VideoPlayerRef } from '@/components';
import { FetchPhotosResult } from '@/services/local';
import { t } from '@/i18n';
import { useBlurEffect } from '@/utils';

export interface VideoPlayerScreenParams {
  item: FetchPhotosResult;
}

export const VideoPlayerScreen: FC<StackScreenProps<AppStackParamList, 'VideoPlayer'>> = observer(
  (props) => {
    const { item } = props.route.params;
    const ref = useRef<VideoPlayerRef>();

    props.navigation.addListener('transitionStart', () => {
      ref.current?.pause();
    });

    const handleOrientation = useCallback((portrait: boolean) => {
      props.navigation.setOptions({
        gestureEnabled: portrait,
        autoHideHomeIndicator: !portrait,
      });
    }, []);

    return (
      <Screen statusBarStyle="light">
        <VideoPlayer
          ref={ref}
          title={item.name}
          source={{ uri: item.uri }}
          airplayTip={t('videoPlayerScreen.airplayTip')}
          autoPausedTip={t('videoPlayerScreen.autoPausedTip')}
          controlsVisible
          onBack={() => {
            props.navigation.goBack();
          }}
          onOrientation={handleOrientation}
        />
      </Screen>
    );
  },
);
