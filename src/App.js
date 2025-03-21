import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { SignIn } from "./components/auth/SignIn";
import { SignUp } from "./components/auth/SignUp";
import { ResetPassword } from "./components/auth/ResetPassword";
import { AnimatePresence, motion } from 'framer-motion';
import { NavBar } from "./components/nav/NavBar";
import { MovieCategories } from "./components/views/MovieCategories";
import { MovieStart } from "./components/views/MovieStart";
import { MovieDetails } from "./components/views/MovieDetails";
import {MovieSearch} from "./components/views/MovieSearch";

const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <motion.div key={location.pathname} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }} className="route-container">
                <Routes location={location}>
                    <Route path={"/"} element={<MovieStart/>} />
                    <Route path={"/category"} element={<MovieCategories/>} />
                    <Route path={"/movie/:id"} element={<MovieDetails/>} />
                    <Route path={"/signin"} element={<SignIn/>} />
                    <Route path={"/signup"} element={<SignUp/>} />
                    <Route path={"/profile"} element={<h3>Her kommer profil</h3>} />
                    <Route path={"/search"} element={<MovieSearch/>} />
                    <Route path={"/reset-password"} element={<ResetPassword/>} />
                    <Route path={"*"} element={<h3>404, Ooops ikke gyldig side</h3>} />
                </Routes>
            </motion.div>
        </AnimatePresence>
    );
};

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <NavBar/>
                <AnimatedRoutes />
            </BrowserRouter>
        </div>
    );
}

export default App;