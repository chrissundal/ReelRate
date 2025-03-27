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
				<h2 className="text-center text-light">Du har ingen favoritter enda</h2>
			</div>
		</div>
	)
	return (
		<div className="row p-1">
			{user &&
				<div>
					<h2 className="text-center mb-2 text-light">Favoritter</h2>
					<table className="table table-hover m-0">
						<thead className="thead-light text-center text-light">
						<tr>
							<th className="bg-transparent text-light" scope="col" style={{ width: "80px" }}></th>
							<th className="bg-transparent text-light" scope="col">Tittel</th>
							<th className="bg-transparent text-light" scope="col">Type</th>
						</tr>
						</thead>
						<tbody>
						{favoriteMovies.map((movie, index) => (
							<tr key={index} className="align-middle text-center favorite-movie" onClick={() => handleShowDetailsFavorite(movie.id)}>
								<td className="bg-transparent">
									<img src={movie.poster} alt={movie.title} className="img-fluid rounded" style={{ maxWidth: "60px" }}/>
								</td>
								<td className="bg-transparent text-light">{movie.title}</td>
								<td className="text-capitalize bg-transparent text-light">{movie.type}</td>
							</tr>
						))}
						</tbody>
					</table>
				</div>
			}
		</div>
	);


}