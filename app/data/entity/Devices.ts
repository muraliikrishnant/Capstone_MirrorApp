import { addDoc, collection, FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { FIREBASE_DB } from "../../../config/Firebase";

export const saveDevice = async (id: string, user: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>): Promise<boolean> => {
    try {
        const savedDevice = await addDoc(collection(FIREBASE_DB(), "devices"), {
            id: id,
            user: user,
            pitch: 0,
            yaw: 0,
        });
        return true;
    } catch(error) {
        console.error("Error saving device : " + id, error);
        throw error;
    };
    return false;
};
