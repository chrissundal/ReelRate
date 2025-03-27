import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {getDoc, doc} from "firebase/firestore";
import {db} from "../../config/FbConfig";
import {useFirebase} from "../../config/FbContext";
import {updateRating} from "../../services/RatingService";
import {watchedService} from "../../services/WatchedService";
import {favoriteService} from "../../services/FavoriteService";
import { movieCacheService } from "../../services/MovieCacheService";
import { useUser } from "../../services/FetchUser";

export const MovieDetails = () => {
	const { id } = useParams();
	const { currentUser } = useFirebase();
	const navigate = useNavigate();
	const [movie, setMovie] = useState(null);
	const [loading, setLoading] = useState(true);
	const [message, setMessage] = useState(null);
	const [avgRating, setAvgRating] = useState(0);
	const [favorite, setFavorite] = useState(false);
	const [watched, setWatched] = useState(false);
	const [rated, setRated] = useState(false);
	const [openRating, setOpenRating] = useState(false);
	const [rating, setRating] = useState(0);
	const diceIcons = ["fa-solid fa-dice-one", "fa-solid fa-dice-two", "fa-solid fa-dice-three", "fa-solid fa-dice-four", "fa-solid fa-dice-five", "fa-solid fa-dice-six"]
	const { user, isLoading: userLoading } = useUser();

	useEffect(() => {
		document.title = 'Filmdetaljer | ReelRate';
		return () => {
			document.title = 'ReelRate';
		};
	}, []);
	
	useEffect(() => {
		const fetchMovieDetails = async () => {
			try {
				const cachedMovie = movieCacheService.getMovieFromCache(id);
				if (cachedMovie) {
					setMovie(cachedMovie);
					setLoading(false);
					return;
				}
				const response = await axios.get(`https://www.omdbapi.com/?i=${id}&plot=full&apikey=${process.env.REACT_APP_OMDB_API_KEY}`);
				if (response.data.Response === "True") {
					setMovie(response.data);
					movieCacheService.cacheMovie(response.data);
				}
			} catch (error) {
				console.error("Feil ved henting av filmdetaljer:", error);
			} finally {
				setLoading(false);
			}
		};
		
		const fetchRatings = async () => {
			const fetchedRatings = await getDoc(doc(db, "ratings", id));
			const ratings = fetchedRatings.data();
			if(!ratings) return;
			setAvgRating(ratings.avgRating);
			if(currentUser) {
				const userRating = ratings.rating.find(rating => rating.userId === currentUser.uid);
				if(userRating) {
					setRated(true)
					setRating(userRating.userRating)
				}
			}
		}
		movieCacheService.cleanCache();
		fetchMovieDetails();
		fetchRatings();
	}, [id, currentUser, rated]);

	useEffect(() => {
		if (user) {
			if (user.favorites && user.favorites.some(favorite => favorite.id === id)) {
				setFavorite(true);
			} else {
				setFavorite(false);
			}

			if (user.watched && user.watched.some(watch => watch.id === id)) {
				setWatched(true);
			} else {
				setWatched(false);
			}
		}
	}, [user, id]);

	const handleRating = async (userRating) => {
		let success = await updateRating(userRating, id, currentUser, user, movie);
		if(success) {
			setRating(userRating)
			await handleWatched(false);
			setRated(true)
			setMessage('')
		} else {
			setMessage("Feil ved vurdering")
		}
			setOpenRating(false)
	};
	const handleWatched = async (deleteWatched) => {
		let success = await watchedService(id,currentUser,movie, deleteWatched)
		if(success === "added") {
			setWatched(true)
			setMessage('')
		} else if (success === "removed") {
			setWatched(false)
			setMessage('')
		} else {
			setMessage("Feil ved sett film")
		}
	}
	
	const handleFavorite = async (deleteFavorite) => {
		let success = await favoriteService(id,currentUser,movie,deleteFavorite)
		if(success === "added") {
			setFavorite(true)
			setMessage('')
		} else if (success === "removed") {
			setFavorite(false)
			setMessage('')
		} else {
			setMessage("Feil ved favoritt")
		}
	}
	const isPageLoading = loading || userLoading;

	if (isPageLoading) {
		return (
			<div className="container text-center my-5">
				<div className="spinner-border" role="status"></div>
			</div>
		);
	}
	if (!movie) {
		return (
			<div className="container my-5 text-light">
				<h2>Filmen ble ikke funnet</h2>
				<button className="btn btn-primary mt-3" onClick={() => navigate('/')}>Tilbake til søk</button>
			</div>
		);
	}
	return (
		<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="container my-4">
			<div className="container d-flex gap-5 mb-3">
			<button className="btn btn-outline-light" onClick={() => navigate(-1)}><i className="fa-solid fa-arrow-left"></i> Tilbake</button>
			{rated && <i style={{fontSize: '40px', color: 'goldenrod'}} className={diceIcons[rating-1]}></i>}
			</div>
			<div className="row details-scrollContainer">
				<div className="col-md-4 mb-4">
					{movie.Poster !== "N/A" ? (
						<img src={movie.Poster} className="img-fluid rounded" alt={movie.Title} />
					) : (
						<div className="no-image text-center p-5 bg-light rounded">Ingen bilde</div>
					)}
				</div>
				<div className="col-md-8">
					<h1 className="text-light">{movie.Title} <span className="text-light">({movie.Year})</span></h1>
					<div className="mb-3 text-light">
						<span className="badge bg-secondary me-2">{movie.Rated}</span>
						<span className="me-2">•</span>
						<span className="me-2">{movie.Runtime}</span>
						<span className="me-2">•</span>
						<span className="me-2">{movie.Genre}</span>
						<span className="me-2">•</span>
						<span>{movie.Released}</span>
					</div>

					<div className="mb-2 text-light">
						<strong>IMDb-vurdering:</strong> {movie.imdbRating}/10
					</div>
					<div className="mb-2 text-light">
						{avgRating ? <div><strong>ReelRating:</strong> {avgRating}/6</div> : <div><strong>ReelRating:</strong> Ikke vurdert enda</div>}
					</div>
					<div className="mb-3 text-light">
						<h5>Sammendrag</h5>
						<p>{movie.Plot}</p>
					</div>

					<div className="mb-3 text-light">
						<h5>Skuespillere</h5>
						<p>{movie.Actors}</p>
					</div>

					<div className="mb-3 text-light">
						<h5>Regissør</h5>
						<p>{movie.Director}</p>
					</div>
					<div className="container d-flex flex-column gap-2 justify-content-center mb-2">
						<div className="container gap-2 d-flex justify-content-center">
							{!user && <button className="btn btn-success" onClick={() => navigate('/signin')}>Logg inn for å vurdere film</button>}
							{user && (favorite ? <button className="btn btn-danger" onClick={() => handleFavorite(true)} title="Fjern fra favoritter"><i style={{fontSize: '30px'}} className="fa-solid fa-heart-circle-minus"></i></button> : <button className="btn btn-light" onClick={() => handleFavorite(false)} title="Legg til Favoritter"><i style={{fontSize: '30px'}} className="fa-solid fa-heart-circle-plus text-secondary"></i></button>)}
							{user && (rated ? <button className="btn btn-secondary" disabled style={{fontSize: '18px', fontWeight: 'bold'}} title="Allerede vurdert">Allerede vurdert</button> : <button className="btn btn-light text-secondary" onClick={() => setOpenRating(!openRating)} style={{fontSize: '18px', fontWeight: 'bold'}} title="Sett rating">Legg til vurdering</button>)}
							{user && (watched ? <button className="btn btn-danger" onClick={() => handleWatched(true)} title="Fjern fra sette filmer"><i style={{fontSize: '30px'}} className="fa-regular fa-eye-slash"></i></button> : <button className="btn btn-light" onClick={() => handleWatched(false)} title="Legg til i sette filmer"><i style={{fontSize: '30px'}} className="fa-regular fa-eye text-secondary"></i></button>)}
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