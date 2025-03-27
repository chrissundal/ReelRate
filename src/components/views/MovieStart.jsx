import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import { movieCacheService } from "../../services/MovieCacheService";
import { useFetchRatings } from "../../services/FetchRatings";
import { useUser } from "../../services/FetchUser";

export const MovieStart = () => {
	const [movies, setMovies] = useState([]);
	const navigate = useNavigate();
	const movieIds = useFetchRatings();
	const { user, isLoading: userLoading } = useUser();
	const [isLoading, setIsLoading] = useState(false);

	const handleShowDetails = (movie) => {
		movieCacheService.cacheMovie(movie);
		navigate(`/movie/${movie.imdbID}`);
	};
	
	useEffect(() => {
		document.title = 'Hjem | ReelRate';
		return () => {
			document.title = 'ReelRate';
		};
	}, []);

	useEffect(() => {
		if (movieIds.length === 0) return;
		const fetchMovies = async () => {
			setIsLoading(true);
			try {
				let shuffledMovieIds = [];
				if (user && user.watched) {
					const watchedMovieIds = user.watched.map((movie) => movie.id);
					const filteredMovies = movieIds.filter((movie) => !watchedMovieIds.includes(movie.id))
					shuffledMovieIds = [...filteredMovies];
				} else {
					shuffledMovieIds = [...movieIds];
				}
				shuffledMovieIds.sort(() => 0.5 - Math.random());
				const selectedMovieIds = shuffledMovieIds.slice(0, 6);

				let foundMovies = [];
				for (let i = 0; i < selectedMovieIds.length; i++) {
					try {
						const cachedMovie = movieCacheService.getMovieFromCache(selectedMovieIds[i].id);

						if (cachedMovie) {
							const addMovie = {
								...cachedMovie,
								avgRating: selectedMovieIds[i].avgRating,
							};
							foundMovies.push(addMovie);
							console.log("Fra cache");
						} else {
							const response = await axios.get(`https://www.omdbapi.com/?i=${selectedMovieIds[i].id}&plot=short&apikey=${process.env.REACT_APP_OMDB_API_KEY}`);
							if (response.data.Response === "True") {
								const addMovie = {
									...response.data,
									avgRating: selectedMovieIds[i].avgRating,
								};
								movieCacheService.cacheMovie(response.data);
								foundMovies.push(addMovie);
								console.log("Fra api");
							}
						}
					} catch (apiError) {
						console.error(`Feil ved lasting av film ${selectedMovieIds[i].id}:`, apiError);
					}
				}
				foundMovies.sort((a, b) => b.avgRating - a.avgRating);
				setMovies(foundMovies);
			} catch (error) {
				console.error("Feil ved lasting av film:", error);
			} finally {
				setIsLoading(false);
			}
		};
		movieCacheService.cleanCache();
		fetchMovies();
	}, [movieIds, user]);

	const isPageLoading = userLoading || isLoading;

	return (
		<div className="container mt-2 mb-2">
			<div className="row p-3 home-scrollContainer">
				{isPageLoading
					? (
					<div className="d-flex justify-content-center">
						<div className="spinner-border" role="status">
							<span className="visually-hidden">Laster...</span>
						</div>
					</div>
				) : movies.length > 0 ? (
					movies.map((movie) => (
						<div key={movie.imdbID} className="col-sm-4 mb-4">
							<div className="card border-0 movie-details" onClick={() => handleShowDetails(movie)}>
								<div className="d-flex justify-content-center align-items-center" >
									{movie.Poster !== "N/A" ? (
										<img src={movie.Poster} className="card border-0" alt={movie.Title} style={{ width: '100%' }}/>
									) : (
										<div className="no-image text-center p-5 bg-light">Ingen bilde</div>
									)}
								</div>

								<div className="hover-info">
									<h5>{movie.Title}</h5>
									<p>{movie.Year}</p>
									<p className="text-capitalize">{movie.Type}</p>
									<span style={{ color: 'gold' }}>ReelRating: {movie.avgRating.toFixed(2)} <i className="fa-solid fa-star"></i></span>
								</div>
							</div>
						</div>
					))
				) : (
					<div className="text-center">Ingen filmer funnet</div>
				)}
			</div>
		</div>
	);
};
