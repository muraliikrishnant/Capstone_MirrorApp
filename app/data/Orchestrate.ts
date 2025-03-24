import { getUser, saveUser } from "./entity/Users";
import { FullUser, Register, User } from "./model/Types";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";

export const registerUser = async (signUpData: Register): Promise<void> => {
    try {
        await saveUser(signUpData.user);
    } catch(error) {
        console.error("Error during signup : " + signUpData.user.email, error);
        throw error;
    };
};

export const getFullUser = async (fbAuthUser: FirebaseAuthTypes.User): Promise<FullUser | null> => {
    try {
        const user = await getUser(fbAuthUser.uid) as User;
        console.log(user);
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
                dateOfBirth: user.dateOfBirth,
                email: user.email,
                firstName: user.firstName,
                id: user.id,
                lastName: user.lastName,
                pitch: user.pitch,
                uid: user.uid,
                yaw: user.yaw,
            } as User,
        };
    } catch (error) {
        console.error("Error getting full user : " + fbAuthUser.uid, error);
        throw error;
    };
};
