import {SignedInLinks} from "./SignedInLinks";
import {SignedOutLinks} from "./SignedOutLinks";
import {NavLink} from "react-router-dom";

export const NavBar = () => {
	let user = true;
	return (
		<div className="navbar navbar-dark bg-body-secondary overflow-hidden">
			<div className="my-auto mx-3">
				<NavLink to={"/"} className="text-decoration-none my-auto">
					<h1 className="my-auto text-center"><strong>ReelRate</strong></h1>
				</NavLink>
			</div>
			<div className="my-auto">
				{user ? <SignedInLinks /> : <SignedOutLinks />}
			</div>
		</div>
	)
}