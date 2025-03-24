import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {getDoc, doc, updateDoc, arrayUnion, setDoc} from "firebase/firestore";
import {db} from "../../config/FbConfig";
import {useFirebase} from "../../config/FbContext";

export const MovieDetails = () => {
	const { id } = useParams();
	const [movie, setMovie] = useState(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const { currentUser } = useFirebase();
	const [user, setUser] = useState(null);
	const [favorite, setFavorite] = useState(false);
	const [watched, setWatched] = useState(false);

	useEffect(() => {
		
		const fetchMovieDetails = async () => {
			try {
				const response = await axios.get(`http://www.omdbapi.com/?i=${id}&plot=full&apikey=${process.env.REACT_APP_OMDB_API_KEY}`);
				if (response.data.Response === "True") {
					setMovie(response.data);
				}
			} catch (error) {
				console.error("Feil ved henting av filmdetaljer:", error);
			} finally {
				setLoading(false);
			}
		};
		const fetchUser = async () => {
			try {
				if (currentUser) {
					const userDocRef = doc(db, "users", currentUser.uid);
					const userDoc = await getDoc(userDocRef);
					if (userDoc.exists()) {
						setUser(userDoc.data());
						if (userDoc.data().favorites.some(favorite => favorite === id)) {
							setFavorite(true);
						}
						if (userDoc.data().watched.some(watched => watched === id)) {
							setWatched(true);
						}
					} else {
						setUser(null);}
				}
			} catch (error) {
				console.error("Error fetching user: ", error);
				setUser(null);
			}
		}
		fetchUser();
		fetchMovieDetails();
	}, [id, currentUser]);
	
	const addFavorite = async () => {
		try {
			const userDocRef = doc(db, "users", currentUser.uid);
			await updateDoc(userDocRef, {
				favorites: arrayUnion(id),
			});
			console.log("Favoritt lagt til!");
			setFavorite(true);
		} catch (error) {
			console.error("Feil ved å legge til favoritt: ", error);
		}
	};
	const updateRating = async (userRating) => {
		try {
			const userRating = 6;
			if (!currentUser || !currentUser.uid) {
				console.error("Ingen bruker er logget inn");
				return;
			}
			const ratingDocRef = doc(db, "ratings", id);
			const docSnap = await getDoc(ratingDocRef);
			let userName = user.firstName[0] + user.lastName[0]
			let ratingEntry = {
				userRating,
				userId: currentUser.uid,
				userName,
				createdAt: new Date()
			};
			console.log(ratingEntry);
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
		} catch (error) {
			console.error("Feil ved tillegging av vurdering: ", error);
		}
	};
	
	const updateWatched = async () => {
		try {
			const userDocRef = doc(db, "users", currentUser.uid);
			await updateDoc(userDocRef, {
				watched: arrayUnion(id),
			});
			console.log("Lagt til i sett liste");
			setWatched(true);
		} catch (error) {
			console.error("Feil ved å legge til watched: ", error);
		}
	}
	if (loading) {
		return (
			<div className="container text-center my-5">
				<div className="spinner-border" role="status"></div>
			</div>
		);
	}

	if (!movie) {
		return (
			<div className="container my-5">
				<h2>Filmen ble ikke funnet</h2>
				<button className="btn btn-primary mt-3" onClick={() => navigate('/')}>Tilbake til søk</button>
			</div>
		);
	}

	return (
		<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="container my-4">
			<button className="btn btn-outline-secondary mb-4" onClick={() => navigate(-1)}><i className="fa-solid fa-arrow-left"></i> Tilbake</button>
			<div className="row">
				<div className="col-md-4 mb-4">
					{movie.Poster !== "N/A" ? (
						<img src={movie.Poster} className="img-fluid rounded" alt={movie.Title} />
					) : (
						<div className="no-image text-center p-5 bg-light rounded">Ingen bilde</div>
					)}
				</div>
				<div className="col-md-8">
					<h1>{movie.Title} <span className="text-muted">({movie.Year})</span></h1>
					<div className="mb-3">
						<span className="badge bg-secondary me-2">{movie.Rated}</span>
						<span className="me-2">•</span>
						<span className="me-2">{movie.Runtime}</span>
						<span className="me-2">•</span>
						<span className="me-2">{movie.Genre}</span>
						<span className="me-2">•</span>
						<span>{movie.Released}</span>
					</div>

					<div className="mb-3">
						<strong>IMDb-vurdering:</strong> {movie.imdbRating}/10
					</div>

					<div className="mb-3">
						<h5>Sammendrag</h5>
						<p>{movie.Plot}</p>
					</div>

					<div className="mb-3">
						<h5>Skuespillere</h5>
						<p>{movie.Actors}</p>
					</div>

					<div className="mb-3">
						<h5>Regissør</h5>
						<p>{movie.Director}</p>
					</div>
					{!user
						? <button className="btn btn-success" onClick={() => navigate('/signin')}>Logg inn for å sette favoritt</button>
						: (
							favorite
								? <button className="btn btn-secondary" disabled>Allerede favoritt</button>
								: <button className="btn btn-success" onClick={() => addFavorite()}>Legg til i favoritter</button>
						)
					}
					{user ? <button className="btn btn-primary" onClick={() => updateRating()}>Legg til vurdering</button> : ''}
					
					{!user
						? <button className="btn btn-success" onClick={() => navigate('/signin')}>Logg inn for å sette watchlist</button>
						: (
							watched
								? <button className="btn btn-secondary" disabled>Allerede sett</button>
								: <button className="btn btn-success" onClick={() => updateWatched()}>Legg til i sette filmer</button>
						)
					}
				</div>
			</div>
		</motion.div>
	);
};