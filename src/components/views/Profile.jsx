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
	const [watchedIsOpen, setWatchedIsOpen] = useState(false);
	
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
				<div className="container d-flex gap-1 justify-content-center">
					<button className="btn btn-outline-secondary" style={{fontWeight: 'bold'}} onClick={() => setFavIsOpen(!favIsOpen)}>Favoritter</button>
					<button className="btn btn-outline-secondary" style={{fontWeight: 'bold'}} onClick={() => setWatchedIsOpen(!watchedIsOpen)}>Sette filmer</button>
				</div>
				{ favIsOpen && user && <div className="container card mt-3 p-0"><FavoriteList user={user}/></div> }
				{ watchedIsOpen && user && <div className="container card mt-3 p-0"><WatchList user={user}/></div> }
			</div>
		</motion.div>
	)
}