import { collection, getDocs, query, where } from "@react-native-firebase/firestore";
import { FIREBASE_DB } from "../../../config/Firebase";
import { DB_ROLES, DB_ROLES_OWNER } from "../model/Constants";
import { Role } from "./../model/Types";
  
export const getOwner = async (): Promise<Role | undefined | null> => {
    try {
        const queryOwner = query(collection(FIREBASE_DB(), DB_ROLES), where("code", "==", DB_ROLES_OWNER));
        const owners = await getDocs(queryOwner);
        if (!owners.empty) {
            const ownerEntry = owners.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }) as Role);
            return ownerEntry.at(0);
        };
        return null;
    } catch(error) {
        console.error("Error getting Owner...", error);
        throw error;
    };
};

export const getOwnerId = async () => {
    const owner = await getOwner();
    return owner?.id;
}