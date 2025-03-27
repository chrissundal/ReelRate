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
				<h2 className="text-center text-light">Du har ikke sett noen filmer enda</h2>
			</div>
		</div>
	)
	
	return (
		<div className="row p-1">
			{user && 
				<div>
					<h2 className="text-center mb-2 text-light">Sette filmer</h2>
					<div className="profile-scrollbar">
					<table className="table table-hover m-0 ">
						<thead className="thead-light text-center text-light">
						<tr>
							<th className="text-light bg-transparent" scope="col" style={{ width: "80px" }}></th>
							<th className="text-light bg-transparent" scope="col">Tittel</th>
							<th className="text-light bg-transparent" scope="col">Type</th>
						</tr>
						</thead>
						<tbody>
						{watchedMovies.map((movie, index) => (
							<tr key={index} className="align-middle text-center favorite-movie text-light" onClick={() => handleShowDetailsWatched(movie.id)}>
								<td className="bg-transparent">
									<img src={movie.poster} alt={movie.title} className="img-fluid rounded" style={{ maxWidth: "60px" }}/>
								</td>
								<td className="text-light bg-transparent">{movie.title}</td>
								<td className="text-capitalize text-light bg-transparent">{movie.type}</td>
							</tr>
						))}
						</tbody>
					</table>
					</div>
				</div>
			}
		</div>
	);
}