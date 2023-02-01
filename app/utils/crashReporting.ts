import Config from '@/config';
import * as Sentry from '@sentry/react-native';

import { Application } from './application';
import { DynamicUpdate, LocalPackage } from './DynamicUpdate';

export const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();

export const initCrashReporting = async () => {
  let updateMetadata: LocalPackage | undefined;
  try {
    updateMetadata = await DynamicUpdate.getUpdateMetadataAsync();
  } catch { }
  const dist = updateMetadata?.label ?? '0';

  Sentry.init({
    debug: __DEV__,
    dsn: Config.sentry.dsn,
    release: `${Application.bundleId}@${Application.version}(${Application.buildNumber})+codepush:${dist}`,
    dist,
    tracesSampleRate: Config.sentry.tracesSampleRate,
    integrations: [
      new Sentry.ReactNativeTracing({
        routingInstrumentation,
      }),
    ],
  });
};

type ErrorType = 'fatal' | 'error' | 'warning';

/**
 * Manually report a handled error.
 */
export const reportException = ({
  error,
  message,
  level = 'error',
  extra,
}: {
  error?: Error;
  message?: string;
  level?: ErrorType;
  extra?: Record<string, any>;
}) => {
  const _error = error || new Error(message);
  _error.message = `[${level}] ${_error.message || 'Unknown'}`;
  if (__DEV__) {
    console.error(_error);
  } else {
    Sentry.captureException(_error, {
      extra: {
        customMessage: message,
        ...extra,
      },
      level,
    });
  }
};
