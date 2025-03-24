import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {getDocs, collection, doc, getDoc} from "firebase/firestore";
import {db} from "../../config/FbConfig";
import {useFirebase} from "../../config/FbContext";

export const MovieStart = () => {
	const [movies, setMovies] = useState([]);
	const navigate = useNavigate();
	const [movieIds, setMovieIds] = useState([]);
	const [user, setUser] = useState(null);
	const { currentUser } = useFirebase();
	const [isLoading, setIsLoading] = useState(false);

	const handleShowDetails = (movie) => {
		navigate(`/movie/${movie.imdbID}`);
	};
	
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
					setUser(null);
				}
			} catch (error) {
				console.error("Error fetching user:", error);
				setUser(null);
			}
		};
		fetchUser();
	}, [currentUser]);
	
	useEffect(() => {
		if (currentUser && user === null) return;
		const fetchRatings = async () => {
			setIsLoading(true);
			try {
				const ratingsCollection = collection(db, "ratings");
				const ratingsSnapshot = await getDocs(ratingsCollection);
				const ratingsData = ratingsSnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setMovieIds(ratingsData);
			} catch (error) {
				console.error("Error fetching ratings:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchRatings();
	}, [currentUser, user]);
	
	useEffect(() => {
		if (movieIds.length === 0) return;
		const fetchMovies = async () => {
			setIsLoading(true);
			try {
				let shuffledMovieIds = [];
				if (user && user.watched) {
					const watchedMovies = user.watched;
					const filteredMovies = movieIds.filter((movie) => !watchedMovies.includes(movie.id));
					shuffledMovieIds = [...filteredMovies];
				} else {
					shuffledMovieIds = [...movieIds];
				}
				shuffledMovieIds.sort(() => 0.5 - Math.random());
				const selectedMovieIds = shuffledMovieIds.slice(0, 6);
				
				let foundMovies = [];
				for (let i = 0; i < selectedMovieIds.length; i++) {
					try {
						const response = await axios.get(`https://www.omdbapi.com/?i=${selectedMovieIds[i].id}&plot=short&apikey=${process.env.REACT_APP_OMDB_API_KEY}`);
						if (response.data.Response === "True") {
							const addMovie = {
								...response.data,
								avgRating: selectedMovieIds[i].avgRating,
							};
							foundMovies.push(addMovie);
						}
					} catch (apiError) {
						console.error(`Error fetching movie ${selectedMovieIds[i].id}:`, apiError);
					}
				}
				foundMovies.sort((a, b) => b.avgRating - a.avgRating);
				setMovies(foundMovies);
			} catch (error) {
				console.error("Error fetching movie details:", error);
			} finally {
				setIsLoading(false);
			}
		};
		
		fetchMovies();
	}, [movieIds, user]);

	return (
		<div className="row p-3">
			{isLoading ? (
				<div className="d-flex justify-content-center">
					<div className="spinner-border" role="status">
						<span className="visually-hidden">Laster...</span>
					</div>
				</div>
			) : movies.length > 0 ? (
				movies.map((movie) => (
					<div key={movie.imdbID} className="col-md-4 mb-4" >
						<div className="card h-100 position-relative movie-details" onClick={() => handleShowDetails(movie)}>
							{movie.Poster !== "N/A" ? (
								<img src={movie.Poster} className="card-img-top" alt={movie.Title} />
							) : (
								<div className="no-image text-center p-5 bg-light">Ingen bilde</div>
							)}
							<div className="card-body d-flex flex-column">
								<h5 className="card-title">{movie.Title}</h5>
								<p className="card-text">{movie.Year}</p>
								<div className="mt-auto d-flex justify-content-center gap-5">
									<div className="container d-flex justify-content-center">
										<span>ReelScore: <span style={{color: 'gold'}}>{movie.avgRating.toFixed(2)}/6 <i className="fa-solid fa-star"></i></span></span>
									</div>
								</div>
							</div>
						</div>
					</div>
				))
			) : (
				<div className="text-center">Ingen filmer funnet</div>
			)}
		</div>
	);
};