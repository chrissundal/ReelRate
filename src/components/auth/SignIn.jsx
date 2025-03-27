import {useEffect, useState} from "react";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/FbConfig';
import {NavLink, useNavigate} from "react-router-dom";

export const SignIn = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate()

	useEffect(() => {
		document.title = 'Logg inn | ReelRate';
		return () => {
			document.title = 'ReelRate';
		};
	}, []);
	const handleLogin = async (e) => {
		e.preventDefault();
		setError(null)
		try {
			await signInWithEmailAndPassword(auth, email, password);
			navigate('/');
		} catch (err) {
			setError(err.message);
		}
	};

	return (
		<div className="container mt-5">
			<div className="row justify-content-center">
				<div className="col-md-6 col-lg-4">
					<div className="card shadow border-0 rounded-4 shadow-md">
						<div className="card-body p-4">
							<h2 className="text-center mb-4 text-secondary">Logg Inn</h2>
							<form onSubmit={handleLogin}>
								<div className="mb-3">
									<div className="form-floating">
										<input type="email" className="form-control border-0 border-bottom" id="floatingEmail" placeholder="din.epost@eksempel.no" value={email} onChange={(e) => setEmail(e.target.value)} required/>
										<label htmlFor="floatingEmail" className="text-secondary">E-post</label>
									</div>
								</div>

								<div className="mb-3">
									<div className="form-floating">
										<input type="password" className="form-control border-0 border-bottom" id="floatingPassword" placeholder="Ditt passord" value={password} onChange={(e) => setPassword(e.target.value)} required/>
										<label htmlFor="floatingPassword" className="text-secondary">Passord</label>
									</div>
								</div>
								<div className={ error ? "mb-3" : "d-none"}>
									{error && <div className="alert alert-danger text-center">{error}</div>}
								</div>
								<div className="d-grid gap-2">
									<button type="submit" className="btn btn-primary btn-lg">
										Logg inn
									</button>
								</div>
								<div className="text-center mt-3">
									<NavLink to='/reset-password' className="text-decoration-none">Glemt passord?</NavLink>
								</div>
								<div className="text-center mt-3">
									<p className="text-secondary">Ikke registrert? <NavLink to='/signup' className="text-decoration-none">Registrer deg</NavLink></p>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};