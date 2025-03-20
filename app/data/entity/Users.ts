import { addDoc, collection, getDoc, doc, FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { FIREBASE_DB } from "../../../config/Firebase";
import { User } from "./../model/Types";
import { getOwnerDoc } from "./Roles";

const getUserDoc = async (id: string): Promise<FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData> | null> => {
    try {
        const userDoc = await getDoc(doc(FIREBASE_DB(), "users", id));
        if (userDoc.exists) {
            return userDoc;
        }
        return null;
    } catch (error) {
        console.error("Error getting user id : " + id, error);
        throw error;
    };
};

export const saveUser = async (user: User): Promise<FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData> | null> => {
    const owner = await getOwnerDoc();
    const userData = { ...user, role: owner?.ref };
    try {
        const userDoc = await addDoc(collection(FIREBASE_DB(), "users"), userData);
        return await getUserDoc(userDoc.id);
    } catch(error) {
        console.error("Error saving user : " + user.email, error);
        throw error;
    };
};

export const getUser = async (id: string): Promise<User | null> => {
    try {
        const userDoc = await getUserDoc(id);
        if (userDoc) {
            const user = { id: userDoc.id, ...userDoc.data() } as User;
            return user;
        }
        return null;
    } catch (error) {
        console.error("Error getting user id : " + id, error);
        throw error;
    };
};
