import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GoogleCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGoogleUser = async () => {
            // Get the current URL which has the code parameter
            const params = new URLSearchParams(window.location.search);
            const code = params.get("code");

            try {
                // Call your backend to exchange code for user info
                const res = await axios.get(`https://event-management-system-backend-00sp.onrender.com/api/auth/google/callback?code=${code}`);
                const userDetails = res.data.details;

                // Store user in localStorage
                localStorage.setItem("user", JSON.stringify(userDetails));

                // Navigate to dashboard
                navigate("/dashboard");
            } catch (error) {
                console.error("Error fetching Google user", error);
                // Handle error case
            }
        };

        fetchGoogleUser();
    }, [navigate]);

    return <div>Loading...</div>;
};

export default GoogleCallback;
