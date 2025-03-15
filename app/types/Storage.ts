import AsyncStorage from "@react-native-async-storage/async-storage";
import { StoredItem } from "./BaseTypes";

export const getAppStorageItem = async (id: string): Promise<StoredItem> => {
    const storedItem = new StoredItem();
    storedItem.hasValue = false;
    try {
        const storedValue = await AsyncStorage.getItem(id);
        storedItem.value = storedValue ? JSON.parse(storedValue) : null;
        storedItem.hasValue = true;
    } catch(error) {
        console.error("Error getting item from storage for id: " + id);
    }
    return storedItem;
};

export const setAppStorageItem = async <T>(id: string, item: T): Promise<void> => {
    try {
        await AsyncStorage.setItem(id, JSON.stringify(item));
    } catch(error) {
        console.error("Error setting item from storage for id: " + id);
    }
};
