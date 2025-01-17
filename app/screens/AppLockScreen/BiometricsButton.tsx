import React, { FC, useMemo, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { ViewStyle, TouchableOpacity, Alert } from 'react-native';
import { SFSymbol } from 'react-native-sfsymbols';

import { useTheme } from '@/theme';
import { useLocalAuth, BiometricType, useUpdateEffect, Overlay, reportException } from '@/utils';
import { KEY_SIZE } from './PasscodeKeyboard';
import { translate } from '@/i18n';
import { useStores } from '@/models';

interface BiometricsButtonProps {
  onSuccess?(): void;
  onFail?(): void;
}

function getBiometricIcon(biometricTypes?: BiometricType[]) {
  if (biometricTypes?.includes(BiometricType.FACIAL_RECOGNITION)) {
    return 'faceid';
  } else if (biometricTypes?.includes(BiometricType.FINGERPRINT)) {
    return 'touchid';
  } else {
    return null;
  }
}

interface UnlockAttempts {
  count: number;
}

export const BiometricsButton: FC<BiometricsButtonProps> = observer((props) => {
  const { biometricTypes, usedBiometricType, auth } = useLocalAuth();
  const { colors } = useTheme();
  const { appLockStore, appStateStore } = useStores();
  const unlockTimer = useRef<NodeJS.Timeout>();
  const unlockAttempts = useRef<UnlockAttempts>({ count: 0 });
  const name = useMemo(() => getBiometricIcon(biometricTypes), [biometricTypes]);

  const visible =
    appLockStore.biometricsEnabled &&
    (appLockStore.inFakeEnvironment ? appLockStore.biometricsEnabledWhenFake : true);

  // 自动触发识别
  useUpdateEffect(() => {
    if (
      !global.isPauseBiometrics &&
      appLockStore.passcode &&
      appLockStore.isLocked &&
      usedBiometricType &&
      !appLockStore.inFakeEnvironment &&
      appLockStore.biometricsEnabled &&
      appLockStore.autoTriggerBiometrics &&
      appStateStore.inForeground
    ) {
      clearTimeout(unlockTimer.current);
      unlockTimer.current = setTimeout(() => {
        if (unlockAttempts.current.count >= 1) {
          return;
        }
        unlockAttempts.current.count++;
        requestAuth();
      }, 500);
    }
  }, [
    appLockStore.autoTriggerBiometrics,
    appLockStore.isLocked,
    appStateStore.inForeground,
    usedBiometricType,
  ]);

  useUpdateEffect(() => {
    if (appLockStore.isLocked) {
      unlockAttempts.current.count = 0;
    }
  }, [appLockStore.isLocked]);

  async function requestAuth() {
    try {
      const result = await auth({
        promptMessage: translate('appLockScreen.unlock'),
      });

      if (!result) {
        return;
      }

      if (result.success) {
        setTimeout(props.onSuccess, 300);
      } else if ((result as any)?.error !== 'user_cancel') {
        Alert.alert(
          translate('appLockScreen.biometricsAuthFailed'),
          (result as any).warning || (result as any).error,
        );
      }
    } catch (error) {
      props.onFail();
      reportException({ error });
    }
  }

  return (
    visible &&
    name && (
      <TouchableOpacity style={$container} onPress={requestAuth}>
        <SFSymbol name={name} color={colors.label} size={KEY_SIZE / 2} />
      </TouchableOpacity>
    )
  );
});

const $container: ViewStyle = {
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
};
