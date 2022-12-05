const zh = {
  common: {
    ok: '好',
    cancel: '取消',
    back: '返回',
    second: '秒',
    minute: '分钟',
    hour: '小时',
    appName: '隐私盒子',
    coming: '即将推出...',
    enabled: '已启动',
    disabled: '已禁用',
    closed: '已关闭',
    opened: '已打开',
    open: '打开',
    close: '关闭',
    done: '完成',
  },
  contentNavigator: {
    albumTab: '相册',
    filesTab: '文件',
    moreTab: '更多',
    settingsTab: '设置',
  },
  errorScreen: {
    reset: '重置',
  },
  settingsScreen: {
    purchaseBanner: {
      title: '隐私盒子高级版',
      subtitle: '开通后可获得完整的功能体验',
      button: '立即开通',
    },
    hapticFeedbackSwitch: '触觉反馈',
    language: '语言',
    preference: '通用偏好',
    security: '安全',
    help: '帮助和支持',
    feedback: '反馈建议',
    share: '分享给朋友',
    FAQ: '常见问题',
  },
  appearanceScreen: {
    title: '外观和图标',
    appearanceColor: {
      title: '颜色模式',
      auto: '跟随系统',
      light: '浅色模式',
      dark: '深色模式',
    },
    appIcon: {
      title: '应用图标',
      tip: '如果无法生效，请尝试重启手机',
    },
  },
  aboutScreen: {
    title: '关于',
    version: '版本',
    changelog: '更新日志',
    review: '给个好评',
    agreement: '协议',
    private: '隐私政策',
    userAgreement: '用户协议',
    connect: '联系我们',
    email: '开发者邮箱',
    qqGroup: 'QQ 反馈群',
    emailCopied: '已复制 QQ 群号',
    qqGroupCopied: '已复制邮箱',
  },
  debugScreen: {
    title: '调试',
  },
  purchaseScreen: {
    pro: '每日待办高级版',
    title: '升级为 每日待办高级版',
    description: '解锁全部功能',
    purchasing: '购买中',
    purchaseSuccess: '购买成功',
    purchaseFail: '购买失败',
    purchased: '已购买',
    restore: '恢复购买',
    restoring: '恢复购买中',
    restoreSuccess: '恢复购买成功',
    restoreFail: '恢复购买失败',
    restoreFailMessage: '请先购买',
    help: '用户确认购买并付款后将记入 Apple 账户。如果您有任何疑问，请联系我们。',
    buyButton: '开通永久会员',
    moreFeatures: '更多功能即将推出...',
    fetchInfoFailTitle: '获取内购失败',
    fetchInfoFailMessage: '请稍后再试',
    cardButton: '获取',
  },
  appLockScreen: {
    faceId: '面容',
    touchId: '指纹',
    unlock: '解锁 App',
    enterPassword: '请输入密码',
    passcodeLength: '密码长度',
  },
  changeLockPasscodeScreen: {
    createPasscode: '请创建解锁密码',
    confirmCreatedPasscode: '确认密码',
    changePasscode: '请设置新密码',
    confirmPasscode: '确认新密码',
    changeFakePasscode: '请设置伪装密码',
    confirmFakePasscode: '确认伪装密码',
    reset: '重设密码',
    samePrompt: '不能与主密码相同',
  },
  appLockSettingsScreen: {
    title: '密码锁',
    sectionTitle: '主密码',
    autolockTimeout: '自动锁定',
    biometrics: '使用{{ name }}解锁',
    changePasscode: '修改密码',
    autoTriggerBiometrics: '自动触发{{ name }}解锁',
    autolockTimeoutDisabled: '立即',
    autolockTimeoutTip: '切换到其他 APP 后，超过以下选定到时间间隔后会自动锁定',
  },
  fakeAppLockSettingsScreen: {
    title: '伪装密码',
    fakePasscodeSwitch: '开启伪装密码',
    changeFakePasscode: '修改伪装密码',
    hideBiometricsWhenFake: '隐藏解锁界面的{{ name }}按钮',
    bottomTabDarkle: '底部导航栏变暗',
  },
  advancedSettingsScreen: {
    title: '高级设置',
    importImageAfterDelete: '导入后提示删除原文件',
    importImageAfterDeleteTip: '导入图片/视频后会弹出是否从系统相册中删除的确认框',
    smartSearch: '智能搜索',
    smartSearchTip: '开启后可识别图片内容进行搜索',
    bottomTabVisible: '显隐底部导航项',
  },
  thirdPartyApp: {
    browser: '浏览器',
    email: '邮箱',
    note: '备忘录',
    qq: 'QQ',
    wechat: '微信',
    weixin: '微信',
    douyin: '抖音',
    tikTok: '抖音',
    kwai: '快手',
    bilibili: 'B站',
    album: '相册',
    facebook: '脸书',
    twitter: '推特',
    instagram: 'Instagram',
  },
  appIconName: {
    default: '默认',
    dark: '深色',
    calculator: '计算器',
    passwordBox: '密码箱',
    clock: '时钟',
    housekeeper: '安全管家',
    todo: '待办',
  },
  urgentSwitchScreen: {
    title: '紧急切换',
    targetHeader: '跳转到的目标应用',
    targetTip: '当手机屏幕朝下时会跳转到以下指定应用',
    actionSectionTitle: '触发动作',
    actionShake: '摇一摇',
    actionFaceDown: '屏幕朝下',
  },
  fakeAppHomeScreen: {
    removeInfo: '去除图片隐私信息',
    faceMosaic: '人像打码',
    textMosaic: '文本打码',
    QRCodeMosaic: '二维码/条形码打码',
  },
  fakeAppHomeSettingsScreen: {
    title: '伪装界面',
    fakeHomeEnabled: '开启伪装界面',
    unlockAction: '解锁方式',
    pullRefresh: '下拉刷新',
    slide: '向左滑动',
    shake: '摇一摇',
  },
};

export default zh;

export type Translations = typeof zh;
