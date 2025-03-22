import { getUser, saveUser } from "./entity/Users";
import { Device, FullUser, Register, User } from "./model/Types";
import { getDevice, saveDevice } from "./entity/Devices";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";

export const registerUser = async (signUpData: Register): Promise<void> => {
    try {
        const userDoc = await saveUser(signUpData.user);
        if (userDoc) {
            await saveDevice(signUpData.deviceCode, userDoc.ref);
        };
    } catch(error) {
        console.error("Error during signup : " + signUpData.user.email, error);
        throw error;
    };
};

export const getFullUser = async (fbAuthUser: FirebaseAuthTypes.User): Promise<FullUser | null> => {
    try {
        const user = await getUser(fbAuthUser.uid) as User;
        const device = await getDevice(user.deviceCode) as Device;
        return {
            authUser: {
                displayName: fbAuthUser.displayName,
                email: fbAuthUser.email,
                emailVerified: fbAuthUser.emailVerified,
                isAnonymous: fbAuthUser.isAnonymous,
                phoneNumber: fbAuthUser.phoneNumber,
                photoURL: fbAuthUser.photoURL,
                providerId: fbAuthUser.providerId,
                uid: fbAuthUser.uid,
            } as FirebaseAuthTypes.User,
            user: {
                id: user.id,
                uid: user.uid,
                firstName: user.firstName,
                lastName: user.lastName,
                dateOfBirth: user.dateOfBirth,
                deviceCode: user.deviceCode,
                email: user.email,
            } as User,
            device: {
                id: device.id,
                code: device.code,
                pitch: device.pitch,
                yaw: device.yaw,
            } as Device,
        };
    } catch (error) {
        console.error("Error getting full user : " + fbAuthUser.uid, error);
        throw error;
    };
};
