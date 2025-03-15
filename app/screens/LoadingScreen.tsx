import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { FIREBASE_INIT_AUTH } from "../../config/Firebase";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { getAppStorageItem, setAppStorageItem } from "../types/Storage";
import { MA_CREDENTIAL } from "../types/Constants";
import { StoredItem } from "../types/BaseTypes";

const LoadingScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
    //const [storageItem, setStorageItem] = useState<StoredItem | null>(null);

    const onAuthStateChanged = async (user: FirebaseAuthTypes.User | null) => {
        if (user) {
            console.log("User is signed in: " + user.email);
            setAppStorageItem(MA_CREDENTIAL, user);
            const storedItem = await getAppStorageItem(MA_CREDENTIAL);
            //setStorageItem(storageItem);
            navigation.navigate('Home');
        } else {
            console.log("User is signed out");
            //setStorageItem(null);
            setAppStorageItem(MA_CREDENTIAL, null);
            navigation.navigate('Login');
        };
    };

    useEffect(() => {
        const subscriber = FIREBASE_INIT_AUTH().onAuthStateChanged(onAuthStateChanged);
        return subscriber;
    }, []);

    /*useEffect(() => {
        const fetchStorageItem = async () => {
            const item = await getAppStorageItem(MA_CREDENTIAL);
            setStorageItem(item ? item : null);
        };
        fetchStorageItem();
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
