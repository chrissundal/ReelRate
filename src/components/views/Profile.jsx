import {useEffect, useState} from "react";
import {useFirebase} from "../../config/FbContext";
import {doc, getDoc} from "firebase/firestore";
import {db} from "../../config/FbConfig";
import {FavoriteList} from "./FavoriteList";
import { motion } from 'framer-motion';
import {WatchList} from "./WatchList";
export const Profile = () => {
	const { currentUser } = useFirebase();
	const [user, setUser] = useState(null);
	const [favIsOpen, setFavIsOpen] = useState(true);
	const [watchedIsOpen, setWatchedIsOpen] = useState(true);
	
	useEffect(() => {
		const fetchUser = async () => {
			if (!currentUser) {
				setUser(null);
				return;
			}
			try {
				const userDocRef = doc(db, "users", currentUser.uid);
				const userDoc = await getDoc(userDocRef);
				if (userDoc.exists()) {
					setUser(userDoc.data());
				} else {
					setUser(null);}
			} catch (error) {
				console.error("Error fetching user: ", error);
				setUser(null);
			}
		}
		fetchUser();
	}, [currentUser]);
	
	return (
		<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="container my-4">
			<div className="container mt-2">
				{ favIsOpen && user && <div className="container card p-0"><FavoriteList user={user}/></div> }
				<div className="container my-2">
					{favIsOpen ? <button className="btn btn-outline-secondary" style={{fontWeight: 'bold'}} onClick={() => setFavIsOpen(false)}>Minimer Favoritter</button> : <button className="btn btn-outline-secondary" style={{fontWeight: 'bold'}} onClick={() => setFavIsOpen(true)}>Åpne Favoritter</button>}
				</div>
				{ watchedIsOpen && user && <div className="container card p-0"><WatchList user={user}/></div> }
				<div className="container my-2">
					{watchedIsOpen ? <button className="btn btn-outline-secondary" style={{fontWeight: 'bold'}} onClick={() => setWatchedIsOpen(false)}>Minimer Watchlist</button> : <button className="btn btn-outline-secondary" style={{fontWeight: 'bold'}} onClick={() => setWatchedIsOpen(true)}>Åpne Watchlist</button>}
				</div>
			</div>
		</motion.div>
	)
}