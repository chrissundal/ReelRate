import { getDoc, doc, updateDoc, arrayUnion, setDoc } from "firebase/firestore";
import { db } from "../config/FbConfig";

export const updateRating = async (
	userRating,
	id,
	currentUser,
	user,
	movie
) => {
	try {
		const ratingDocRef = doc(db, "ratings", id);
		const docSnap = await getDoc(ratingDocRef);
		let userName = user.firstName[0] + user.lastName[0]
		let ratingEntry = {
			userRating,
			userId: currentUser.uid,
			userName,
			genre: movie.Genre.split(',').map((g) => g.trim()),
			type: movie.Type,
			createdAt: new Date()
		};
		if (docSnap.exists()) {
			const data = docSnap.data();
			const newRatingLength = data.rating ? data.rating.length + 1 : 1;
			const currentAvgRating = data.avgRating || 0;
			const newAvgRating = (currentAvgRating * (newRatingLength - 1) + userRating) / newRatingLength;

			await updateDoc(ratingDocRef, {
				rating: arrayUnion(ratingEntry),
				avgRating: newAvgRating
			});
		} else {
			await setDoc(ratingDocRef, {
				rating: [ratingEntry],
				avgRating: userRating
			});
		}
		return true
	} catch (error) {
		console.error("Feil ved tillegging av vurdering: ", error);
		return false;
	}
};