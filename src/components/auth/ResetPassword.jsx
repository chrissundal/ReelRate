import {useState} from "react";
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../config/FbConfig';
import {useNavigate} from "react-router-dom";

export const ResetPassword = () => {
	const [email, setEmail] = useState('');
	const [resetSent, setResetSent] = useState(false);
	const [error, setError] = useState(null);
	const navigate = useNavigate();
	const handleReset = async (e) => {
		e.preventDefault();
		setError(null);

		try {
			await sendPasswordResetEmail(auth, email);
			setResetSent(true);
		} catch (err) {
			setError(err.message);
		}
	}

	return (
		<div className="container mt-5">
			<div className="row justify-content-center">
				<div className="col-md-6 col-lg-4">
					<div className="card shadow border-0 rounded-4 shadow-md">
						<div className="card-body p-4">
							<h2 className="text-center mb-4 text-secondary">Tilbakestill passord</h2>
							{!resetSent ? (
								<form onSubmit={handleReset}>
									<div className="mb-3">
										<div className="form-floating">
											<input type="email" className="form-control border-0 border-bottom" id="floatingEmail" placeholder="" value={email} onChange={(e) => setEmail(e.target.value)} required/>
											<label htmlFor="floatingEmail" className="text-secondary">E-post</label>
										</div>
									</div>

									<div className={error ? "mb-3" : "d-none"}>
										{error && <div className="alert alert-danger text-center">{error}</div>}
									</div>

									<div className="d-grid gap-3 mb-3">
										<button type="submit" className="btn btn-primary btn-lg">Send nytt passord</button>
										<button type="button" className="btn btn-secondary btn-md w-50 mx-auto" onClick={() => navigate('/signin')}>Avbryt</button>
									</div>
								</form>
							) : (
								<div>
									<div className="alert alert-success mb-4">
										<h5 className="alert-heading">E-post sendt!</h5>
										<p>Vi har sendt en lenke for å tilbakestille passordet ditt til {email}.</p>
										<hr />
										<p className="mb-0">Sjekk e-posten din og følg instruksjonene for å fullføre tilbakestillingen.</p>
									</div>

									<div className="d-grid gap-2">
										<button className="btn btn-primary btn-lg" onClick={() => navigate('/signin')}>Gå til innloggingssiden</button>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}