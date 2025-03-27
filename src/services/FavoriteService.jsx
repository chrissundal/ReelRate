import {arrayUnion, doc, updateDoc, arrayRemove, getDoc} from "firebase/firestore";
import {db} from "../config/FbConfig";

export const favoriteService = async (id, currentUser, movie, deleteFavorite) => {
	try {
		const userDocRef = doc(db, "users", currentUser.uid);
		if (deleteFavorite) {
			const userDoc = await getDoc(userDocRef);
			const userData = userDoc.data();
			const existingFavorite = userData.favorites.find(fav => fav.id === id);

			if (existingFavorite) {
				await updateDoc(userDocRef, {
					favorites: arrayRemove(existingFavorite)
				});
			}
			return "removed";
		} else {
			let favorite = {
				id: id,
				title: movie.Title,
				poster: movie.Poster,
				type: movie.Type,
				date: new Date()
			}

			await updateDoc(userDocRef, {
				favorites: arrayUnion(favorite)
			});
			return "added";
		}
	} catch (error) {
		console.error("Feil ved å håndtere favoritt: ", error);
		return false;
	}
};