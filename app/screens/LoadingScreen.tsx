import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { FIREBASE_INIT_AUTH } from "../../config/Firebase";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { getAppStorageItem, removeAppStorageItem, setAppStorageItem } from "../types/Storage";
import { MA_CREDENTIAL } from "../types/Constants";
import { getUser } from "../data/entity/Users";
import { User } from "../data/model/Types";

const LoadingScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
    /*const [storageItem, setStorageItem] = useState<any>(null);

    const onAuthStateChanged = async (fbAuthUser: FirebaseAuthTypes.User | null) => {
        if (fbAuthUser) {
            console.log("User is signed in: " + fbAuthUser.email);
            const user = await getUser(fbAuthUser.uid) as User;
            setAppStorageItem(MA_CREDENTIAL, fbAuthUser);
            navigation.navigate('Home');
        } else {
            console.log("User is signed out");
            setStorageItem(null);
            removeAppStorageItem(MA_CREDENTIAL);
            navigation.navigate('Login');
        };
    };

    useEffect(() => {
        const subscriber = FIREBASE_INIT_AUTH().onAuthStateChanged(onAuthStateChanged);
        return subscriber;
    }, []);

    useEffect(() => {
        const fetchStorageItem = async () => {
            const item = await getAppStorageItem(MA_CREDENTIAL);
            setStorageItem(item);
        };
        fetchStorageItem();
    }, []);

    useEffect(() => {
        if(storageItem !== null) {
            navigation.navigate("Home");
        } else {
            console.log("else");
            navigation.navigate("Login");
        }
    }, [storageItem]);*/

    /* No bearing on back button press
    if (storageItem !== null && storageItem.hasValue) {
        console.log('In loading Home');
        navigation.navigate('Home');
    } else {
        console.log('In loading Login');
        navigation.navigate('Login');
    };*/

    return (
        <View
            style={{
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1
            }}
        >
            <ActivityIndicator size="large" />
        </View>
    );
};

export default LoadingScreen;
