import {arrayUnion, doc, updateDoc, arrayRemove} from "firebase/firestore";
import {db} from "../config/FbConfig";

export const addFavorite = async (id,currentUser) => {
	try {
		const userDocRef = doc(db, "users", currentUser.uid);
		await updateDoc(userDocRef, {
			favorites: arrayUnion(id),
		});
		return true;
	} catch (error) {
		console.error("Feil ved å legge til favoritt: ", error);
		return false;
	}
};

export const removeFavorite = async (id,currentUser) => {
	try {
		const userDocRef = doc(db, "users", currentUser.uid);
		await updateDoc(userDocRef, {
			favorites: arrayRemove(id),
		});
		return true;
	} catch (error) {
		console.error("Feil ved fjerning av favoritt: ", error);
		return false;
	}
}