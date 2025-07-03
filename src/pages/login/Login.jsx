import { Link, useNavigate } from "react-router-dom";
import Glass from "../../components/glass/Glass";
import { useState, useEffect } from "react";
import { useGlobalStore } from "../../hooks/useGlobalStore";
import { loginUser } from "../../utils/api";
import { validateUsername, validatePassword } from "../../utils/helpers";
import "./Login.css";

function Login() {
  const { store, dispatch } = useGlobalStore();
  const [error, setError] = useState("");
  const [userInputs, setUserInput] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (store.user.isAuthenticated) {
      navigate("/home", { replace: true });
    }
  }, [store.user.isAuthenticated, navigate]);

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const usernameError = validateUsername(userInputs.username);
    if (usernameError) {
      setError(usernameError);
      return;
    }
    const passwordError = validatePassword(userInputs.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    try {
      const data = await loginUser({
        username: userInputs.username,
        password: userInputs.password,
      });
      dispatch({
        type: "LOGIN",
        payload: { token: data.token, user: data.user },
      });
      navigate("/home");
    } catch (err) {
      setError(err.message || "Something wrong happened! Please try again...");
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

          {error && (
            <p className="text-center text-danger fw-bold">{error}</p>
          )}

          <p className="text-center fw-bold custom-text">
            New to Play Haven?{" "}
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
