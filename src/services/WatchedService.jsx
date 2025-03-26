import {arrayRemove, arrayUnion, doc, updateDoc} from "firebase/firestore";
import {db} from "../config/FbConfig";

export const watchedService = async (id,currentUser,movie,deleteWatched) => {
	try {
		const userDocRef = doc(db, "users", currentUser.uid);
		let watched = {
			id: id,
			title: movie.Title,
			poster: movie.Poster,
			type: movie.Type,
			date: new Date()
		}
		let check = deleteWatched ? arrayRemove(watched) : arrayUnion(watched);
		await updateDoc(userDocRef, {
			watched: check,
		});
		return deleteWatched ? "removed" : "added";
	} catch (error) {
		console.error("Feil ved å legge til watched: ", error);
		return false;
	}
}