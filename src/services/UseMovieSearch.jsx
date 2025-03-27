import {useState, useCallback} from 'react';
import axios from 'axios';

export const useMovieSearch = (initialSearchTerm = '', initialType = 'all', setSearchParams, movieIds) => {
	const [movies, setMovies] = useState([]);
	const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
	const [loading, setLoading] = useState(false);
	const [hasSearched, setHasSearched] = useState(!!initialSearchTerm);
	const [type, setType] = useState(initialType);

	const searchMovies = useCallback(async (typeToUse = type) => {
		if (!searchTerm) return;
		const actualType = typeToUse || 'all';
		setLoading(true);
		setHasSearched(true);
		setType(actualType);
		setSearchParams({
			query: searchTerm,
			type: actualType,
		});

		let selectedType = (actualType !== 'all') ? `&type=${actualType}` : '';

		try {
			const res = await axios.get(
				`https://www.omdbapi.com/?s=${searchTerm}${selectedType}&apikey=${process.env.REACT_APP_OMDB_API_KEY}`
			);

			if (res.data.Response === "True") {
				const movieIdMap = new Map(movieIds.map((movie) => [movie.id, movie.avgRating]));
				const searchResult = res.data.Search.map((movie) => {
					return {
						...movie,
						avgRating: movieIdMap.get(movie.imdbID) || null,
					};
				});
				setMovies(searchResult);
			} else {
				setMovies([]);
			}
		} catch (error) {
			setMovies([]);
			console.error("Error fetching movies:", error);
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
		searchMovies,
		handleTypeChange
	};
};