import { getAssetInfoAsync } from 'expo-media-library';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import { PermissionManager } from '@/utils';
import { FileImporter, IResult } from '@/screens/FilesScreen/helpers/FileImporter';
import { PhotoSubtypes } from '@/database/entities/types';

export { IResult };

export interface PhotoImporterResult extends IResult {
  exif?: Record<string, any>;
  subtypes?: PhotoSubtypes[];
  location?: Location;
}

export class PhotoImporter extends FileImporter {
  public static album = {
    async open(): Promise<PhotoImporterResult[] | void> {
      if (!(await PermissionManager.checkPermissions(['ios.permission.PHOTO_LIBRARY']))) {
        return;
      }
      const result = await launchImageLibrary({
        mediaType: 'mixed',
        selectionLimit: 0,
        includeExtra: true,
        quality: 1,
        presentationStyle: 'pageSheet',
      });

      const results: PhotoImporterResult[] = [];

      for (const [_, asset] of result.assets.entries()) {
        const { exif, width, height, mediaSubtypes, creationTime, modificationTime } =
          await getAssetInfoAsync(asset.id);
        results.push({
          name: asset.fileName,
          size: asset.fileSize,
          uri: asset.uri.replace('file://', ''),
          mime: asset.type,
          width,
          height,
          duration: Math.round(asset.duration) || 0,
          localIdentifier: asset.id,
          exif,
          subtypes: mediaSubtypes.map((val) => internalSubtypeMap[val]).filter((val) => val),
          location: asset.location,
          ctime: creationTime,
          mtime: modificationTime,
        });
      }

      return results;
    },
  };

  public static camera = {
    async open(): Promise<PhotoImporterResult[] | void> {
      if (!(await PermissionManager.checkPermissions(['ios.permission.CAMERA']))) {
        return;
      }

      const result = await launchCamera({
        cameraType: 'back',
        mediaType: 'mixed',
        presentationStyle: 'fullScreen',
        saveToPhotos: false,
      });

      console.log('result.assets', result.assets[0]);
      const ctime = Date.now();
      return result.assets?.map((asset) => ({
        name: asset.fileName,
        size: asset.fileSize,
        uri: asset.uri.replace('file://', ''),
        mime: asset.type,
        width: asset.width,
        height: asset.height,
        duration: asset.duration ? asset.duration * 1000 : 0,
        ctime,
        mtime: ctime,
      }));
    },
  };

  public static download = {
    open() {
      console.log('download');
    },
  };
}

// function translateSubtypeFromString() {
//   switch ()
// }

const internalSubtypeMap = {
  depthEffect: PhotoSubtypes.DepthEffect,
  hdr: PhotoSubtypes.Hdr,
  highFrameRate: PhotoSubtypes.HighFrameRate,
  livePhoto: PhotoSubtypes.LivePhoto,
  panorama: PhotoSubtypes.Panorama,
  screenshot: PhotoSubtypes.Screenshot,
  stream: PhotoSubtypes.Stream,
  timelapse: PhotoSubtypes.Timelapse,
};