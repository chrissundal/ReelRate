import {arrayUnion, doc, updateDoc, arrayRemove} from "firebase/firestore";
import {db} from "../config/FbConfig";

export const favoriteService = async (id,currentUser,movie,deleteFavorite) => {
	try {
		const userDocRef = doc(db, "users", currentUser.uid);
		let favorite = {
			id: id,
			title: movie.Title,
			poster: movie.Poster,
			type: movie.Type,
			date: new Date()
		}
		let check = deleteFavorite ? arrayRemove(favorite) : arrayUnion(favorite);
		await updateDoc(userDocRef, {
			favorites: check,
		});
		return deleteFavorite ? "removed" : "added";
	} catch (error) {
		console.error("Feil ved å legge til favoritt: ", error);
		return false;
	}
};