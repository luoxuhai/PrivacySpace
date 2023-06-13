const zh = {
  common: {
    ok: '好',
    confirm: '确认',
    cancel: '取消',
    back: '返回',
    second: '秒',
    minute: '分钟',
    hour: '小时',
    appName: '隐私盒子',
    coming: '即将推出...',
    enable: '启动',
    disable: '禁用',
    enabled: '已启动',
    disabled: '已禁用',
    closed: '已关闭',
    opened: '已打开',
    open: '打开',
    close: '关闭',
    done: '完成',
    noData: '无数据',
    rename: '重命名',
    delete: '删除',
    share: '分享',
    save: '保存',
  },
  contentNavigator: {
    albumTab: '相册',
    filesTab: '文件',
    moreTab: '更多功能',
    settingsTab: '设置',
  },
  errorScreen: {
    title: '出错了～',
    reset: '重启',
    feedback: '反馈',
  },
  dbSeeds: {
    picture: '照片 🏞️',
    video: '视频 📀',
    folder: '默认文件夹 🗂️',
  },
  dataMigratorScreen: {
    title: '旧版本数据迁移',
    success: '迁移成功',
    fail: '迁移失败',
    tip: '请勿关闭本页面',
    doing: '正在迁移旧版本数据',
    someFailTitle: '是否导出迁移失败的数据',
    someFailMsg: '后续可到设置->高级设置里导出',
    export: '导出',
  },
  albumsScreen: {
    title: '相册',
    searchPlaceholder: '搜索相册、图片、视频',
    editAlbum: {
      title: '编辑相册',
      changeName: '修改名称',
      delete: '删除相册',
      rename: '重命名',
    },
    createAlbum: {
      title: '新建相册',
      message: '请输入相册名称',
      placeholder: '相册名称（255个字符内）',
      success: '已创建相册',
      fail: '创建相册失败',
      sameName: '相册名称不能相同',
    },
    renameAlbum: {
      title: '修改相册名称',
      message: '请输入相册新名称',
      success: '重命名成功',
      fail: '重命名失败',
    },
    deleteAlbum: {
      title: '确认删除',
      success: '删除成功',
      fail: '删除失败',
      doing: '删除中...',
    },
  },
  photoSearchPanel: {
    all: '全部',
    album: '相册',
    image: '图片',
    video: '视频',
  },
  photosScreen: {
    import: {
      photos: '相册',
      document: '文件',
      camera: '相机',
      download: '下载',
    },
    export: {
      success: '已导出',
      fail: '部分文件导出失败',
      message: '导出失败个数：{{count}}',
    },
    subtitle: {
      photo: '{{count}}张照片',
      video: '{{count}}个视频',
    },
    delete: {
      title: '这{{count}}个项目将被删除',
      softDeleteMsg: '删除后可到回收站中恢复',
      deleteMsg: '回收站已关闭，删除后不可恢复',
    },
    moveToAlbum: {
      title: '移动到相册',
      success: '已移动',
      fail: '移动失败',
    },
  },
  photoViewerScreen: {
    bottomToolbar: {
      more: '更多',
      description: '修改描述',
      moreTitle: '更多操作',
      descPlaceholder: '请输入描述',
    },
  },
  videoPlayerScreen: {
    airplayTip: '正在隔空播放',
    autoPausedTip: '已暂停播放',
  },
  settingsScreen: {
    purchaseBanner: {
      title: '隐私盒子高级版',
      subtitle: '开通后可获得完整的功能体验',
      purchasedSubtitle: '点击查看所有特权',
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
    emailCopied: '已复制邮箱',
    qqGroupCopied: '已复制 QQ 群号',
    checkUpdate: '检查更新',
    checkingUpdate: '正在检查更新',
  },
  debugScreen: {
    title: '调试',
  },
  purchaseScreen: {
    title: '隐私盒子高级版',
    subtitle: '完整的功能体验',
    purchasing: '购买中',
    purchaseSuccess: '购买成功',
    purchaseFail: '购买失败',
    purchased: '已购买',
    restore: '恢复购买',
    restoring: '恢复购买中',
    restoreSuccess: '恢复购买成功',
    restoreFail: '恢复购买失败',
    restoreFailMessage: '请先购买',
    help: '用户确认购买并付款后将记入 Apple 账户。如果您有任何疑问，请 ',
    connect: '联系我们。',
    buyButton: '{{ price }}开通永久会员',
    moreFeatures: '更多功能即将推出...',
    fetchInfoFailTitle: '获取内购失败',
    fetchInfoFailMessage: '请稍后再试',
    cardButton: '获取',
    features: {
      icloud: 'iCloud 同步数据',
      fakeHome: '伪装 App 主页',
      hideApp: '从设备隐藏任意 App',
      transfer: 'WI-FI 无限传输',
      changeAppIcon: '更换 App 图标',
      scanDocument: '扫描文档',
      smartSearch: '智能搜索',
      keepDuration: '自定义回收站保留时长',
      more: '更多功能即将推出',
    },
  },
  appLockScreen: {
    faceId: '面容',
    touchId: '指纹',
    unlock: '解锁 App',
    enterPassword: '请输入密码',
    passcodeLength: '密码长度',
    biometricsAuthFailed: '验证失败',
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
    dataExport: '数据导出',
    exceptionDataExport: '导出迁移失败的数据',
    allPhotoExport: '导出所有图片视频',
    allFileExport: '导出所有文件',
    dest: {
      title: '导出图片视频到以下位置',
      album: '相册',
      file: '文件',
    },
    clear: {
      title: '清理缓存',
      success: '已清理',
      fail: '清理缓存失败',
    },
    assetRepresentationMode: {
      title: '图片/视频导入模式',
      description: '会影响导入图片/视频的速度和兼容性，建议使用默认模式',
      menu: {
        auto: {
          title: '默认',
          description: '使用最佳格式',
        },
        compatible: {
          title: '兼容模式',
          description: '兼容性更好，但导入速度较慢',
        },
        current: {
          title: '原格式',
          description: '导入速度快，但可能无法在非iPhone设备上使用',
        },
      },
    },
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
    red: "小红书"
  },
  appIconName: {
    default: '默认',
    calculator: '计算器',
    passwordBox: '密码箱',
    clock: '时钟',
    housekeeper: '安全管家',
    todo: '待办',
    weather: '天气',
    news: '新闻',
    old: '拟物化',
  },
  urgentSwitchScreen: {
    title: '紧急切换',
    targetHeader: '选择应用',
    targetTip: '当设备触发跳转动作时会跳转到选择的应用',
    actionSectionTitle: '触发动作',
    actionShake: '摇一摇',
    actionFaceDown: '屏幕朝下',
    uninstall: '未安装该应用',
    openFail: '无法打开该应用',
  },
  fakeAppHomeScreen: {
    removeInfo: '去除图片隐私信息',
    exif: '查看图片隐私信息',
    faceMosaic: '人像打码',
    highlightMosaic: '二维码打码',
    textMosaic: '文字打码',
  },
  exifScreen: {
    import: '导入图片',
    save: '保存图片',
    exif: '图片隐私信息',
    removeExtra: '已去除图片隐私信息',
  },
  fakeAppHomeSettingsScreen: {
    title: '伪装首页',
    fakeHomeEnabled: '开启伪装首页',
    unlockAction: '解锁方式',
    pullRefresh: '下拉刷新',
    slide: '向左滑动',
    shake: '摇一摇',
  },
  moreFeatureScreen: {
    title: '更多功能',
  },
  icloudScreen: {
    title: 'iCloud 同步',
    subtitle: '多设备同步',
    autoSyncEnabled: '开启自动同步',
    onlyWifi: '仅在Wi-Fi下同步',
  },
  wastebasketScreen: {
    title: '回收站',
    recover: '恢复',
    delete: '删除',
    recoverAll: '恢复全部',
    deleteAll: '删除全部',
    deleteTitle: '删除后不可恢复',
  },
  recycleBinSettingsScreen: {
    title: '回收站设置',
    tip: '最多保留{{ duration }}天，之后将永久删除。',
    enableTip: '回收站已关闭，可在右上角设置中打开。',
    enableHeader: '关闭后，删除的文件不可恢复',
    enableTitle: '开启回收站',
    durationHeader: '保留天数',
    day: '天',
  },
  transferScreen: {
    title: ' WI-FI 无线传输',
    subtitle: '免流量跨平台极速传输',
    tip1: '在您的电脑或其他设备的浏览器中通过输入或扫描二维码打开以下网址。',
    tip2: '必须连接到同一个WI-FI，请勿离开本页面',
    errorTip: '请检查 WI-FI 连接',
    connectFail: '连接失败，请重试！',
    wifiTip: '请打开 WI-FI 后重试',
  },
  hideApplicationsScreen: {
    title: '隐藏App',
    subtitle: '从设备隐藏你指定的 App',
    enabled: '开启隐藏',
    selection: '选择要隐藏的 App',
    notSupported: '该功能只支持 iOS 16 及以上版本，请升级系统版本',
    permission: '请授予屏幕使用时间访问限制，才能正常使用该功能',
  },
  applicationPickerScreen: {
    title: '选择需要隐藏的 App',
  },
  filesScreen: {
    title: '文件',
    saveToLocal: '保存到本地',
    move: '移动',
    items: '项',
    select: '选择',
    selectAll: '全选',
    deselectAll: '取消全选',
    sort: '排序',
    sortSize: '大小',
    sortCtime: '创建时间',
    sortName: '名称',
    import: {
      success: '导入成功',
      fail: '导入失败',
      doing: '导入中...',
      folder: '新建文件夹',
      scan: '扫描文档',
      document: '导入文件',
      nonsupport: {
        msg: '当前设备不支持此功能',
      },
    },
    folderForm: {
      title: '新建文件夹',
      msg: '请输入新文件夹名称',
      placeholder: '文件夹名称（50个字符内）',
    },
    rename: {
      placeholder: '文件名称（255个字符内）',
      success: '重命名成功',
      fail: '重命名失败',
    },
    createFolder: {
      success: '创建文件夹成功',
      fail: '创建文件夹失败',
    },
    detail: {
      title: '详情',
      name: '名称',
      type: '类型',
      size: '大小',
      ctime: '创建时间',
      importTime: '导入时间',
      duration: '时长',
      resolution: '分辨率',
      description: '描述',
      labels: '标签',
    },
    types: {
      text: '文本',
      image: '图片',
      audio: '音频',
      video: '视频',
      application: '应用',
      model: '模型',
      folder: '文件夹',
      unknown: '未知',
    },
    deleteMsg: '删除后不可恢复',
  },
  permissionManager: {
    camera: '相机',
    microphone: '麦克风',
    faceID: '面容',
    photoLibrary: '相册',
    mediaLibrary: '媒体库',
    motion: '运动',
    unavailable: '{{permission}}功能不可用',
    blocked: '请前往设置授予{{permissions}}权限，才能正常使用该功能',
    openSettings: '打开设置',
    allPhotos: {
      title: '访问所有照片',
      message: '请授予访问所有照片权限，才能正常使用该功能',
    },
    noPermission: '无访问权限',
  },
  appUpdate: {
    alert: {
      title: '发现新版本(V{{version}})',
      ok: '更新',
      next: '下一次',
      ignore: '忽略',
    },
  },
};

export default zh;

export type Translations = typeof zh;
