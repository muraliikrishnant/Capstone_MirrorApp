import AsyncStorage from "@react-native-async-storage/async-storage";
import { StoredItem } from "./BaseTypes";

export const getAppStorageItem = async <T>(id: string): Promise<T | null> => {
    try {
        const storedValue = await AsyncStorage.getItem(id);
        return storedValue ? JSON.parse(storedValue) as T : null;
    } catch(error) {
        console.error("Error getting item from storage for id: " + id);
    }
    return null;
};

export const setAppStorageItem = async <T>(id: string, item: T): Promise<void> => {
    try {
        //console.log("Setting item");
        await AsyncStorage.setItem(id, JSON.stringify(item));
    } catch(error) {
        console.error("Error setting item from storage for id: " + id, error);
    }
};

export const removeAppStorageItem = async (id: string): Promise<void> => {
    try {
        //console.log("Removing item");
        await AsyncStorage.removeItem(id);
    } catch(error) {
        console.error("Error setting item from storage for id: " + id);
    }
};
