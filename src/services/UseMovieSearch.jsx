import {useState, useCallback, useEffect} from 'react';
import axios from 'axios';

export const useMovieSearch = (initialSearchTerm = '', initialType = 'all', setSearchParams, movieIds) => {
	const [movies, setMovies] = useState([]);
	const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
	const [loading, setLoading] = useState(false);
	const [hasSearched, setHasSearched] = useState(!!initialSearchTerm);
	const [type, setType] = useState(initialType);
	const [error, setError] = useState(null);
	
	useEffect(() => {
		if (initialSearchTerm) {
			searchMovies(initialType);
		}
	}, [initialSearchTerm, initialType]); // eslint-disable-line react-hooks/exhaustive-deps

	const searchMovies = useCallback(async (typeToUse = type) => {
		if (!searchTerm) return;
		const actualType = typeToUse || 'all';
		setLoading(true);
		setHasSearched(true);
		setError(null);
		setType(actualType);
		setSearchParams({
			query: searchTerm,
			type: actualType,
		});

		let selectedType = (actualType !== 'all') ? `&type=${actualType}` : '';

		try {
			const apiKey = process.env.REACT_APP_OMDB_API_KEY;
			if (!apiKey) {
				setError("API-nøkkel mangler i miljøvariablene");
				setLoading(false);
				return;
			}

			const res = await axios.get(
				`https://www.omdbapi.com/?s=${encodeURIComponent(searchTerm)}${selectedType}&apikey=${apiKey}`
			);

			if (res.data.Response === "True" && Array.isArray(res.data.Search)) {
				const movieIdMap = new Map(
					Array.isArray(movieIds) ? movieIds.map((movie) => [movie.id, movie.avgRating]) : []
				);
				const searchResult = res.data.Search.map((movie) => {
					return {
						...movie,
						avgRating: movieIdMap.get(movie.imdbID) || null,
					};
				});
				setMovies(searchResult);
			} else {
				setMovies([]);
				if (res.data.Error) {
					setError(`Søket ga ingen resultater: ${res.data.Error}`);
				}
			}
		} catch (error) {
			setMovies([]);
			console.error("Error fetching movies:", error);
			setError("Kunne ikke hente søkeresultater. Vennligst prøv igjen senere.");
		} finally {
			setLoading(false);
		}
	}, [searchTerm, type, setSearchParams, movieIds]);

	const handleTypeChange = useCallback((value) => {
		setType(value);
		if (searchTerm) {
			searchMovies(value);
		}
	}, [searchTerm, searchMovies]);

	return {
		movies,
		setMovies,
		searchTerm,
		setSearchTerm,
		loading,
		hasSearched,
		type,
		error,
		searchMovies,
		handleTypeChange
	};
};