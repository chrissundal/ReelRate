import {useEffect, useState} from "react";
import {FavoriteList} from "./FavoriteList";
import { motion } from 'framer-motion';
import {WatchList} from "./WatchList";
import { useUser } from "../../services/FetchUser";

export const Profile = () => {
	const { user, isLoading: userLoading } = useUser();
	const [favIsOpen, setFavIsOpen] = useState(true);
	const [watchedIsOpen, setWatchedIsOpen] = useState(true);

	useEffect(() => {
		document.title = 'Profil | ReelRate';
		return () => {
			document.title = 'ReelRate';
		};
	}, []);
	
	if(userLoading) return (
		<div className="container text-center my-5">
			<div className="spinner-border" role="status"></div>
		</div>
	)
	
	return (
		<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="container my-4">
			<div className="profile-user-name text-secondary">
				{user && <h3>{user.firstName} {user.lastName}</h3>}
			</div>
			<div className="container align-middle">
				{ favIsOpen && user && <div className="container p-0 border-0" style={{maxWidth: '800px'}}><FavoriteList user={user}/></div> }
				<div className="container my-2 d-flex justify-content-center">
					{favIsOpen ? <button className="btn btn-outline-light" style={{fontWeight: 'bold',maxWidth: '800px'}} onClick={() => setFavIsOpen(false)}>Minimer Favoritter</button> : <button className="btn btn-outline-secondary" style={{fontWeight: 'bold'}} onClick={() => setFavIsOpen(true)}>Åpne Favoritter</button>}
				</div>
				{ watchedIsOpen && user && <div className="container p-0 border-0" style={{maxWidth: '800px'}}><WatchList user={user}/></div> }
				<div className="container my-2 d-flex justify-content-center">
					{watchedIsOpen ? <button className="btn btn-outline-light" style={{fontWeight: 'bold',maxWidth: '800px'}} onClick={() => setWatchedIsOpen(false)}>Minimer Watchlist</button> : <button className="btn btn-outline-secondary" style={{fontWeight: 'bold'}} onClick={() => setWatchedIsOpen(true)}>Åpne Watchlist</button>}
				</div>
			</div>
		</motion.div>
	)
}