// Import the functions you need from the SDKs you need}
import firebase from "@react-native-firebase/app";
import { Platform } from 'react-native';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
//import { getFirestore } from "@react-native-firebase/firestore";
//import getStorage from "@react-native-firebase/storage";
//import initializeAuth from "@react-native-firebase/auth";
//import getAuth from "@react-native-firebase/auth";
//import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
//import AsyncStorage from "@react-native-async-storage/async-storage";

// Web Mirror_Remote Firebase configuration
/*const MIRROR_REMOTE = {
  apiKey: "AIzaSyCrb4hovrKIWXunjpP8NzNIh2XexK-80wo",
  authDomain: "mirror-remote-8b10a.firebaseapp.com",
  projectId: "mirror-remote-8b10a",
  storageBucket: "mirror-remote-8b10a.firebasestorage.app",
  messagingSenderId: "1097466829610",
  appId: "1:1097466829610:web:db576774f75c29bdf4dc53",
  measurementId: "G-K413M4R1K3"
};*/

// Your secondary Firebase project credentials for Android...
const androidCredentials = {
  clientId: '86493602473-tnea6tf9vp8fn3f9mt05s14ej84trruj.apps.googleusercontent.com',
  appId: '1:86493602473:android:c8b7a7b57adcb8f8d5bfb8',
  apiKey: 'AIzaSyDQCzjs_wQzsZ06D56_567n7PPZ4WnBvTI',
  //databaseURL: '',
  storageBucket: 'mirrorcontrollerapp.firebasestorage.app',
  messagingSenderId: '86493602473',
  projectId: 'mirrorcontrollerapp',
};

// Your secondary Firebase project credentials for iOS...
const iosCredentials = {
  clientId: '86493602473-leec4h5rerqcnac3d1l84fdrai8q81fh.apps.googleusercontent.com',
  appId: '1:86493602473:ios:f0ac45e3fb78d396d5bfb8',
  apiKey: 'AIzaSyDvA0jgzTiNn-Jno5hB-wGenNYTDyZro9g',
  //databaseURL: '',
  storageBucket: 'mirrorcontrollerapp.firebasestorage.app',
  messagingSenderId: '86493602473',
  projectId: 'mirrorcontrollerapp',
};

// Select the relevant credentials
const credentials = Platform.select({
  android: androidCredentials,
  ios: iosCredentials,
});

const config = {
  name: 'SECONDARY_APP',
};

// This is only needed on the web for the other platform.
// https://rnfirebase.io/platforms
// Before initializing Firebase set the Async Storage implementation
// that will be used to persist user sessions.
// firebase.setReactNativeAsyncStorage(AsyncStorage);

// Initialize Firebase
export const FIREBASE_APP = async () => {
  if (credentials) {
    await firebase.initializeApp(credentials, config);
    console.log('Secondary Firebase app initialized successfully!');
  } else {
    console.error('Failed to initialize Firebase: credentials are undefined');
  }
};
export const FIREBASE_INIT_AUTH = auth;
export const FIREBASE_DB = firestore;

//export const FIREBASE_APP = initializeApp(MIRROR_REMOTE);
//export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
//export const FIREBASE_INIT_AUTH = initializeAuth(FIREBASE_APP);
//export const FIREBASE_DB = getFirestore(FIREBASE_APP);
//export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);
//export const FIREBASE_ASYNC_STORAGE = AsyncStorage;
