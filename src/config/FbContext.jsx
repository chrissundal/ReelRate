import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from './FbConfig';

const FbContext = createContext();
export const useFirebase = () => useContext(FbContext);

export const FirebaseProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);
	const [loading, setLoading] = useState(true);

	const auth = getAuth(app);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setCurrentUser(user);
			setLoading(false);
		});

		return unsubscribe;
	}, [auth]);

	const value = {
		currentUser,
		loading
	};

	return (
		<FbContext.Provider value={value}>
			{!loading && children}
		</FbContext.Provider>
	);
};