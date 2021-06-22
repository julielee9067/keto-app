/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useState} from 'react';
import {
  Platform,
  View,
  Image,
  FlatList,
  Alert,
  TouchableOpacity,
} from 'react-native';

import * as ConstantClass from '../Constants';
import CameraRoll, {PhotoIdentifier} from '@react-native-community/cameraroll';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {useEffect} from 'react';

export default function Album({navigation}: {navigation: any}) {
  const cameraImage = require('../resources/camera.png');
  const cameraImageUri = Image.resolveAssetSource(cameraImage).uri;
  const initialCameraImageName = 'initialCameraPhoto';

  const [imageData, setImageData] = useState<PhotoIdentifier[]>([]);
  const [pageNum, setPageNum] = useState<number>(1);
  const [getData, setGetData] = useState(true);
  // const [loadMore, setLoadMore] = useState(false);

  const __selectPhotoFromAlbum = (item: PhotoIdentifier) => {
    if (imageData.indexOf(item) === 0) {
      navigation.navigate('Camera');
    } else {
      navigation.navigate('SelectedPhoto', {photo: item});
    }
  };

  // const __handleLoadMore = () => {
  //   setLoadMore(true);
  //   __getData();
  // };

  const __getData = useCallback(() => {
    const tempCameraImageData = {
      node: {
        type: 'photo',
        group_name: '',
        timestamp: 0,
        location: null,
        image: {
          filename: initialCameraImageName,
          height: 0,
          width: 0,
          fileSize: null,
          uri: cameraImageUri,
          playableDuration: 0,
        },
      },
    };

    if (getData) {
      CameraRoll.getPhotos({
        first: 50,
        assetType: 'Photos',
      })
        .then(res => {
          res.edges.unshift(tempCameraImageData);
          setImageData(res.edges);
          setPageNum(pageNum + 1);
          console.log(imageData);
        })
        .catch(error => {
          console.log(error);
        });
    }
    setGetData(false);
  }, [cameraImageUri, getData, imageData, pageNum]);

  useEffect(() => {
    async function __startAlbum() {
      try {
        let status;
        if (Platform.OS === 'ios') {
          status = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
        } else {
          status = await request(
            PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE &&
              PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
          );
        }
        if (status !== RESULTS.GRANTED) {
          console.log(ConstantClass.ACCESS_DENIED_MSG);
          return;
        } else {
          __getData();
        }
      } catch (error) {
        Alert.alert(error);
      }
    }
    __startAlbum();
  }, [__getData]);

  return (
    <View>
      <FlatList
        data={imageData}
        numColumns={3}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => __selectPhotoFromAlbum(item)}
            style={{height: 150, width: '33%'}}>
            <Image
              style={{
                width: '100%',
                height: 150,
              }}
              source={{uri: item.node.image.uri}}
            />
          </TouchableOpacity>
        )}
        // onEndReached={__handleLoadMore}
      />
    </View>
  );
}
