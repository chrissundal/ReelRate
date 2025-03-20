import {useNavigate} from "react-router-dom";
import {useState} from "react";
import { createUserWithEmailAndPassword , updateProfile} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import {auth, db} from "../../config/FbConfig";

export const SignUp = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [error, setError] = useState(null);
	const navigate = useNavigate();
	const handleSignup = async (e) => {
		e.preventDefault();
		setError(null)
		if (password !== confirmPassword) {
			setError("Passordene er ikke like");
			return;
		}
		try {
			const userCredential = await createUserWithEmailAndPassword(auth, email, password);
			const user = userCredential.user;
			await updateProfile(user, {
				displayName: `${firstName} ${lastName}`
			});
			await setDoc(doc(db, 'users', user.uid), {
				firstName: firstName,
				lastName: lastName,
				email: email,
				favorites: [],
				createdAt: serverTimestamp()
			});
			navigate('/');
		} catch (err) {
			console.error("Feil ved registrering:", err);
			setError(err.message);
		}
	};
	return (
		<div className="container mt-5">
			<div className="row justify-content-center">
				<div className="col-md-6 col-lg-4">
					<div className="card shadow border-0 rounded-4 shadow-md">
						<div className="card-body p-4">
							<h2 className="text-center mb-4 text-secondary">Registrer deg</h2>
							<form onSubmit={handleSignup}>
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
								<div className="mb-3">
									<div className="form-floating">
										<input type="password" className="form-control border-0 border-bottom" id="floatingConfirmPassword" placeholder="Repeter passord" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required/>
										<label htmlFor="floatingConfirmPassword" className="text-secondary">Repeter passord</label>
									</div>
								</div>

								<div className="mb-3">
									<div className="form-floating">
										<input type="text" className="form-control border-0 border-bottom" id="floatingFirstName" placeholder="Fornavn" value={firstName} onChange={(e) => setFirstName(e.target.value)} required/>
										<label htmlFor="floatingFirstName" className="text-secondary">Fornavn</label>
									</div>
								</div>

								<div className="mb-3">
									<div className="form-floating">
										<input type="text" className="form-control border-0 border-bottom" id="floatingLastName" placeholder="Etternavn" value={lastName} onChange={(e) => setLastName(e.target.value)} required/>
										<label htmlFor="floatingLastName" className="text-secondary">Etternavn</label>
									</div>
								</div>
								<div className="mb-3">
									{error && <div className="alert alert-danger text-center">{error}</div>}
								</div>
								<div className="d-grid gap-3 mt-5 mb-3">
									<button type="submit" className="btn btn-primary btn-lg">
										Registrer deg
									</button>
									<button className="btn btn-secondary btn-md w-50 mx-auto" onClick={() => navigate('/signin')}>
										Avbryt
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}