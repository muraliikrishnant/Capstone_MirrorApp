import { saveUser } from "./entity/Users";
import { Register } from "./model/Types";
import { saveDevice } from "./entity/Devices";

export const registerUser = async (signUpData: Register): Promise<void> => {
    try {
        const userDoc = await saveUser(signUpData.user);
        if (userDoc) {
            await saveDevice(signUpData.deviceId, userDoc.ref);
        }
    } catch(error) {
        console.error("Error during signup : " + signUpData.user.email, error);
        throw error;
    };
};
