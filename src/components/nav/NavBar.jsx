import {SignedInLinks} from "./SignedInLinks";
import {SignedOutLinks} from "./SignedOutLinks";
import {NavLink} from "react-router-dom";
import {useFirebase} from "../../config/FbContext";

export const NavBar = () => {
	const { currentUser } = useFirebase();
	return (
		<div className="navbar navbar-dark shadow shadow-md p-3">
			<div className="my-auto mx-3">
				<NavLink to={"/"} className="nav-item nav-link px-2">
					<h1 className="my-auto text-center"><strong><i className="fa-solid fa-film"></i>ReelRate</strong></h1>
				</NavLink>
			</div>
			<div className="my-auto">
				{currentUser ? <SignedInLinks /> : <SignedOutLinks />}
			</div>
		</div>
	)
}