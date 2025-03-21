import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const MovieSearch = () => {
	const [movies, setMovies] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [loading, setLoading] = useState(false);
	const [hasSearched, setHasSearched] = useState(false);
	const [type, setType] = useState('');
	const navigate = useNavigate();
	const movieTypes = [
		{name: 'Alle', value: 'none'},
		{name: 'Film', value: 'movie'},
		{name: 'Serie', value: 'series'}
	];
	const searchMovies = async () => {
		if (!searchTerm) return;
		setLoading(true);
		setHasSearched(true);
		let selectedType = '';
		if(type !== 'none') {
			selectedType = `&type=${type}`;
		}
		try {
			const res = await axios.get(`http://www.omdbapi.com/?s=${searchTerm}${selectedType}&apikey=fa1b1ed1`);
			if (res.data.Response === "True") {
				setMovies(res.data.Search);
			} else {
				setMovies([]);
			}
		} catch (error) {
			setMovies([])
			console.error("Feil ved henting av filmer:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleShowDetails = (movie) => {
		navigate(`/movie/${movie.imdbID}`);
	};

	return (
		<div className="container my-4">
			<div className="row mb-4">
				<div className="col">
					<div className="d-flex flex-wrap justify-content-center">
						{movieTypes.map((movieType) => (
							<div key={movieType.value} className="form-check">
								<input
									type="radio"
									className="btn-check"
									name="type"
									id={movieType.value}
									value={movieType.value}
									onChange={(e) => setType(e.target.value)}
									autoComplete="off"
								/>
								<label
									className={`btn ${type === movieType.value ? 'btn-secondary' : 'btn-outline-secondary'}`}
									htmlFor={movieType.value}
								>
									{movieType.name}
								</label>
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="row mb-4">
				<div className="col">
					<div className="input-group">
						<input type="text" className="form-control" placeholder="Søk etter filmer..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && searchMovies()}/>
						<button className="btn btn-secondary" onClick={searchMovies} disabled={loading}>
							{loading ? 'Søker...' : 'Søk'}
						</button>
					</div>
				</div>
			</div>

			<div className="row">
				{movies.map((movie) => (
					<div key={movie.imdbID} className="col-md-4 mb-4">
						<div className="card h-100 position-relative">
							{movie.Poster !== "N/A" ? (
								<img src={movie.Poster} className="card-img-top" alt={movie.Title} />
							) : (
								<div className="no-image text-center p-5 bg-light">Ingen bilde</div>
							)}
							<div className="card-body d-flex flex-column">
								<h5 className="card-title">{movie.Title}</h5>
								<p className="card-text">{movie.Year}</p>
								<div className="mt-auto d-flex justify-content-center">
									<button className="btn btn-sm btn-info details-button text-light" onClick={() => handleShowDetails(movie)}>
										Vis detaljer
									</button>
								</div>
							</div>
						</div>

					</div>
				))}

				{movies.length === 0 && !loading && searchTerm && hasSearched &&
					(
					<div className="col-12 text-center">
						<p>Ingen filmer funnet</p>
					</div>
				)}
			</div>
		</div>
	);
}