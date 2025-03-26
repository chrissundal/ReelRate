import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

export const WatchList = ({user}) => {
	const [watchedMovies, setWatchedMovies] = useState([]);
	const navigate = useNavigate();
	useEffect(() => {
		if (!user) return;
		let sortedMovies = []
		if(user.watched) {
			sortedMovies = user.watched.sort((a, b) => b.date.toDate() - a.date.toDate());
		}
		setWatchedMovies(sortedMovies)
	}, [user]);

	const handleShowDetailsWatched = (id) => {
		navigate(`/movie/${id}`);
	};

	if(watchedMovies.length === 0) return (
		<div className="row p-1">
			<div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
				<h2 className="text-center">Du har ikke sett noen filmer enda</h2>
			</div>
		</div>
	)
	
	return (
		<div className="row p-1">
			{user && 
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
							<tr key={index} className="align-middle text-center favorite-movie" onClick={() => handleShowDetailsWatched(movie.id)}>
								<td>
									<img src={movie.poster} alt={movie.title} className="img-fluid rounded" style={{ maxWidth: "60px" }}/>
								</td>
								<td>{movie.title}</td>
								<td className="text-capitalize">{movie.type}</td>
							</tr>
						))}
						</tbody>
					</table>
				</div>
			}
		</div>
	);
}