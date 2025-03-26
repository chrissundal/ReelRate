import { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/FbConfig";

export const useFetchRatings = () => {
	const [movieIds, setMovieIds] = useState([]);

	useEffect(() => {
		const fetchRatingsData = async () => {
			try {
				const ratingsCollection = collection(db, "ratings");
				const ratingsSnapshot = await getDocs(ratingsCollection);
				const data = ratingsSnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setMovieIds(data);
			} catch (error) {
				console.error("Error fetching ratings:", error);
			}
		};
		fetchRatingsData();
	}, []);

	return movieIds;
};