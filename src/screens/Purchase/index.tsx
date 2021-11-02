import React, { useMemo, useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useWindowDimensions,
  Alert,
  Linking,
} from 'react-native';
import {
  NavigationComponentProps,
  NavigationFunctionComponent,
} from 'react-native-navigation';
import { useNavigationButtonPress } from 'react-native-navigation-hooks';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import chroma from 'chroma-js';
import * as InAppPurchases from 'expo-in-app-purchases';
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';
import fundebug from 'fundebug-reactnative';

import { stores, useStore } from '@/store';
import { UIStore } from '@/store/ui';
import { services } from '@/services';
import config from '@/config';
import { HapticFeedback } from '@/utils';
import { SafeAreaScrollView } from '@/components';
import { Toolbar } from '@/components/Toolbar';
import CustomButton from '@/components/CustomButton';
import { LoadingOverlay } from '@/components/LoadingOverlay';

import ImageTransfer from '@/assets/images/transfer.svg';
import ImageMore from '@/assets/images/more.svg';

const PAY_BUTTON_WIDTH = 200;
let inAppPurchaseConnected = false;

const enum ToolbarListKey {
  USER_AGREEMENT,
  PRIVACY_POLICY_URL,
}

const toolbarList = [
  {
    key: ToolbarListKey.USER_AGREEMENT,
    title: '用户协议',
  },
  {
    key: ToolbarListKey.PRIVACY_POLICY_URL,
    title: '隐私政策',
  },
];

const isDark = (ui: UIStore) => ui.appearance === 'dark';

// 全局设置购买侦听器
setPurchaseListener();

function handleDismiss() {
  services.nav.screens?.dismissModal('Purchase');
}

const PurchaseScreen: NavigationFunctionComponent =
  observer<NavigationComponentProps>(props => {
    const { ui, user, global } = useStore();
    const { t, i18n } = useTranslation();
    const webLanguageKey = useMemo(
      () => (i18n.language === 'zh-CN' ? 'zh_cn' : 'en_us'),
      [i18n.language],
    );
    const [purchaseLoading, setPurchaseLoading] = useState(false);
    const bottomTabsHeight =
      services.nav.screens?.getConstants().bottomTabsHeight ?? 44;
    const [projectList, setProjectList] = useState<any[]>([
      // {
      //   title: '连续包年',
      //   productId: config.inAppPurchasesProductIds[0],
      // },
      {
        title: '永久会员',
        subTitle: '一次性付费，永久解锁全部功能',
        productId: config.inAppPurchasesProductIds[1],
      },
    ]);
    const [currentProject, setCurrentProject] = useState(projectList[0]);
    const payButtonDisplayMap = useMemo(
      () => ({
        // [config
        //   .inAppPurchasesProductIds[0]]: `订阅-${projectList[0].price}每年`,
        [config
          .inAppPurchasesProductIds[1]]: `购买-${projectList[0].price}永久`,
      }),
      [projectList],
    );

    useNavigationButtonPress(handleDismiss, props.componentId, 'cancel');
    useNavigationButtonPress(
      handleRestorePurchasePress,
      props.componentId,
      'restore',
    );

    useEffect(() => {
      global.setEnableMask(false);
      return () => {
        global.setEnableMask(true);
        disconnectAsync();
      };
    }, []);

    const { isLoading, isSuccess } = useQuery(
      'in.app.purchase',
      async () => {
        if (!inAppPurchaseConnected) {
          await connectInAppPurchaseAsync();
        }
        await setProducts();
      },
      { enabled: true },
    );

    const handleOpenBrowserPress = useCallback(
      (key: string | number) => {
        let url;
        switch (key) {
          case ToolbarListKey.USER_AGREEMENT:
            url = `${config.USER_AGREEMENT[webLanguageKey]}`;
            break;
          case ToolbarListKey.PRIVACY_POLICY_URL:
            url = `${config.PRIVACY_POLICY_URL[webLanguageKey]}`;
            break;
          default:
            return;
        }

        InAppBrowser.open(url, {
          dismissButtonStyle: 'close',
          preferredControlTintColor: ui.themes.primary,
          animated: true,
          enableBarCollapsing: true,
        });
      },
      [ui.themes.primary],
    );

    async function setProducts() {
      const { results, responseCode } = await InAppPurchases.getProductsAsync(
        config.inAppPurchasesProductIds,
      );

      if (responseCode !== InAppPurchases.IAPResponseCode.OK) return;

      setProjectList([
        // {
        //   title: '连续包年',
        //   price: results?.find(
        //     item => item.productId === config.inAppPurchasesProductIds[0],
        //   )?.price,
        //   productId: config.inAppPurchasesProductIds[0],
        // },
        {
          ...projectList[0],
          price: results?.find(
            item => item.productId === config.inAppPurchasesProductIds[1],
          )?.price,
        },
      ]);
    }

    // 恢复购买
    async function handleRestorePurchasePress() {
      if (!inAppPurchaseConnected) return;

      await LoadingOverlay.show({
        text: {
          visible: true,
          value: '正在恢复购买',
        },
      });
      const result = await InAppPurchases.getPurchaseHistoryAsync();
      await LoadingOverlay.hide();
      if (
        result?.results?.find(item =>
          config.inAppPurchasesProductIds.includes(item.productId),
        )
      ) {
        user.setPurchaseResults(result?.results);
        handleDismiss();
      } else {
        user.setPurchaseResults([]);
      }
    }

    // 购买
    async function handlePayPress() {
      if (!currentProject.productId) return;
      HapticFeedback.impactAsync.heavy();

      setPurchaseLoading(true);
      if (!inAppPurchaseConnected) {
        await connectInAppPurchaseAsync();
      }

      await InAppPurchases.purchaseItemAsync(currentProject.productId);
      setPurchaseLoading(false);
    }

    const isPerpetual = useMemo(
      () =>
        !!user.purchaseResults?.find(
          res => res.productId === config.inAppPurchasesProductIds[1],
        ),
      [user.purchaseResults],
    );

    return (
      <>
        <SafeAreaScrollView
          style={[
            styles.scrollView,
            {
              backgroundColor: isDark(ui)
                ? ui.colors.systemBackground
                : ui.colors.secondarySystemBackground,
            },
          ]}
          contentContainerStyle={{
            paddingBottom: bottomTabsHeight,
          }}>
          <LargeTitle text="定价" />
          <Project
            value={currentProject}
            list={projectList}
            onChange={item => setCurrentProject(item)}
          />
          <LargeTitle text="高级特权" />
          <Rights />
          <Agreement />
        </SafeAreaScrollView>

        {!isLoading && isSuccess && (
          <PayButton
            text={
              user.purchaseResults?.find(
                res => res.productId === currentProject.productId,
              ) || isPerpetual
                ? currentProject.productId ===
                  config.inAppPurchasesProductIds[1]
                  ? '已购买'
                  : '已订阅'
                : payButtonDisplayMap[currentProject.productId]
            }
            loading={purchaseLoading}
            disabled={
              isLoading ||
              !isSuccess ||
              !!user.purchaseResults?.find(
                res => res.productId === currentProject.productId,
              ) ||
              isPerpetual
            }
            onPress={handlePayPress}
          />
        )}

        <Toolbar visible list={toolbarList} onPress={handleOpenBrowserPress} />
      </>
    );
  });

const Agreement = observer(() => {
  const { ui } = useStore();

  function openEmail() {
    Linking.openURL(`mailto:${config.email}`);
  }

  const textStyle = {
    color: ui.colors.secondaryLabel,
  };

  return (
    <View style={styles.tipContainer}>
      {/* <Text style={[styles.tipText, textStyle]}>
        确认订阅：用户确认购买并付款后将记入 Apple 账户。
      </Text>
      <Text style={[styles.tipText, textStyle]}>
        取消续订：如需取消续订，请在当前订阅周期到期前24小时以前，手动在 Apple
        ID 设置管理中关闭自动续费功能，到期前24小时内取消，将会收取订阅费用。
      </Text> */}
      <View>
        <Text style={[styles.tipText, textStyle]}>
          {/* 自动续费：确认订阅后将向您的 Apple
          账户收取费用，订阅以年为计费周期。订阅服务将会在当前周期结束时自动续订并收取费用，取消自动续订需要在当前订阅周期结束24小时
          前完成。在任何时候，您都可以在 App Store 进行订阅管理
          。 */}
          用户确认购买并付款后将记入 Apple 账户。如果您有任何疑问，请
          <Pressable onPress={openEmail}>
            <Text
              style={[
                {
                  color: ui.colors.systemBlue,
                  top: 3,
                  left: 4,
                },
              ]}>
              联系我们
            </Text>
          </Pressable>
        </Text>
      </View>
    </View>
  );
});

const Project = observer(
  ({
    value,
    list,
    onChange,
  }: {
    value: any;
    list: any[];
    onChange: (item: any) => void;
  }) => {
    const { ui } = useStore();

    const projectItemCheckedStyle = {
      borderColor: ui.colors.systemOrange,
      backgroundColor: chroma(ui.colors.systemOrange).alpha(0.15).css(),
    };

    return (
      <View style={styles.projectWrapper}>
        {list?.map((item, index) => (
          <Pressable
            key={item.title}
            style={[
              styles.projectItem,
              {
                backgroundColor: isDark(ui)
                  ? ui.colors.secondarySystemBackground
                  : ui.colors.systemBackground,
              },
              index !== 0 && {
                marginLeft: '8%',
              },
              value.productId === item.productId && projectItemCheckedStyle,
            ]}
            onPress={() => {
              onChange?.(item);
            }}>
            <View>
              <Text
                style={[
                  {
                    color: ui.colors.label,
                  },
                ]}>
                {item.title}
              </Text>
              <Text
                style={[
                  styles.projectItemSubTitle,
                  {
                    color: ui.colors.secondaryLabel,
                  },
                ]}>
                {item.subTitle}
              </Text>
            </View>

            {item.price ? (
              <Text
                style={[
                  styles.projectItemPrice,
                  {
                    color: ui.colors.label,
                  },
                ]}>
                {item.price}
              </Text>
            ) : (
              <Placeholder
                style={{
                  marginTop: 10,
                }}
                Animation={Fade}>
                <PlaceholderLine
                  width={50}
                  height={20}
                  style={{
                    backgroundColor: ui.colors.secondarySystemBackground,
                    borderRadius: 2,
                  }}
                />
              </Placeholder>
            )}
          </Pressable>
        ))}
      </View>
    );
  },
);

const rightsList = [
  {
    image: ImageTransfer,
    title: 'WI-FI 无线传输',
  },
  {
    image: ImageMore,
    title: '更多功能即将推出...',
  },
];

const Rights = () => {
  const { width } = useWindowDimensions();
  const { ui } = useStore();

  return (
    <View style={styles.rightsWrapper}>
      {rightsList.map((item, index) => (
        <View
          key={item.title}
          style={[
            styles.rightsItem,
            index !== 0 && {
              marginLeft: 26,
            },
            {
              width: width > 400 ? 160 : (width - 16 * 2 - 26) / 2,
              backgroundColor: isDark(ui)
                ? ui.colors.secondarySystemBackground
                : ui.colors.systemBackground,
            },
          ]}>
          <Text
            style={[
              styles.rightsItemTitle,
              {
                color: ui.colors.label,
              },
            ]}>
            {item.title}
          </Text>
          {<item.image width={70} height={70} style={styles.rightsItemImg} />}
        </View>
      ))}
    </View>
  );
};

const LargeTitle = ({ text }: { text: string }) => {
  const { ui } = useStore();

  return (
    <Text
      style={[
        styles.largeTitle,
        {
          color: ui.colors.label,
        },
      ]}>
      {text}
    </Text>
  );
};

const PayButton = ({
  text,
  loading,
  disabled,
  onPress,
}: {
  text: string;
  loading: boolean;
  disabled: boolean;
  onPress: () => void;
}) => {
  const { ui } = useStore();
  const { width } = useWindowDimensions();
  const bottomTabsHeight =
    services.nav.screens?.getConstants().bottomTabsHeight ?? 44;

  return (
    <CustomButton
      style={[
        styles.payButton,
        {
          left: width / 2 - PAY_BUTTON_WIDTH / 2,
          bottom: bottomTabsHeight + 26,
        },
      ]}
      color={ui.themes.primary}
      loading={loading}
      disabled={disabled}
      onPress={onPress}>
      {text}
    </CustomButton>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  tipContainer: {
    paddingHorizontal: 16,
    marginTop: 30,
    marginBottom: 60,
  },
  tipText: {
    marginBottom: 4,
    fontSize: 13,
  },
  projectItemSubTitle: {
    marginTop: 4,
    fontSize: 12,
  },
  projectItemPrice: {
    fontWeight: '500',
    fontSize: 17,
  },
  rightsWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 10,
    flexWrap: 'wrap',
  },
  rightsItem: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 6,
    paddingVertical: 16,
    paddingHorizontal: 10,
  },
  rightsItemImg: {
    opacity: 0.9,
  },
  rightsItemTitle: {
    alignSelf: 'flex-start',
    fontWeight: '500',
    fontSize: 17,
  },
  projectWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 20,
    marginTop: 10,
  },
  projectItem: {
    flex: 1,
    height: 90,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 4,
    padding: 10,
    justifyContent: 'space-between',
  },

  largeTitle: {
    fontWeight: '500',
    fontSize: 20,
    marginVertical: 10,
    marginHorizontal: 16,
  },
  payButton: {
    position: 'absolute',
    width: PAY_BUTTON_WIDTH,
  },
});

export default PurchaseScreen;

// 连接到应用商店
async function connectInAppPurchaseAsync() {
  await InAppPurchases.connectAsync();
  inAppPurchaseConnected = true;
}

async function disconnectAsync() {
  await InAppPurchases.disconnectAsync();
  inAppPurchaseConnected = false;
}

function setPurchaseListener() {
  InAppPurchases.setPurchaseListener(
    async ({ responseCode, results, errorCode }) => {
      switch (responseCode) {
        case InAppPurchases.IAPResponseCode.OK:
          if (results) {
            for (const purchase of results) {
              if (!purchase.acknowledged) {
                await InAppPurchases.finishTransactionAsync(purchase, true);
              }
            }
            stores.user.setPurchaseResults(results);
            handleDismiss();
          }
          break;
        case InAppPurchases.IAPResponseCode.USER_CANCELED:
          Alert.alert('购买失败', '您已取消购买');
          break;
        case InAppPurchases.IAPResponseCode.DEFERRED:
          Alert.alert('购买失败', '您无权购买，请求家长批准');
          break;
        default:
          fundebug.notify('购买失败', `错误代码：${errorCode}`);
          Alert.alert('购买失败', `错误代码：${errorCode}`);
      }
    },
  );
}
