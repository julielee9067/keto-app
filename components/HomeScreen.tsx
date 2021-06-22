import {Button} from 'react-native-elements';
import React from 'react';

export default function HomeScreen({navigation}: {navigation: any}) {
  return (
    <>
      <Button
        title="Album"
        type="clear"
        onPress={() => navigation.navigate('Album')}
      />
      <Button
        title="LogIn"
        type="clear"
        onPress={() => navigation.navigate('LogIn')}
      />
    </>
  );
}
