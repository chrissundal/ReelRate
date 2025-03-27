import {arrayRemove, arrayUnion, doc, updateDoc, getDoc} from "firebase/firestore";
import {db} from "../config/FbConfig";

export const watchedService = async (id, currentUser, movie, deleteWatched) => {
	try {
		const userDocRef = doc(db, "users", currentUser.uid);
		if (deleteWatched) {
			const userDoc = await getDoc(userDocRef);
			const userData = userDoc.data();
			const existingWatched = userData.watched.find(w => w.id === id);
			if (existingWatched) {
				await updateDoc(userDocRef, {
					watched: arrayRemove(existingWatched)
				});
			}
			return "removed";
		} else {
			let watched = {
				id: id,
				title: movie.Title,
				poster: movie.Poster,
				type: movie.Type,
				date: new Date()
			}
			await updateDoc(userDocRef, {
				watched: arrayUnion(watched)
			});
			return "added";
		}
	} catch (error) {
		console.error("Feil ved å håndtere watched: ", error);
		return false;
	}
};