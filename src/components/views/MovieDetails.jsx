import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {getDoc, doc} from "firebase/firestore";
import {db} from "../../config/FbConfig";
import {useFirebase} from "../../config/FbContext";
import {updateRating} from "../../services/RatingService";
import {removeWatched, updateWatched} from "../../services/WatchedService";
import {addFavorite, removeFavorite} from "../../services/FavoriteService";

export const MovieDetails = () => {
	const { id } = useParams();
	const { currentUser } = useFirebase();
	const navigate = useNavigate();
	const [movie, setMovie] = useState(null);
	const [loading, setLoading] = useState(true);
	const [message, setMessage] = useState(null);
	const [user, setUser] = useState(null);
	const [favorite, setFavorite] = useState(false);
	const [watched, setWatched] = useState(false);
	const [rated, setRated] = useState(false);
	const [openRating, setOpenRating] = useState(false);
	const [rating, setRating] = useState(0);
	const diceIcons = ["fa-solid fa-dice-one", "fa-solid fa-dice-two", "fa-solid fa-dice-three", "fa-solid fa-dice-four", "fa-solid fa-dice-five", "fa-solid fa-dice-six"]
	
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
		const fetchRatings = async () => {
			const fetchedRatings = await getDoc(doc(db, "ratings", id));
			const ratings = fetchedRatings.data();
			if(!ratings) return;
			if(currentUser) {
				const userRating = ratings.rating.find(rating => rating.userId === currentUser.uid);
				if(userRating) {
					setRated(true)
					setRating(userRating.userRating)
				}
			}
		}
		fetchUser();
		fetchMovieDetails();
		fetchRatings();
	}, [id, currentUser, rated]);
	

	const handleRating = async (userRating) => {
		let success = await updateRating(userRating, id, currentUser, user, movie);
		if(success) {
			setRating(userRating)
			await handleWatched();
			setRated(true)
			setMessage('')
		} else {
			setMessage("Feil ved vurdering")
		}
			setOpenRating(false)
	};
	const handleWatched = async () => {
		let success = await updateWatched(id,currentUser)
		if(success) {
			setWatched(true)
			setMessage('')
		} else {
			setMessage("Feil ved sett film")
		}
	}
	const handleUnwatched = async () => {
		let success = await removeWatched(id,currentUser)
		if(success) {
			setWatched(false)
			setMessage('')
		} else {
			setMessage("Feil ved fjerne sett film")
		}
	}
	const handleFavorite = async () => {
		let success = await addFavorite(id,currentUser, setFavorite)
		if(success) {
			setFavorite(true)
			setMessage('')
		} else {
			setMessage("Feil ved favoritt")
		}
	}
	const handleRemoveFavorite = async () => {
		let success = await removeFavorite(id,currentUser)
		if(success) {
			setFavorite(false)
			setMessage('')
		} else {
			setMessage("Feil ved fjerning av favoritt")
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
			<div className="container d-flex gap-5 mb-3">
			<button className="btn btn-outline-secondary" onClick={() => navigate(-1)}><i className="fa-solid fa-arrow-left"></i> Tilbake</button>
			{rated && <i style={{fontSize: '40px', color: 'goldenrod'}} className={diceIcons[rating-1]}></i>}
			</div>
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
					<div className="container d-flex flex-column gap-2 justify-content-center mb-2">
						<div className="container gap-2 d-flex justify-content-center">
							{!user && <button className="btn btn-success" onClick={() => navigate('/signin')}>Logg inn for å vurdere film</button>}
							{user && (favorite ? <button className="btn btn-danger" onClick={() => handleRemoveFavorite()} title="Fjern fra favoritter"><i className="fa-solid fa-heart"></i></button> : <button className="btn btn-primary" onClick={() => handleFavorite()} title="Legg til Favoritter"><i className="fa-regular fa-heart"></i></button>)}
							{user && (rated ? <button className="btn btn-secondary" disabled title="Allerede vurdert">Allerede vurdert</button> : <button className="btn btn-primary" onClick={() => setOpenRating(!openRating)} title="Sett rating">Legg til vurdering</button>)}
							{user && (watched ? <button className="btn btn-danger" onClick={() => handleUnwatched()} title="Fjern fra sette filmer"><i className="fa-regular fa-eye"></i></button> : <button className="btn btn-primary" onClick={() => handleWatched()} title="Legg til i sette filmer"><i className="fa-regular fa-eye-slash"></i></button>)}
						</div>
						{openRating && <div className="container gap-1 d-flex rating-dice justify-content-center">
							{diceIcons.map((icon, index) => <i key={index} className={icon} onClick={() => handleRating(index+1)}></i>)}
						</div>}
						{message && <div className="alert alert-danger text-center">{message}</div>}
					</div>
				</div>
			</div>
		</motion.div>
	);
};