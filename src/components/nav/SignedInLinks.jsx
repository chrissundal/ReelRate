import {NavLink} from "react-router-dom";
import { signOut } from 'firebase/auth';
import { auth } from '../../config/FbConfig';
import {useFirebase} from "../../config/FbContext";
import { useState } from 'react';

export const SignedInLinks = () => {
	const { currentUser } = useFirebase();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const handleSignOut = async () => {
		try {
			await signOut(auth);
			setIsMenuOpen(false);
		} catch (err) {
			console.error('Feil ved utlogging', err);
		}
	};

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	return (
		<div className="navbar-nav">
			<button
				className="navbar-toggler d-md-none mx-3"
				type="button"
				onClick={toggleMenu}
				aria-expanded={isMenuOpen ? "true" : "false"}
				aria-label="Vis navigasjonsmeny">
				<span className="navbar-toggler-icon"></span>
			</button>

			{/* mobil */}
			<div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
				<div className="navbar-nav text-center">
					<NavLink to={"/search"} className="nav-item nav-link text-uppercase mt-2" onClick={() => setIsMenuOpen(false)}>
						<strong>Søk</strong>
					</NavLink>
					<NavLink to={"/profile"} className="nav-item nav-link text-uppercase" onClick={() => setIsMenuOpen(false)}>
						<strong>Profil</strong>
					</NavLink>
					<button onClick={handleSignOut} className="nav-item nav-link text-uppercase border-0 bg-transparent">
						<strong>Logg ut</strong>
					</button>
				</div>
			</div>

			{/* desktop */}
			<div className="d-none d-md-flex align-items-center">
				<button
					onClick={handleSignOut}
					className="nav-item nav-link text-uppercase border-0 bg-transparent px-2"
					style={{ verticalAlign: 'baseline', fontWeight: 'inherit', fontSize: 'inherit' }}>
					<strong>Logg ut</strong>
				</button>
				<NavLink to={"/search"} className="nav-item nav-link text-uppercase px-2">
					<strong>Søk</strong>
				</NavLink>
				<NavLink to={"/profile"} className="nav-item nav-link text-uppercase px-2">
					<strong>Profil</strong>
				</NavLink>
			</div>
		</div>
	);
};