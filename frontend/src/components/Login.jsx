import React from "react";
import { useState } from "react";
import { register, login } from "../services/Auth";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginval, setLoginval] = useState(true);
  const [loginMessage, setLoginMessage] = useState("");
  const API_URL = "http://localhost:3001/";
  const navigate = useNavigate();

  const handleRegister = () => {
    register(username, password);
  };

  const handleLogin = () => {
    // Make the API call using fetch
    fetch(API_URL + "login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Authentication failed");
        }
        return response.json();
      })
      .then((data) => {
        // Update the state with the login message from the API response
        console.log(data);
        setLoginMessage(data.message);
        if (data.message === "Authentication successful") {
          navigate("/mode-select");
          localStorage.setItem("username", data.username);
        }
      })
      .catch((error) => {
        console.error(error);
        // Handle authentication failure or other errors
        setLoginMessage("Authentication failed");
      });
  };

  return (
    <div className="flex flex-col justify-center h-screen w-screen items-center">
      <div className="bg-[#181818] h-1/2 w-1/2 rounded-md shadow-lg flex flex-col items-center justify-center">
        <div className="text-3xl mb-4 ">
          {loginval === true ? "Login" : "SignUp"}
        </div>
        <input
          className="bg-[#353535] h-8 px-1 w-1/2 rounded-md shadow-lg mb-8 outline-none"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <input
          className="bg-[#353535] h-8 px-1 w-1/2 rounded-md shadow-lg mb-8 outline-none"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        {loginval && (
          <button
            className="bg-[#6c6b6b] text-black hover:bg-black hover:text-white outline-none py-1"
            onClick={handleLogin}
          >
            Log In
          </button>
        )}
        {!loginval && (
          <button
            className="bg-[#6c6b6b] text-black hover:bg-black hover:text-white outline-none py-1"
            onClick={handleRegister}
          >
            Sign Up
          </button>
        )}
        {loginval && (
          <span className="mt-4 text-gray-400">
            Don't have an account?{" "}
            <b
              className="cursor-pointer"
              onClick={() => {
                setLoginval(false);
              }}
            >
              Create Account
            </b>
          </span>
        )}
        {!loginval && (
          <span className="mt-4 text-gray-400">
            Already have an account?{" "}
            <b
              className="cursor-pointer"
              onClick={() => {
                setLoginval(true);
              }}
            >
              Log In
            </b>
          </span>
        )}
      </div>
    </div>
  );
}

export default Login;
