import React, { FC } from 'react';
import { ViewStyle } from 'react-native';
import { observer } from 'mobx-react-lite';
import { StackScreenProps } from '@react-navigation/stack';

import { MoreFeatureNavigatorParamList } from '@/navigators';
import { ListCell, ListSection, SafeAreaScrollView, Screen, Switch } from '@/components';
import { spacing, useTheme } from '@/theme';
import { useStores } from '@/models';

export const ICloudSyncScreen: FC<StackScreenProps<MoreFeatureNavigatorParamList, 'ICloudSync'>> =
  observer(() => {
    const { colors } = useTheme();
    const { settingsStore } = useStores();

    return (
      <Screen type="tabView">
        <SafeAreaScrollView contentContainerStyle={$contentContainer}>
          <ListSection>
            <ListCell
              tk="icloudScreen.autoSyncEnabled"
              rightIcon={null}
              RightAccessory={
                <Switch
                  value={settingsStore.iCloudSyncEnabled}
                  onValueChange={settingsStore.setICloudSyncEnabled}
                />
              }
            />
            <ListCell
              tk="icloudScreen.onlyWifi"
              rightIcon={null}
              RightAccessory={
                <Switch
                  value={settingsStore.iCloudSyncOnlyWifi}
                  onValueChange={settingsStore.setICloudSyncOnlyWifi}
                />
              }
            />
          </ListSection>
        </SafeAreaScrollView>
      </Screen>
    );
  });

const $contentContainer: ViewStyle = {
  paddingTop: spacing[6],
  paddingHorizontal: spacing[6],
};
