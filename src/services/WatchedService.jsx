import {arrayRemove, arrayUnion, doc, updateDoc} from "firebase/firestore";
import {db} from "../config/FbConfig";

export const updateWatched = async (id,currentUser) => {
	try {
		const userDocRef = doc(db, "users", currentUser.uid);
		await updateDoc(userDocRef, {
			watched: arrayUnion(id),
		});
		return true;
	} catch (error) {
		console.error("Feil ved å legge til watched: ", error);
		return false;
	}
}
export const removeWatched = async (id,currentUser) => {
	try {
		const userDocRef = doc(db, "users", currentUser.uid);
		await updateDoc(userDocRef, {
			watched: arrayRemove(id),
		});
		return true;
	} catch (error) {
		console.error("Feil ved fjerning av watched: ", error);
	}
}