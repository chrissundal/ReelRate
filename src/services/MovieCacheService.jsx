export const movieCacheService = {
	cacheMovie(movie) {
		try {
			if (!movie || !movie.imdbID) return;
			const cachedMovies = JSON.parse(localStorage.getItem('cachedMovies')) || {};
			cachedMovies[movie.imdbID] = {
				data: movie,
				timestamp: Date.now()
			};
			localStorage.setItem('cachedMovies', JSON.stringify(cachedMovies));
		} catch (error) {
			console.error('Feil under caching av film:', error);
		}
	},
	
	getMovieFromCache(movieId) {
		try {
			const cachedMovies = JSON.parse(localStorage.getItem('cachedMovies')) || {};
			const cachedMovie = cachedMovies[movieId];
			const ONE_DAY = 24 * 60 * 60 * 1000;
			if (cachedMovie && (Date.now() - cachedMovie.timestamp) < ONE_DAY) {
				return cachedMovie.data;
			}
			return null;
		} catch (error) {
			console.error('Feil under henting av cachet film:', error);
			return null;
		}
	},
	
	cleanCache() {
		try {
			const cachedMovies = JSON.parse(localStorage.getItem('cachedMovies')) || {};
			const ONE_DAY = 24 * 60 * 60 * 1000;
			const now = Date.now();
			let isChanged = false;
			Object.keys(cachedMovies).forEach(movieId => {
				if (now - cachedMovies[movieId].timestamp > ONE_DAY) {
					delete cachedMovies[movieId];
					isChanged = true;
				}
			});

			if (isChanged) {
				localStorage.setItem('cachedMovies', JSON.stringify(cachedMovies));
			}
		} catch (error) {
			console.error('Feil under opprydding av cache:', error);
		}
	}
};