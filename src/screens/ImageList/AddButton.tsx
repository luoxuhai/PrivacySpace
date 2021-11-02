import React, { useRef } from 'react';
import {
  TouchableOpacityProps,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { RNToasty } from 'react-native-toasty';

import { stores, useStore } from '@/store';
import { HapticFeedback, getMediaInfo, getSourceByMime } from '@/utils';
import { useCreateFile } from '@/hooks';
import { SourceType } from '@/services/db/file';
import IconCamera from '@/assets/icons/camera.svg';
import IconFolder from '@/assets/icons/folder.svg';
import IconPhotoRectangle from '@/assets/icons/photo.on.rectangle.angled.svg';
import IconPlusCircleFill from '@/assets/icons/plus.circle.fill.svg';
import { FileImporter, IResult } from './FileImporter';
import { BottomSheet, IBottomSheetPropsRef } from '@/components/BottomSheet';

const fileImporter = new FileImporter();

const ICON_PROPS = {
  width: 30,
  height: 30,
  fill: '#FFF',
};

export async function transformResult(
  item: Partial<IResult>,
  parentId: string,
): Promise<any> {
  let info = {
    width: item.width,
    height: item.height,
    duration: item.duration,
  };
  if (getSourceByMime(item.mime!) === SourceType.Video) {
    info = await getMediaInfo(item.uri!);
  }

  return {
    parent_id: parentId,
    size: item.size,
    name: item.name,
    uri: item.uri,
    mime: item.mime!,
    width: info.width,
    height: info.height,
    localIdentifier: item.localIdentifier,
    duration: info.duration,
  };
}

interface IAddButtonProps {
  albumId: string;
  touchableOpacityProps?: TouchableOpacityProps;
  onDone?: () => void;
}

function AddButton(props: IAddButtonProps): JSX.Element {
  const bottomSheetRef = useRef<IBottomSheetPropsRef>();
  const { t } = useTranslation();
  const { ui, user, global } = useStore();

  const { mutateAsync: createFiles } = useCreateFile();

  const list = [
    {
      type: 'album',
      icon: <IconPhotoRectangle {...ICON_PROPS} />,
      title: '相册',
      color: ui.colors.systemOrange,
    },
    {
      type: 'document',
      icon: <IconFolder {...ICON_PROPS} />,
      title: '文件',
      color: ui.colors.systemBlue,
    },
    {
      type: 'camera',
      icon: <IconCamera {...ICON_PROPS} />,
      title: '相机',
      color: ui.colors.systemPink,
    },
  ];

  async function handleSelectImportFile(type: string) {
    let result;
    switch (type) {
      case 'album':
        result = await fileImporter
          .album({
            loadingLabelText: t('imageList:loadingLabelText'),
          })
          .open();
        break;
      case 'document':
        result = await fileImporter.document().open();
        break;
      case 'camera':
        await fileImporter
          .camera(async file => {
            await createFiles([await transformResult(file, props.albumId)]);
            props.onDone?.();
            HapticFeedback.impactAsync.medium();
            RNToasty.Show({
              title: '已导入',
              position: 'top',
            });
          })
          .open();
        break;
    }

    if (result) {
      await createFiles(
        await Promise.all(
          result.map(res => transformResult(res, props.albumId)),
        ),
      );
      props.onDone?.();
    }
  }

  return (
    <>
      <TouchableOpacity
        style={[
          styles.container,
          {
            shadowColor: stores.ui.themes.primary,
            backgroundColor: stores.ui.colors.white,
          },
        ]}
        onPress={() => {
          HapticFeedback.impactAsync.light();
          bottomSheetRef.current?.open();
        }}
        activeOpacity={0.8}
        {...props.touchableOpacityProps}>
        <IconPlusCircleFill
          width={50}
          height={50}
          fill={stores.ui.themes.primary}
        />
      </TouchableOpacity>
      <BottomSheet ref={bottomSheetRef}>
        <View style={[styles.bottomSheetWrapper, styles.bottomSheetContent]}>
          {list.map(item => (
            <TouchableOpacity
              style={styles.item}
              onPress={async () => {
                bottomSheetRef.current?.close();
                stores.global.setEnableMask(false);
                try {
                  await handleSelectImportFile(item.type);
                } finally {
                  stores.global.setEnableMask(true);
                }
              }}>
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: item.color,
                  },
                ]}>
                {item.icon}
              </View>
              <Text
                style={[
                  styles.title,
                  {
                    color: ui.colors.label,
                  },
                ]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheet>
    </>
  );
}

export default AddButton;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'red',
  },
  container: {
    position: 'absolute',
    bottom: 80,
    right: 40,
    borderRadius: 25,
    shadowOffset: {
      height: 3.5,
      width: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6.5,
  },
  bottomSheetWrapper: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  bottomSheetContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    height: '100%',
  },
  item: {
    alignItems: 'center',
    width: 100,
    marginBottom: 20,
  },
  iconContainer: {
    padding: 10,
    borderRadius: 6,
  },
  title: {
    marginTop: 8,
    fontSize: 14,
  },
});
