import {NavLink} from "react-router-dom";

export const SignedOutLinks = () => {
	return (
		<div className={"my-auto text-center text-uppercase mx-2"}>
			<NavLink to={"/signin"} className="nav-item nav-link text-uppercase px-2">
				<strong>Sign in</strong>
			</NavLink>
		</div>
	)
}