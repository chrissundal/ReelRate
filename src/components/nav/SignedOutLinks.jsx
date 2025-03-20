import {NavLink} from "react-router-dom";

export const SignedOutLinks = () => {
	return (
		<div className={"my-auto text-center text-uppercase mx-2"}>
			<NavLink to={"/signin"} className="text-decoration-none px-2 mx-1">
				<span><strong>Sign in</strong></span>
			</NavLink>
		</div>
	)
}