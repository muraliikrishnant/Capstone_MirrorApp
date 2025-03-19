import { getOwnerDoc, getOwnerId } from "./Roles";
import { addDoc, collection, getDoc, doc, query, where } from "@react-native-firebase/firestore";
import { FIREBASE_DB } from "../../../config/Firebase";
import { User } from "./../model/Types";

export const saveUser = async (user: User): Promise<boolean> => {
    const owner = await getOwnerDoc();
    const { deviceId, ...userData } = { ...user, role: owner?.ref };
    try {
        const savedUser = await addDoc(collection(FIREBASE_DB(), "users"), userData);
        return true;
    } catch(error) {
        console.error("Error saving user : " + user.email, error);
        throw error;
    };
};

export const getUser = async (id: string): Promise<User | null> => {
    try {
        const userDoc = await getDoc(doc(FIREBASE_DB(), "users", id));
        if (userDoc.exists) {
            const user = { id: userDoc.id, ...userDoc.data() } as User;
            return user;
        }
        return null;
    } catch (error) {
        console.error("Error getting user id : " + id, error);
        throw error;
    };
};
