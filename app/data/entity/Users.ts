import { getOwnerId } from "./Roles";
import { addDoc, collection, getDocs, query, where } from "@react-native-firebase/firestore";
import { FIREBASE_DB } from "../../../config/Firebase";
import { DB_ROLES, DB_ROLES_OWNER } from "../model/Constants";
import { User } from "./../model/Types";

export const saveUser = async (user: User): Promise<boolean> => {
    const owenerId = await getOwnerId();
    const { deviceId, ...userData } = { ...user, role: owenerId };
    try {
        const savedUser = await addDoc(collection(FIREBASE_DB(), "users"), userData);
        return true;
    } catch(error) {
        console.error("Error saving user : " + user.email, error);
        throw error;
    };
    return false;
};
