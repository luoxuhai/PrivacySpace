import React, { FC, useCallback, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { ViewStyle, ActionSheetIOS } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { SettingStackParamList } from '@/navigators';
import { ListCell, ListSection, SafeAreaScrollView, Screen, Switch } from '@/components';
import { spacing, useTheme } from '@/theme';
import { useStores } from '@/models';
import { translate } from '@/i18n';

export const AppLockSettingsScreen: FC<StackScreenProps<SettingStackParamList, 'AppLockSettings'>> =
  observer(function AppLockSettingsScreen() {
    const { colors } = useTheme();
    const { appLockStore } = useStores();

    const handleSetAutolockTimeout = useCallback(() => {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [
            translate('common.cancel'),
            ...autolockTimeoutOptions.map((option) => option.title),
          ],
          cancelButtonIndex: 0,
          title: translate('appLockSettingsScreen.autolockTimeoutTip'),
        },
        (buttonIndex) => {
          if (buttonIndex !== 0) {
            appLockStore.setAutolockTimeout(autolockTimeoutOptions[buttonIndex - 1].value);
          }
        },
      );
    }, []);

    const formattedAutolockTimeout = useMemo(
      () =>
        autolockTimeoutOptions.find((option) => option.value === appLockStore.autolockTimeout)
          .title,
      [appLockStore.autolockTimeout],
    );

    return (
      <Screen style={$screen}>
        <SafeAreaScrollView contentContainerStyle={$contentContainer}>
          <ListSection
            style={{
              marginTop: spacing[8],
            }}
          >
            <ListCell tk="appLockSettingsScreen.changePasscode" />
            <ListCell
              tk="appLockSettingsScreen.autolockTimeout"
              RightAccessory={formattedAutolockTimeout}
              onPress={handleSetAutolockTimeout}
            />
            <ListCell
              tk="appLockSettingsScreen.biometrics"
              tkOptions={{
                name: '面容',
              }}
              rightIcon={
                <Switch
                  value={appLockStore.biometricsEnabled}
                  onValueChange={appLockStore.setBiometricsEnabled}
                />
              }
            />
            <ListCell
              tk="appLockSettingsScreen.autoTriggerBiometrics"
              rightIcon={
                <Switch
                  value={appLockStore.autoTriggerBiometrics}
                  onValueChange={appLockStore.setAutoTriggerBiometrics}
                />
              }
            />
          </ListSection>
        </SafeAreaScrollView>
      </Screen>
    );
  });

const autolockTimeoutOptions = [
  {
    value: 0,
    title: translate('appLockSettingsScreen.autolockTimeoutDisabled'),
  },
  {
    value: 30,
    title: `30 ${translate('common.second')}`,
  },
  {
    value: 60,
    title: `1 ${translate('common.minute')}`,
  },
  {
    value: 60 * 5,
    title: `5 ${translate('common.minute')}`,
  },
  {
    value: 60 * 15,
    title: `15 ${translate('common.minute')}`,
  },
  {
    value: 60 * 60,
    title: `1 ${translate('common.hour')}`,
  },
];

const $screen: ViewStyle = {
  flex: 1,
};

const $contentContainer: ViewStyle = {
  paddingHorizontal: spacing[6],
};