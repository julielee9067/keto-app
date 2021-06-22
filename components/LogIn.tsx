import React, {useState} from 'react';
import styled, {css} from 'styled-components/native';
import {SafeAreaView, StatusBar, Text, useColorScheme} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {
  KakaoOAuthToken,
  // KakaoProfile,
  // getProfile as getKakaoProfile,
  login,
  // logout,
  // unlink,
} from '@react-native-seoul/kakao-login';
import {
  AppleButton,
  appleAuth,
} from '@invertase/react-native-apple-authentication';
import {NaverLogin, TokenResponse} from '@react-native-seoul/naver-login';

const Row = styled.View`
  flex: 1;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const Button = styled.TouchableOpacity<{color: string; center?: boolean}>`
  width: 80%;
  height: 60px;
  justify-content: center;
  align-items: center;
  background-color: ${({color}) => color};
  ${({center}) =>
    center &&
    css`
      margin: 10px 0;
    `}
`;

const ButtonText = styled.Text<{color: string}>`
  color: ${({color}) => color};
  font-weight: bold;
`;

const AppleLoginButton = styled(AppleButton)`
  width: 80%;
  height: 60px;
`;

// const naverConfig = {
//   kConsumerKey: 'wpmPs3dykb2QNC0duG7h',
//   kConsumerSecret: '6IX2rFPD_X',
//   kServiceAppName: 'NaverAfterbuy',
//   kServiceAppUrlScheme: 'afterbuyurlscheme' // only for iOS
// };

const LogIn = () => {
  const [result, setResult] = useState('');
  const [naverToken, setNaverToken] = useState<TokenResponse | undefined>(
    undefined,
  );
  const [apple, setApple] = useState<any>('');
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    flex: 1,
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const signInWithKakao = async (): Promise<void> => {
    const token: KakaoOAuthToken = await login();
    console.log(token);
    setResult(JSON.stringify(token));

    // const signOutWithKakao = async (): Promise<void> => {
    //   const message = await logout();

    //   setResult(message);
    // };

    // const getProfile = async (): Promise<void> => {
    //   const profile: KakaoProfile = await getKakaoProfile();

    //   setResult(JSON.stringify(profile));
    // };

    // const unlinkKakao = async (): Promise<void> => {
    //   const message = await unlink();

    //   setResult(message);
    // };
  };

  const naverLogin = (props: any) => {
    return new Promise((resolve, reject) => {
      NaverLogin.login(props, (err, token) => {
        console.log(`\n\n  Token is fetched  :: ${token} \n\n`);
        setNaverToken(token);
        if (err) {
          reject(err);
          return;
        }
        resolve(token);
      });
    });
  };

  const onAppleButtonPress = async () => {
    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    console.log(appleAuthRequestResponse);
    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );

    // use credentialState response to ensure the user is authenticated
    if (credentialState === appleAuth.State.AUTHORIZED) {
      // user is authenticated
      console.log(appleAuth.State.AUTHORIZED);
      setApple(JSON.stringify(appleAuthRequestResponse));
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Row>
        <Row>
          <Text>네이버 {naverToken}</Text>
          <Text>카카오 {result}</Text>
          <Text>애플 {apple}</Text>
        </Row>
        <Row>
          <Button color="yellow" onPress={signInWithKakao}>
            <ButtonText color="#000">카카오</ButtonText>
          </Button>
          <Button color="green" center onPress={() => naverLogin({})}>
            <ButtonText color="#fff">네이버</ButtonText>
          </Button>
          <AppleLoginButton
            buttonStyle={AppleButton.Style.BLACK}
            buttonType={AppleButton.Type.SIGN_IN}
            onPress={() => onAppleButtonPress()}
          />
        </Row>
      </Row>
    </SafeAreaView>
  );
};

export default LogIn;
