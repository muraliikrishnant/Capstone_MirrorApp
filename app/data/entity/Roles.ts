import { collection, FirebaseFirestoreTypes, getDocs, query, where } from "@react-native-firebase/firestore";
import { FIREBASE_DB } from "../../../config/Firebase";
import { DB_ROLES, DB_ROLES_OWNER } from "../model/Constants";
import { Role } from "./../model/Types";
  
export const getOwnerRoleDoc = async (): Promise<FirebaseFirestoreTypes.QueryDocumentSnapshot<FirebaseFirestoreTypes.DocumentData> | null> => {
    try {
        const queryOwner = query(collection(FIREBASE_DB(), DB_ROLES), where("code", "==", DB_ROLES_OWNER));
        const owners = await getDocs(queryOwner);
        if (!owners.empty) {
            return owners.docs.at(0) ?? null;
        };
        return null;
    } catch(error) {
        console.error("Error getting Owner...", error);
        throw error;
    };
};
  
export const getOwnerRole = async (): Promise<Role | null> => {
    try {
        const ownerDoc = await getOwnerRoleDoc();
        if (ownerDoc !== null) {
            return {
                id: ownerDoc.id,
                ...ownerDoc.data(),
            } as Role;
        };
        return null;
    } catch(error) {
        console.error("Error getting Owner...", error);
        throw error;
    };
};

export const getOwnerId = async () => {
    const owner = await getOwnerRole();
    return owner?.id;
}