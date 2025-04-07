import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, Button } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/firebaseConfig'; // adjust this import to your path

WebBrowser.maybeCompleteAuthSession();

type UserInfo = {
  name: string;
  email: string;
  picture: string;
};

const Signin = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: 'https://auth.expo.io/@christopher4113/home-oop', // Replace this
  });

  useEffect(() => {
    const authenticateWithFirebase = async () => {
      if (response?.type === 'success' && response.authentication?.accessToken && response.authentication?.idToken) {
        const { idToken, accessToken } = response.authentication;
  
        const credential = GoogleAuthProvider.credential(idToken, accessToken);
        try {
          const firebaseResult = await signInWithCredential(auth, credential);
          console.log('User signed in with Firebase:', firebaseResult.user);
          setUserInfo({
            name: firebaseResult.user.displayName || '',
            email: firebaseResult.user.email || '',
            picture: firebaseResult.user.photoURL || '',
          });
        } catch (firebaseError) {
          console.log('Firebase sign-in error', firebaseError);
        }
      }
    };
  
    authenticateWithFirebase();
  }, [response]);

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {userInfo ? (
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 20, marginBottom: 10 }}>Welcome, {userInfo.name}</Text>
          <Text>{userInfo.email}</Text>
        </View>
      ) : (
        <>
          <Text style={{ marginBottom: 20 }}>Sign In</Text>
          <Button
            disabled={!request}
            title="Sign in with Google"
            onPress={() => promptAsync()}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default Signin;
