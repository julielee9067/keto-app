/* eslint-disable react-native/no-inline-styles */
import axios from 'axios';
import React from 'react';
import {useState} from 'react';
import {ImageBackground, Text, TouchableOpacity, View} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import * as ConstantClass from '../Constants';

export default function SelectedPhoto(photoUri: any) {
  const [crop, setCrop] = useState(false);
  const [sendToServer, setSendToServer] = useState(false);

  const __cropPicture = async () => {
    console.log(photoUri);
    ImageCropPicker.openCropper({
      mediaType: 'photo',
      path: photoUri,
      cropping: true,
    }).then(image => console.log(image));
  };

  const __recropPicture = () => {
    setCrop(true);
    __cropPicture();
  };

  const __sendPhotoToServer = () => {
    console.log(photoUri);
    let data = {
      uri: photoUri,
      name: 'image',
      type: ConstantClass.AXIOS_IMAGE_TYPE,
    };
    console.log(data);
    const client = axios.create({
      baseURL: ConstantClass.BACKEND_BASE_URL,
    });

    client
      .post('', data)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => console.log(`error: ${error}`));
  };

  return (
    <View
      style={{
        backgroundColor: 'transparent',
        flex: 1,
        width: '100%',
        height: '100%',
      }}>
      <ImageBackground
        source={{uri: photoUri}}
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
              style={{
                width: 130,
                height: 40,
                alignItems: 'center',
                borderRadius: 4,
              }}
              onPress={__recropPicture}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 20,
                }}>
                {ConstantClass.RECROP}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
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
                {ConstantClass.SEND_TO_SERVER}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}
