import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    });

    const { dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        dispatch({ type: "LOGIN_START" });
        try {
            const res = await axios.post(
                "https://event-management-system-backend-00sp.onrender.com/api/auth/login",
                credentials,
                { withCredentials: true }
            );

            if (res.data.token && res.data.user) {
                // Store the token and user data in localStorage if needed
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("user", JSON.stringify(res.data.user));

                dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user });

                // Redirect to the dashboard after successful login
                navigate("/dashboard");
            } else {
                console.error("Login response missing token or user details:", res.data);
                dispatch({ type: "LOGIN_FAILURE", payload: { msg: "Login failed: Invalid response format" } });
            }
        } catch (err) {
            console.error("Login failed:", err);
            dispatch({ type: "LOGIN_FAILURE", payload: err.response ? err.response.data : { msg: "An error occurred" } });
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const res = await axios.get("https://event-management-system-backend-00sp.onrender.com/api/auth/google", {
                withCredentials: true,
            });

            if (res.data.token && res.data.user) {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("user", JSON.stringify(res.data.user));

                dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user });
                navigate("/dashboard");
            } else {
                console.error("Google login response missing token or user details:", res.data);
                dispatch({ type: "LOGIN_FAILURE", payload: { msg: "Google login failed: Invalid response format" } });
            }
        } catch (err) {
            console.error("Google login failed:", err);
            dispatch({ type: "LOGIN_FAILURE", payload: err.response ? err.response.data : { msg: "An error occurred" } });
        }
    };

    return (
        <div className="login">
            <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                value={credentials.email}
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                value={credentials.password}
            />
            <button onClick={handleClick}>Login with Email</button>
            <button onClick={handleGoogleLogin}>Login with Google</button>
        </div>
    );
};

export default Login;
