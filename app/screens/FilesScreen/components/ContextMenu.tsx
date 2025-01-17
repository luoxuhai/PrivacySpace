import React, { ReactElement, useCallback, useMemo, ForwardedRef, useEffect, useRef } from 'react';
import { Share, findNodeHandle } from 'react-native';
import RNShare from 'react-native-share';
import { observer } from 'mobx-react-lite';
import { ContextMenuView, MenuConfig } from 'react-native-ios-context-menu';
import { SheetManager } from 'react-native-actions-sheet';

import { FileTypes } from '@/database/entities/types';
import { translate } from '@/i18n';
import { FetchFilesResult } from '@/services/local/file';
import { useRenameFile } from '../helpers/useRenameFile';
import { useDeleteFile } from '../helpers/useDeleteFile';
import { useMoveToAlbum } from '../helpers/useMoveToAlbum';

interface ContextMenuProps {
  item: FetchFilesResult;
  children: ReactElement;
  onMenuDidHide?: () => void;
}

export const ContextMenu = observer<ContextMenuProps, ForwardedRef<any>>(
  (props, ref) => {
    const { item, children } = props;
    const menuConfig = useMemo<MenuConfig>(() => getMenuConfig(item?.type), [item?.type]);
    const handleRenameFile = useRenameFile(item.parent_id);
    const handleDeleteFile = useDeleteFile(item.parent_id);
    const handleMovePhotos = useMoveToAlbum(item.parent_id);
    const [targetViewNode, setTargetViewNode] = React.useState(null);

    useEffect(() => {
      setTargetViewNode(findNodeHandle(ref?.current));
    }, []);

    const handlePressMenuItem = useCallback(
      ({ nativeEvent }) => {
        const { item } = props;
        switch (nativeEvent.actionKey) {
          case ContextMenuKeys.Details:
            SheetManager.show('file-detail-sheet', {
              payload: {
                item,
              },
            });
            break;
          case ContextMenuKeys.Rename:
            handleRenameFile(item);
            break;
          case ContextMenuKeys.Share:
            Share.share({
              url: item.uri,
            });
            break;
          case ContextMenuKeys.SaveToLocal:
            RNShare.open({
              url: encodeURI(item.uri),
              saveToFiles: true,
            });
            break;
          case ContextMenuKeys.Delete:
            handleDeleteFile({
              items: [
                {
                  id: item.id,
                  type: item.type,
                },
              ],
            });
            break;
          case ContextMenuKeys.MoveToAlbum:
            handleMovePhotos([item.id]);
            break;
        }
      },
      [item],
    );

    return (
      <ContextMenuView
        menuConfig={menuConfig}
        previewConfig={{
          targetViewNode,
        }}
        onPressMenuItem={handlePressMenuItem}
        onMenuDidHide={props.onMenuDidHide}
      >
        {children}
      </ContextMenuView>
    );
  },
  { forwardRef: true },
);

enum ContextMenuKeys {
  Details = 'details',
  Share = 'share',
  Rename = 'rename',
  SaveToLocal = 'save-to-local',
  MoveToAlbum = 'move-to-album',
  Delete = 'delete',
}

function getMenuConfig(type: FileTypes): MenuConfig {
  const isFolder = type === FileTypes.Folder;

  return {
    menuTitle: '',
    menuItems: [
      {
        menuTitle: '',
        menuOptions: ['displayInline'],
        menuItems: [
          {
            actionKey: ContextMenuKeys.Details,
            actionTitle: translate('filesScreen.detail.title'),
            icon: {
              iconType: 'SYSTEM',
              iconValue: 'info.circle',
            },
          },
          {
            actionKey: ContextMenuKeys.Rename,
            actionTitle: translate('common.rename'),
            icon: {
              iconType: 'SYSTEM',
              iconValue: 'pencil',
            },
          },

          [FileTypes.Image, FileTypes.Video].includes(type) && {
            actionKey: ContextMenuKeys.MoveToAlbum,
            actionTitle: translate('photosScreen.moveToAlbum.title'),
            icon: {
              iconType: 'SYSTEM',
              iconValue: 'photo.on.rectangle.angled',
            },
          },
          !isFolder && {
            actionKey: ContextMenuKeys.Share,
            actionTitle: translate('common.share'),
            icon: {
              iconType: 'SYSTEM',
              iconValue: 'square.and.arrow.up',
            },
          },
          !isFolder && {
            actionKey: ContextMenuKeys.SaveToLocal,
            actionTitle: translate('filesScreen.saveToLocal'),
            icon: {
              iconType: 'SYSTEM',
              iconValue: 'square.and.arrow.down',
            },
          },
        ].filter((item) => item),
      },
      {
        menuTitle: '',
        menuOptions: ['displayInline'],
        menuItems: [
          {
            actionKey: ContextMenuKeys.Delete,
            actionTitle: translate('common.delete'),
            icon: {
              iconType: 'SYSTEM',
              iconValue: 'trash',
            },
            menuAttributes: ['destructive'],
          },
        ],
      },
    ].filter((item) => item),
  };
}
