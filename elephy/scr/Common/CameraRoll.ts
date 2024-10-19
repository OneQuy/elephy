/**
 * Add this to plist (crash if not)
 * 
<key>NSPhotoLibraryAddUsageDescription</key>
<string>Please accept the permission to pick your game item&apos;s photo for us to extract text from that one and rate it.</string>	
* 
*/

import { PermissionsAndroid, Platform } from "react-native";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { GetFullDirPathOfFile } from "./FileUtils";

/**
 * 
 * @returns undefined if error
 */
export async function GetPhotosPathAsync() {
  try {
    const res = await CameraRoll.getPhotos({
      first: 1,
      assetType: 'All'
    })

    return GetFullDirPathOfFile(res.edges[0].node.image.uri)
  }
  catch {
    return undefined
  }
}

/**
 * 
 * @returns null if success, otherwise error
 */
export async function SaveToGalleryAsync(flp: string) {
  try {
    if (Platform.OS === 'android') {
      await checkAndroidPermission();
    }

    // CameraRoll.save(flp, { type, album })
    await CameraRoll.saveAsset(flp)
    return null;
  }
  catch (error) {
    return error;
  }
};

const checkAndroidPermission = async () => {
  try {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
    await PermissionsAndroid.request(permission);
    Promise.resolve();
  } catch (error) {
    Promise.reject(error);
  }
}