import { useState, useEffect } from 'react';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/FbConfig";
import { useFirebase } from "../config/FbContext";

export const useUser = () => {
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const { currentUser } = useFirebase();

	useEffect(() => {
		const fetchUserData = async () => {
			setIsLoading(true);
			setError(null);
			try {
				if (!currentUser) {
					setUser(null);
					setIsLoading(false);
					return;
				}
				const userDocRef = doc(db, "users", currentUser.uid);
				const userDoc = await getDoc(userDocRef);

				if (userDoc.exists()) {
					setUser(userDoc.data());
				} else {
					setUser(null);
				}
			} catch (err) {
				console.error("Feil ved henting av bruker:", err);
				setError(err);
				setUser(null);
			} finally {
				setIsLoading(false);
			}
		};
		fetchUserData();
	}, [currentUser]);

	return { user, isLoading, error };
};