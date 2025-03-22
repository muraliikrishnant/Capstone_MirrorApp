import { addDoc, collection, getDoc, doc, FirebaseFirestoreTypes, query, where } from "@react-native-firebase/firestore";
import { FIREBASE_DB } from "../../../config/Firebase";
import { User } from "./../model/Types";
import { getOwnerRoleDoc } from "./Roles";

const getUserDoc = async (id: string): Promise<FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData> | null> => {
    try {
        const userDoc = await getDoc(doc(FIREBASE_DB(), "users", id));
        return userDoc.exists ? userDoc : null;
    } catch (error) {
        console.error("Error getting user id : " + id, error);
        throw error;
    };
};

// Get user by doc id or Firestore Auth User uid.
export const getUser = async (id: string): Promise<User | null> => {
    try {
        const userDoc = await getUserDoc(id);
        if (userDoc) {
            const user = { id: userDoc.id, ...userDoc.data() } as User;
            return user;
        } else {
            const userQueryDoc = await query(collection(FIREBASE_DB(), "users"), where("uid", "==", id)).get();
            if (!userQueryDoc.empty) {
                const user = userQueryDoc.size > 0 ? userQueryDoc.docs.at(0) : null;
                //console.log(user);
                return user ? { id: user.id, role: user.data().role.ref, ...user.data() } as User : null;
            };
        };
        return null;
    } catch (error) {
        console.error("Error getting user id : " + id, error);
        throw error;
    };
};

export const saveUser = async (user: User): Promise<FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData> | null> => {
    const ownerRole = await getOwnerRoleDoc();
    const userData = { ...user, role: ownerRole?.ref };
    try {
        const userDoc = await addDoc(collection(FIREBASE_DB(), "users"), userData);
        return await getUserDoc(userDoc.id);
    } catch(error) {
        console.error("Error saving user : " + user.email, error);
        throw error;
    };
};
