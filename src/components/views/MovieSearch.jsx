import {useEffect, useRef, useCallback} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useFetchRatings } from "../../services/FetchRatings";
import {useMovieSearch} from "../../services/UseMovieSearch";
import _ from 'lodash';

export const MovieSearch = () => {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const movieIds = useFetchRatings();
	const {
		movies,
		searchTerm,
		setSearchTerm,
		loading,
		hasSearched,
		type,
		searchMovies,
		resetSearch,
		handleTypeChange
	} = useMovieSearch(searchParams.get('query') || '', searchParams.get('type') || '', setSearchParams, movieIds);
	const movieTypes = [
		{name: 'Alle', value: 'all'},
		{name: 'Film', value: 'movie'},
		{name: 'Serie', value: 'series'}
	];
	const query = searchParams.get('query');
	const isInitialMount = useRef(true);
	const searchMoviesRef = useRef(searchMovies);

	useEffect(() => {
		searchMoviesRef.current = searchMovies;
	}, [searchMovies]);

	useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false;
			return;
		}
		if (query) {
			searchMoviesRef.current();
		}
	}, [query]);
	
	const debouncedFunc = useRef(
		_.debounce((term, selectedType, setParams) => {
			const newParams = new URLSearchParams();
			if (term) {
				newParams.set('query', term);
				if (selectedType && selectedType !== 'none') {
					newParams.set('type', selectedType);
				}
				setParams(newParams);
			}
		}, 300)
	);

	const debouncedUpdateSearchParams = useCallback(
		(term, selectedType) => {
			debouncedFunc.current(term, selectedType, setSearchParams);
		},
		[setSearchParams]
	);
	
	const handleSearchClick = useCallback(() => {
		debouncedUpdateSearchParams(searchTerm, type);
	}, [searchTerm, type, debouncedUpdateSearchParams]);

	const handleShowDetails = (movie) => {
		navigate(`/movie/${movie.imdbID}`);
	};
	
	return (
		<div className="container my-4 ">
			<div className="row mb-4">
				<div className="col text-center">
					<div className="container d-flex justify-content-center p-1 rounded">
						{movieTypes.map((movieType) => (
							<div key={movieType.value} className="form-check type-select-btn p-2 ">
								<input type="radio" className="btn-check" name="type" id={movieType.value} value={movieType.value} checked={type === movieType.value} onChange={(e) => handleTypeChange(e.target.value)}/>
								<label className={`btn ${type === movieType.value ? 'btn-secondary text-center p-2' : 'btn-outline-secondary text-center p-2'}`} htmlFor={movieType.value} style={{ fontWeight: 'bold'}}>{movieType.name}</label>
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="row mb-4">
				<div className="col">
					{!hasSearched && (
						<div className="input-group">
							<input type="text" className="form-control" placeholder="Søk etter filmer..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}/>
							<button className="btn btn-secondary" style={{fontWeight: 'bold'}} onClick={handleSearchClick} disabled={loading}>{loading ? 'Søker...' : 'Søk'}</button>
						</div>
					)}
					{hasSearched && !loading && (
						<div className="container d-flex justify-content-center">
							<button className="btn btn-secondary new-search-btn" onClick={resetSearch}>
								Nytt søk
							</button>
						</div>
					)}
				</div>
			</div>
			
			<div className="container rounded-3" style={{ backgroundColor: '#f8f9fa'}}>
				<div className="row p-2">
					{movies.map((movie) => (
						<div key={movie.imdbID} className="col-md-4 mb-4">
							<div className="card border-0 h-100 movie-details" onClick={() => handleShowDetails(movie)}>
								<div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
									{movie.Poster !== "N/A" ? (
										<img src={movie.Poster} className="card border-0" alt={movie.Title} />
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
						<div className="col-12 text-center">
							<p>Ingen filmer funnet med ditt søk.</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};