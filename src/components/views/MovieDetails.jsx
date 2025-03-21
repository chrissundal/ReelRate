import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const MovieDetails = () => {
	const { id } = useParams();
	const [movie, setMovie] = useState(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchMovieDetails = async () => {
			try {
				const response = await axios.get(`http://www.omdbapi.com/?i=${id}&plot=full&apikey=fa1b1ed1`);
				if (response.data.Response === "True") {
					setMovie(response.data);
				}
			} catch (error) {
				console.error("Feil ved henting av filmdetaljer:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchMovieDetails();
	}, [id]);

	if (loading) {
		return (
			<div className="container text-center my-5">
				<div className="spinner-border" role="status"></div>
			</div>
		);
	}

	if (!movie) {
		return (
			<div className="container my-5">
				<h2>Filmen ble ikke funnet</h2>
				<button
					className="btn btn-primary mt-3"
					onClick={() => navigate('/')}
				>
					Tilbake til søk
				</button>
			</div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="container my-4"
		>
			<button className="btn btn-outline-secondary mb-4" onClick={() => navigate('/search')}>
				&larr; Tilbake til søk
			</button>

			<div className="row">
				<div className="col-md-4 mb-4">
					{movie.Poster !== "N/A" ? (
						<img src={movie.Poster} className="img-fluid rounded" alt={movie.Title} />
					) : (
						<div className="no-image text-center p-5 bg-light rounded">Ingen bilde</div>
					)}
				</div>
				<div className="col-md-8">
					<h1>{movie.Title} <span className="text-muted">({movie.Year})</span></h1>
					<div className="mb-3">
						<span className="badge bg-secondary me-2">{movie.Rated}</span>
						<span className="me-2">•</span>
						<span className="me-2">{movie.Runtime}</span>
						<span className="me-2">•</span>
						<span className="me-2">{movie.Genre}</span>
						<span className="me-2">•</span>
						<span>{movie.Released}</span>
					</div>

					<div className="mb-3">
						<strong>IMDb-vurdering:</strong> {movie.imdbRating}/10
					</div>

					<div className="mb-3">
						<h5>Sammendrag</h5>
						<p>{movie.Plot}</p>
					</div>

					<div className="mb-3">
						<h5>Skuespillere</h5>
						<p>{movie.Actors}</p>
					</div>

					<div className="mb-3">
						<h5>Regissør</h5>
						<p>{movie.Director}</p>
					</div>

					<button className="btn btn-success">
						Legg til i favoritter
					</button>
				</div>
			</div>
		</motion.div>
	);
};