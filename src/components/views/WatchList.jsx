import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

export const WatchList = ({user}) => {
	const [watchedMovies, setWatchedMovies] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	useEffect(() => {
		if (!user) return;
		const fetchMovieDetails = async () => {
			setLoading(true);
			try {
				let foundMovies = []
				for (let i = 0; i < user.watched.length; i++) {
					try {
						const response = await axios.get(`http://www.omdbapi.com/?i=${user.watched[i]}&plot=full&apikey=${process.env.REACT_APP_OMDB_API_KEY}`);
						if (response.data.Response === "True") {
							foundMovies.push(response.data);
						}
					} catch (error) {
						console.error("Feil ved henting av filmdetaljer:", error);
					}
				}
				setWatchedMovies(foundMovies)
			} catch (error) {
				console.error("Feil ved henting av filmdetaljer:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchMovieDetails();
	}, [user]);

	const handleShowDetailsWatched = (movie) => {
		navigate(`/movie/${movie.imdbID}`);
	};

	if(watchedMovies.length === 0 && !loading) return (
		<div className="row p-1">
			<div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
				<h2 className="text-center">Du har ikke sett noen filmer enda</h2>
			</div>
		</div>
	)
	
	return (
		<div className="row p-1">
			{loading ? (
				<div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
					<div className="spinner-border text-primary" role="status">
						<span className="visually-hidden">Laster...</span>
					</div>
				</div>
			) : (
				<div>
					<h2 className="text-center mb-2">Sette filmer</h2>
					<table className="table table-hover m-0">
						<thead className="thead-dark text-center">
						<tr>
							<th scope="col" style={{ width: "80px" }}></th>
							<th scope="col">Tittel</th>
							<th scope="col">Type</th>
						</tr>
						</thead>
						<tbody>
						{watchedMovies.map((movie, index) => (
							<tr key={index} className="align-middle text-center favorite-movie" onClick={() => handleShowDetailsWatched(movie)}>
								<td>
									<img src={movie.Poster} alt={movie.Title} className="img-fluid rounded" style={{ maxWidth: "60px" }}/>
								</td>
								<td>{movie.Title}</td>
								<td className="text-capitalize">{movie.Type}</td>
							</tr>
						))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}