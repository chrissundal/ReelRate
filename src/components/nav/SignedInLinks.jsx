import {NavLink} from "react-router-dom";

export const SignedInLinks = () => {
	return (
		<div className={"text-center text-uppercase mx-2"}>
			<NavLink to={"/signin"} className="text-decoration-none px-2">
				<span><strong>Sign out</strong></span>
			</NavLink>
			<NavLink to={"/"} className="text-decoration-none px-2">
				<span><strong>search</strong></span>
			</NavLink>
			<NavLink to={"/profile"} className="text-decoration-none px-2">
				<span><strong>profile</strong></span>
			</NavLink>
		</div>
	)
}