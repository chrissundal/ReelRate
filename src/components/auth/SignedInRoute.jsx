import { Navigate } from 'react-router-dom';
import { useFirebase } from '../../config/FbContext';
export const SignedInRoute = ({ children }) => {
	const { currentUser, loading } = useFirebase();

	if (loading) {
		return <div className="container center">
			<p>Laster...</p>
		</div>
	}

	if (!currentUser) {
		return <Navigate to="/signin" />;
	}

	return children;
}