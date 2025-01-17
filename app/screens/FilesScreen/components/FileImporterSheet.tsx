import React, { useMemo } from 'react';
import { TouchableOpacity, View, Text, ViewStyle, TextStyle } from 'react-native';
import { observer } from 'mobx-react-lite';
import { SFSymbol } from 'react-native-sfsymbols';
import ActionSheet, { SheetProps, SheetManager } from 'react-native-actions-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DocumentPicker from 'react-native-document-picker';

import { radius, useTheme, Colors } from '@/theme';
import { FileImportTypes } from '../constants';
import { useFolderCreator } from '../helpers/useFolderCreator';
import { translate } from '@/i18n';
import { FileImporter } from '../helpers/FileImporter';
import { useImportFile } from '../helpers/useImportFile';
import { canUsePremium } from '@/utils/canUsePremium';

const ICON_PROPS = {
  size: 30,
  color: '#FFF',
};

interface FileImporterSheetProps extends SheetProps<{ parentId?: string }> {}

export const FileImporterSheet = observer<FileImporterSheetProps>((props) => {
  const { parentId } = props.payload;
  const { colors, isDark } = useTheme();
  const safeAreaInsets = useSafeAreaInsets();

  const handleCreateFolder = useFolderCreator(parentId);
  const handleImportFile = useImportFile(parentId);

  const list = useMemo(() => getFileImportList(colors), [colors]);

  async function handleImport(type: FileImportTypes) {
    switch (type) {
      case FileImportTypes.Folder:
        handleCreateFolder();
        break;
      case FileImportTypes.Scan:
        {
          if (!canUsePremium()) {
            return;
          }
          const results = await FileImporter.documentCamera.open();
          if (!results?.length) {
            return;
          }

          handleImportFile(results);
        }
        break;
      case FileImportTypes.Document: {
        const results = await FileImporter.document.open({
          type: [DocumentPicker.types.allFiles],
        });
        if (!results?.length) {
          return;
        }
        handleImportFile(results);
      }
    }

    SheetManager.hide(props.sheetId);
  }

  return (
    <ActionSheet
      id={props.sheetId}
      containerStyle={{
        borderTopLeftRadius: radius[10],
        borderTopRightRadius: radius[10],
        paddingBottom: safeAreaInsets.bottom,
        backgroundColor: isDark ? colors.secondaryBackground : colors.background,
      }}
      indicatorStyle={{
        width: 80,
        backgroundColor: colors.tertiaryFill,
      }}
      isModal={false}
      gestureEnabled={true}
    >
      <View style={$bottomSheetContent}>
        {list.map((item) => (
          <TouchableOpacity key={item.title} style={$item} onPress={() => handleImport(item.type)}>
            <View
              style={[
                $iconContainer,
                {
                  backgroundColor: item.color,
                },
              ]}
            >
              {item.icon}
            </View>
            <Text
              style={[
                $title,
                {
                  color: colors.label,
                },
              ]}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ActionSheet>
  );
});

function getFileImportList(colors: Colors) {
  return [
    {
      type: FileImportTypes.Scan,
      icon: (
        <SFSymbol
          name="doc.viewfinder"
          color={ICON_PROPS.color}
          style={{ width: ICON_PROPS.size, height: ICON_PROPS.size }}
        />
      ),
      title: translate('filesScreen.import.scan'),
      color: colors.palette.orange,
    },
    {
      type: FileImportTypes.Document,
      icon: (
        <SFSymbol
          name="folder"
          color={ICON_PROPS.color}
          style={{ width: ICON_PROPS.size, height: ICON_PROPS.size }}
        />
      ),
      title: translate('filesScreen.import.document'),
      color: colors.palette.blue,
    },
    {
      type: FileImportTypes.Folder,
      icon: (
        <SFSymbol
          name="plus.rectangle.on.folder"
          color={ICON_PROPS.color}
          style={{ width: ICON_PROPS.size, height: ICON_PROPS.size }}
        />
      ),
      title: translate('filesScreen.import.folder'),
      color: colors.palette.primary6,
    },
  ];
}

const $bottomSheetContent: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  height: 140,
  paddingTop: 20,
  paddingHorizontal: 10,
  borderTopEndRadius: 16,
  borderTopStartRadius: 16,
};

const $item: ViewStyle = {
  alignItems: 'center',
  minWidth: 100,
  marginBottom: 20,
};

const $iconContainer: ViewStyle = {
  padding: 10,
  borderRadius: 6,
};

const $title: TextStyle = {
  marginTop: 8,
  fontSize: 14,
};
