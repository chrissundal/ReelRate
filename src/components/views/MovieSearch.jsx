import {useEffect, useRef, useCallback} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useFetchRatings } from "../../services/FetchRatings";
import {useMovieSearch} from "../../services/UseMovieSearch";

export const MovieSearch = () => {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const movieIds = useFetchRatings();
	const initialQuery = searchParams.get('query') || '';
	const initialType = searchParams.get('type') || 'all';

	const {
		movies,
		searchTerm,
		setSearchTerm,
		loading,
		hasSearched,
		type,
		searchMovies,
		handleTypeChange
	} = useMovieSearch(initialQuery, initialType, setSearchParams, movieIds);

	const movieTypes = [
		{name: 'Alle', value: 'all'},
		{name: 'Film', value: 'movie'},
		{name: 'Serie', value: 'series'}
	];
	
	const searchMoviesRef = useRef(searchMovies);
	
	useEffect(() => {
		searchMoviesRef.current = searchMovies;
	}, [searchMovies]);
	
	useEffect(() => {
		document.title = 'Søk | ReelRate';
		return () => {
			document.title = 'ReelRate';
		};
	}, []);
	
	useEffect(() => {
		if (initialQuery) {
			const timer = setTimeout(() => {
				searchMoviesRef.current(initialType);
			}, 50);
			return () => clearTimeout(timer);
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps
	
	const handleSearchClick = useCallback(() => {
		if (searchTerm) {
			const newParams = new URLSearchParams();
			newParams.set('query', searchTerm);
			if (type && type !== 'none') {
				newParams.set('type', type);
			}
			setSearchParams(newParams);
			searchMoviesRef.current(type);
		}
	}, [searchTerm, type, setSearchParams]);
	
	const handleShowDetails = useCallback((movie) => {
		navigate(`/movie/${movie.imdbID}`);
	}, [navigate]);

	return (
		<div className="container my-4 ">
			<div className="row mb-4">
				<div className="col text-center">
					<div className="container d-flex justify-content-center p-1 rounded">
						{movieTypes.map((movieType) => (
							<div key={movieType.value} className="form-check type-select-btn p-2 ">
								<input type="radio" className="btn-check" name="type" id={movieType.value} value={movieType.value} checked={type === movieType.value} onChange={(e) => handleTypeChange(e.target.value)}/>
								<label className={`btn ${type === movieType.value ? 'btn-light disabled text-center text-light p-2' : 'btn-outline-light text-center p-2'}`} htmlFor={movieType.value} style={{fontWeight: 'bold', pointerEvents: type === movieType.value ? 'none' : 'auto', opacity: type === movieType.value ? 0.6 : 1}}>{movieType.name}</label>
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="row mb-4">
				<div className="col">
					<div className="input-group">
						<div className="form-floating text-secondary">
							<input type="text" className="form-control shadow-none border-0 bg-light text-secondary" id="searchField" placeholder="søk" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}/>
							<label htmlFor="searchField" className="text-secondary">Søk etter filmer...</label>
						</div>
						<button className="btn btn-light shadow-none border-0 text-secondary" style={{fontWeight: 'bold'}} onClick={handleSearchClick} disabled={loading}>{loading ? 'Søker...' : 'Søk'}</button>
					</div>
				</div>
			</div>

			{hasSearched && <div className="container rounded-3">
				<div className="row search-scrollContainer">
					{movies.map((movie) => (
						<div key={movie.imdbID} className="col-sm-4 mb-2 p-3">
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
									{movieIds && movie.avgRating ? (
										<span style={{ color: 'gold' }}>
											ReelRating: {movie.avgRating.toFixed(2)} <i className="fa-solid fa-star"></i>
										</span>
									) : (
										<span>Ikke vurdert enda</span>
									)}
								</div>
							</div>
						</div>
					))}

					{movies.length === 0 && !loading && searchTerm && hasSearched && (
						<div className="col-12 text-center p-2 mt-3 text-light">
							<p>Ingen resultater funnet med ditt søk.</p>
						</div>
					)}
					{loading && <div className="container text-center my-5">
						<div className="spinner-border" role="status"></div>
					</div>}
				</div>
			</div>
			}
		</div>
	);
};