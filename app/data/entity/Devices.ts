import { addDoc, collection, doc, FirebaseFirestoreTypes, getDoc, query, updateDoc, where } from "@react-native-firebase/firestore";
import { FIREBASE_DB } from "../../../config/Firebase";
import { Device } from "../model/Types";

export const saveDevice = async (id: string, user: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>): Promise<void> => {
    try {
        await addDoc(collection(FIREBASE_DB(), "devices"), {
            code: id,
            user: user,
            pitch: 0,
            yaw: 0,
        });
    } catch(error) {
        console.error("Error saving device : " + id, error);
        throw error;
    };
};

// Get device by doc id or the actual id of the device.
export const getDevice = async (id: string): Promise<Device | null> => {
    try {
        const deviceDoc = await getDoc(doc(FIREBASE_DB(), "devices", id));
        if (deviceDoc.exists) {
            return { id: deviceDoc.id, ...deviceDoc.data() } as Device;
        }
        const deviceQueryDoc = await query(collection(FIREBASE_DB(), "devices"), where("code", "==", id)).get();
        if (!deviceQueryDoc.empty) {
            const device = deviceQueryDoc.size > 0 ? deviceQueryDoc.docs.at(0) : null;
            //console.log(device);
            return device ? { id: device.id, ...device.data() } as Device : null;
        }
        return null;
    } catch (error) {
        console.error("Error getting user id : " + id, error);
        throw error;
    };
};

// Giving error need to check
export const getDeviceForUser = async (id: string): Promise<Device | null> => {
    try {
        const deviceDoc = await query(collection(FIREBASE_DB(), "devices"), where("user", "==", "/users/" + id)).get();
        if (!deviceDoc.empty) {
            const device = deviceDoc.size > 0 ? deviceDoc.docs.at(0) : null;
            return device?.exists ? { id: device.id, user: device.data().user?.ref, ...device.data() } as Device : null;
        }
        return null;
    } catch (error) {
        console.error("Error getting user id : " + id, error);
        throw error;
    };
};

export const saveDevicePreset = async (device: Partial<Device>): Promise<void> => {
    try {
        await updateDoc(doc(FIREBASE_DB(), "devices", device.id ?? ""), {
            pitch: device.pitch,
            yaw: device.yaw,
        });
    } catch (error) {
        console.error("Error saving preset : " + device.id, error);
        throw error;
    };
};
