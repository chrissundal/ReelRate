import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { SignIn } from "./components/auth/SignIn";
import { SignUp } from "./components/auth/SignUp";
import { ResetPassword } from "./components/auth/ResetPassword";
import { AnimatePresence, motion } from 'framer-motion';
import {NavBar} from "./components/nav/NavBar";

const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <motion.div key={location.pathname} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }} className="route-container">
                <Routes location={location}>
                    <Route path={"/"} element={<h1>Hello World</h1>} />
                    <Route path={"/signin"} element={<SignIn/>} />
                    <Route path={"/signup"} element={<SignUp/>} />
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