import { Link, useNavigate } from "react-router-dom";
import Glass from "../../components/glass/Glass";
import { useState } from "react";
import { useGlobalStore } from "../../hooks/useGlobalStore";
import "./Login.css";

function Login() {
  const { store, dispatch } = useGlobalStore();
  const [error, setError] = useState(false);
  const [userInputs, setUserInput] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userInputs.username,
          password: userInputs.password,
        }),
      });
      const data = await response.json();
      if (response.ok && data && data.token) {
        dispatch({
          type: "LOGIN",
          payload: { token: data.token, user: data.user },
        });
        navigate("/home");
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center py-5">
      <Glass>
        <form onSubmit={handleOnSubmit}>
          <h3 className="fw-bolder mb-3 text-center custom-text">Login</h3>

          <div className="mb-2 fw-bold">
            <input
              type="text"
              className="form-control rounded-4 custom-input"
              id="input-username"
              placeholder="Username"
              onChange={(e) =>
                setUserInput({ ...userInputs, username: e.target.value })
              }
              value={userInputs.username}
            />
          </div>

          <div className="mb-2 fw-bold">
            <input
              type="password"
              className="form-control rounded-4 custom-input"
              id="input-password"
              placeholder="Password"
              onChange={(e) =>
                setUserInput({ ...userInputs, password: e.target.value })
              }
              value={userInputs.password}
            />
          </div>

          {error ? (
            <>
              <p className="text-center text-danger fw-bold">
                Something wrong happened! Please try again...
              </p>
            </>
          ) : (
            <></>
          )}

          <p className="text-center fw-bold custom-text">
            New to Play Heaven?{" "}
            <Link className="fw-bolder text-link" to="/signup">
              Sign Up
            </Link>
          </p>

          <div className="mb-1">
            <button
              type="submit"
              className="custom-button fs-4 col-12 fw-bolder rounded-5"
            >
              Continue
            </button>
          </div>
        </form>
      </Glass>
    </div>
  );
}

export default Login;
