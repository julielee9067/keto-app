/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Platform,
} from 'react-native';

import * as ConstantClass from '../Constants';
import {RNCamera} from 'react-native-camera';
import {PERMISSIONS, RESULTS, request} from 'react-native-permissions';

let camera: RNCamera;
export default function Camera({navigation}: {navigation: any}) {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState<any>(null);
  const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.back);
  const [flashMode, setFlashMode] = useState(RNCamera.Constants.FlashMode.off);

  const __startCamera = async () => {
    try {
      let status;
      if (Platform.OS === 'ios') {
        status = await request(PERMISSIONS.IOS.CAMERA);
      } else {
        status = await request(PERMISSIONS.ANDROID.CAMERA);
      }
      if (status !== RESULTS.GRANTED) {
        Alert.alert(ConstantClass.ACCESS_DENIED_MSG);
      }
    } catch (error) {
      Alert.alert(error);
    }
  };

  const __takePicture = async () => {
    if (!camera) {
      return;
    }
    const photo: any = await camera.takePictureAsync();
    setPreviewVisible(true);
    setCapturedImage(photo);
  };

  const __selectPhotoFromCamera = () => {
    console.log(capturedImage.uri);
    navigation.navigate('SelectedPhoto', {photoUri: capturedImage.uri});
  };

  const __retakePicture = () => {
    setCapturedImage(null);
    setPreviewVisible(false);
    __startCamera();
  };

  const __handleFlashMode = () => {
    if (flashMode === RNCamera.Constants.FlashMode.on) {
      setFlashMode(RNCamera.Constants.FlashMode.off);
    } else if (flashMode === RNCamera.Constants.FlashMode.off) {
      setFlashMode(RNCamera.Constants.FlashMode.on);
    } else {
      setFlashMode(RNCamera.Constants.FlashMode.auto);
    }
  };

  const __switchCamera = () => {
    if (cameraType === 'back') {
      setCameraType('front');
    } else {
      setCameraType('back');
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          width: '100%',
        }}>
        {previewVisible && capturedImage ? (
          <CameraPreview
            photo={capturedImage}
            retakePicture={__retakePicture}
            selectPhoto={__selectPhotoFromCamera}
          />
        ) : (
          <RNCamera
            flashMode={flashMode}
            type={cameraType}
            style={{flex: 1, width: '100%'}}
            ref={r => {
              if (r) {
                camera = r;
              }
            }}>
            <View
              style={{
                flex: 1,
                width: '100%',
                backgroundColor: 'transparent',
                flexDirection: 'row',
              }}>
              <View
                style={{
                  position: 'absolute',
                  left: '5%',
                  top: '10%',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  onPress={__handleFlashMode}
                  style={{
                    backgroundColor:
                      flashMode === RNCamera.Constants.FlashMode.off
                        ? '#000'
                        : '#fff',
                    borderRadius: 50,
                    height: 25,
                    width: 25,
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                    }}>
                    {ConstantClass.FLASH_ICON}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={__switchCamera}
                  style={{
                    marginTop: 20,
                    borderRadius: 50,
                    height: 25,
                    width: 25,
                  }}>
                  <Text
                    style={{
                      fontSize: 20,
                    }}>
                    {cameraType === 'front'
                      ? ConstantClass.FRONT_CAMERA_ICON
                      : ConstantClass.BACK_CAMERA_ICON}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  flexDirection: 'row',
                  flex: 1,
                  width: '100%',
                  padding: 20,
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    alignSelf: 'center',
                    flex: 1,
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={__takePicture}
                    style={{
                      width: 70,
                      height: 70,
                      bottom: 0,
                      borderRadius: 50,
                      backgroundColor: '#fff',
                    }}
                  />
                </View>
              </View>
            </View>
          </RNCamera>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const CameraPreview = ({photo, retakePicture, selectPhoto}: any) => {
  console.log('camera preview', photo);
  return (
    <View
      style={{
        backgroundColor: 'transparent',
        flex: 1,
        width: '100%',
        height: '100%',
      }}>
      <ImageBackground
        source={{uri: photo && photo.uri}}
        style={{
          flex: 1,
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            padding: 15,
            justifyContent: 'flex-end',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={retakePicture}
              style={{
                width: 130,
                height: 40,
                alignItems: 'center',
                borderRadius: 4,
              }}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 20,
                }}>
                {ConstantClass.RETAKE_PHOTO}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={selectPhoto}
              style={{
                width: 130,
                height: 40,

                alignItems: 'center',
                borderRadius: 4,
              }}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 20,
                }}>
                {ConstantClass.SELECT_PHOTO}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};
