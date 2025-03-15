import React from 'react';
//import { FirebaseAuthTypes } from "@react-native-firebase/auth";
//import AsyncStorage from '@react-native-async-storage/async-storage';
//import * as SplashScreen from 'expo-splash-screen';
import RootStack from './app/components/navigators/RootStack';
//import { CredentialsContext } from './app/types/CredentialsContext';

export default function App() {
  /*const [appIsReady, setAppIsReady] = useState(false);
  const [storedCredentials, setStoredCredentials] = useState<FirebaseAuthTypes.User | null>(null);

  const checkLoginCredentials = async () => {
    const user = await AsyncStorage.getItem('mpCredential');
    if (user !== null) {
      setStoredCredentials(JSON.parse(user));
    } else {
      setStoredCredentials(null);
    };
    SplashScreen.hide();
  };

  checkLoginCredentials();*/

  return (
    <RootStack />
  );
}
