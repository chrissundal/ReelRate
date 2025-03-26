import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

export const FavoriteList = ({user}) => {
	const [favoriteMovies, setFavoriteMovies] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		if (!user) return;
		setFavoriteMovies(user.favorites)
	}, [user]);
	const handleShowDetailsFavorite = (id) => {
		navigate(`/movie/${id}`);
	};
	if(favoriteMovies.length === 0) return (
		<div className="row p-1">
			<div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
				<h2 className="text-center">Du har ingen favoritter enda</h2>
			</div>
		</div>
	)
	return (
		<div className="row p-1">
			{user &&
				<div>
					<h2 className="text-center mb-2">Favoritter</h2>
					<table className="table table-hover m-0">
						<thead className="thead-dark text-center">
						<tr>
							<th scope="col" style={{ width: "80px" }}></th>
							<th scope="col">Tittel</th>
							<th scope="col">Type</th>
						</tr>
						</thead>
						<tbody>
						{favoriteMovies.map((movie, index) => (
							<tr key={index} className="align-middle text-center favorite-movie" onClick={() => handleShowDetailsFavorite(movie.id)}>
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