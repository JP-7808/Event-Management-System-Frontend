import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "./login.css";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: undefined,
    password: undefined,
  });

  const { loading, error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
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

      // Store the token in localStorage
      localStorage.setItem("token", res.data.token); // Save the JWT token
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });

      // Store user info in localStorage if needed
      localStorage.setItem("user", JSON.stringify(res.data.details));

      navigate("/dashboard"); // Redirect to the dashboard after login
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
    }
  };

  // Handle Google Login
const handleGoogleLogin = async () => {
  try {
      window.open('https://event-management-system-backend-00sp.onrender.com/api/auth/google', '_self');
  } catch (err) {
      console.error("Error during Google login:", err);
  }
};

  // Handle Google Login response after redirect
  useEffect(() => {
    const fetchGoogleUser = async () => {
        try {
            const res = await axios.get(
                "https://event-management-system-backend-00sp.onrender.com/api/auth/status",
                { withCredentials: true }
            );
            
            console.log("Response received:", res); // Log full response
            console.log("Response data:", res.data); // Log response data only
            if (res.data.isAuthenticated) {
                // Dispatch to update user in AuthContext
                dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user });

                // Store user data and token in localStorage
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("user", JSON.stringify(res.data.user));
                
                navigate("/dashboard");
            }
        } catch (err) {
            console.error("Error fetching Google user after login:", err);
        }
    };

    fetchGoogleUser();
}, [dispatch, navigate]);



  return (
    <div className="login">
      <h2>Login</h2>
      <div className="lContainer">
        <input
          type="text"
          placeholder="Email"
          id="email"
          onChange={handleChange}
          className="lInput"
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          onChange={handleChange}
          className="lInput"
        />
        <button disabled={loading} onClick={handleClick} className="lButton">
          Login
        </button>

        {/* Google login button */}
        <button onClick={handleGoogleLogin} className="lButton">
          Login with Google
        </button>

        {error && <span>{error.message}</span>}
      </div>
    </div>
  );
};

export default Login;